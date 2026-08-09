#!/usr/bin/env python3
"""IDC Atlas relationship-edge pilot pipeline.

Reads an atlas-watch packet (or a plain list of relationship edges), normalizes
each edge against the industry-network spec taxonomy, resolves entities against
the seeded alias map, validates every gate, and writes the extended edge store
plus a validation report. Fully automated; no manual review step.

Usage:
  python3 scripts/build_relationship_edges.py \
    docs/daily-reviews/2026-08-05-watch-packet.json \
    --output docs/daily-reviews/2026-08-05-relationship-edges.json
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone

SCHEMA = "atlas-relationship.v1"

TAXONOMY = {
    "invests-in": "投资", "finances": "投资",
    "orders-from": "订单", "buys-from": "订单",
    "supplies": "供货", "leases-to": "租约", "hosts": "租约",
    "powers": "供电", "cools": "冷却",
    "partners-with": "合作", "acquires": "并购", "owns": "并购",
    "competes-with": "竞争", "regulates": "监管",
}

REVERSE = {"orders-from": "supplies", "buys-from": "supplies"}

RELATION_NORMALIZE = {
    "plans-to-use": ("supplies", "reverse"),
    "plans-to-buy": ("orders-from", "reverse"),
    "will-use": ("supplies", "reverse"),
    "invests-in": ("invests-in", "keep"),
    "invested-in": ("invests-in", "keep"),
    "acquires": ("acquires", "keep"),
    "acquired": ("acquires", "keep"),
    "acquires-stake-in": ("acquires", "keep"),
    "leases-to": ("leases-to", "keep"),
    "leases-from": ("leases-to", "reverse"),
    "partners-with": ("partners-with", "keep"),
    "supplies": ("supplies", "keep"),
    "buys-from": ("orders-from", "keep"),
    "orders-from": ("orders-from", "keep"),
    "hosts": ("hosts", "keep"),
    "powers": ("powers", "keep"),
    "cools": ("cools", "keep"),
    "finances": ("finances", "keep"),
    "owns": ("owns", "keep"),
    "competes-with": ("competes-with", "keep"),
    "regulates": ("regulates", "keep"),
}

LADDERS = {
    "invests-in": ["mou", "signed", "closed", "exited"],
    "finances": ["mou", "signed", "closed", "exited"],
    "orders-from": ["announced", "signed", "delivering", "billed"],
    "supplies": ["announced", "signed", "delivering", "billed"],
    "leases-to": ["announced", "signed", "occupied"],
    "hosts": ["announced", "signed", "occupied"],
    "powers": ["announced", "signed", "operational"],
    "cools": ["announced", "signed", "operational"],
    "partners-with": ["announced", "signed", "operational"],
    "acquires": ["announced", "signed", "closed"],
    "owns": ["announced", "signed", "closed"],
    "competes-with": ["ongoing"],
    "regulates": ["draft", "adopted", "in-force"],
}

EVIDENCE_MAP = {
    "officially-confirmed": "official",
    "company-response": "management",
    "official": "official",
    "management": "management",
    "media-reported": "media",
    "single-source-report": "media",
    "multi-source-report": "media",
    "contested": "media",
    "unverified-lead": "media",
}

ALIASES = {
    "alibaba": ["阿里巴巴", "阿里", "Alibaba", "Alibaba Cloud", "阿里云", "BABA"],
    "microsoft": ["微软", "Microsoft", "Azure", "MSFT"],
    "amazon": ["亚马逊", "Amazon", "AWS"],
    "meta": ["Meta", "Facebook"],
    "alphabet": ["Alphabet", "Google", "GOOGL"],
    "vertiv": ["Vertiv", "VRT"],
    "digital-realty": ["Digital Realty", "DLR"],
    "nvidia": ["英伟达", "NVIDIA", "NVDA"],
    "amd": ["超威半导体", "AMD"],
    "micron": ["美光", "Micron", "MU"],
    "sk-hynix": ["SK 海力士", "SK hynix", "海力士"],
    "arm": ["Arm", "ARM"],
    "data-port": ["数据港", "Shanghai DataPort"],
    "vnet": ["世纪互联", "VNET"],
    "aofei-data": ["奥飞数据", "Aofei Data"],
    "range-technology": ["润泽科技", "Range Technology"],
    "gds": ["万国数据", "GDS"],
    "cxmt": ["长鑫科技", "CXMT", "ChangXin"],
    "hygon": ["海光信息", "Hygon"],
    "metax": ["沐曦", "MetaX"],
    "openai": ["OpenAI"],
    "anthropic": ["Anthropic"],
    "oracle": ["甲骨文", "Oracle", "ORCL"],
    "intel": ["Intel"],
    "hut8": ["Hut 8", "HUT"],
    "galaxy": ["Galaxy", "GLXY"],
    "terawulf": ["TeraWulf", "WULF"],
    "spacex": ["SpaceX"],
    "partners-group": ["Partners Group", "Partners Group Holding", "PGHN"],
    "avk": ["AVK", "AVK Holding"],
    "volta-infra": ["Volta Infra Holdings", "Volta Infra"],
    "nexus-data-centers": ["Nexus Data Centers", "Nexus DC"],
    "bitdeer": ["Bitdeer", "BTDR"],
}

SLUG_FOR_NAME = {}
for slug, names in ALIASES.items():
    for n in names:
        SLUG_FOR_NAME[n.lower()] = slug


def resolve(name):
    key = str(name).strip().lower()
    if key in SLUG_FOR_NAME:
        return SLUG_FOR_NAME[key]
    return None


def normalize_edge(raw):
    rel_key = str(raw.get("relation", "")).strip().lower()
    if rel_key not in RELATION_NORMALIZE:
        return None, ["unknown-relation:" + rel_key]
    rel, mode = RELATION_NORMALIZE[rel_key]
    frm, to = raw.get("from"), raw.get("to")
    if mode == "reverse":
        frm, to = to, frm
    return {"from": frm, "relation": rel, "to": to}, []


def validate(raw, norm):
    reasons = []
    if norm["relation"] not in TAXONOMY:
        reasons.append("relation-not-in-taxonomy")
    from_slug = resolve(norm["from"])
    to_slug = resolve(norm["to"])
    if from_slug is None:
        reasons.append("unresolved-entity:" + str(norm["from"]))
    if to_slug is None:
        reasons.append("unresolved-entity:" + str(norm["to"]))
    observed = raw.get("observed_at") or raw.get("observedAt")
    if not observed:
        reasons.append("missing-observed-at")
    else:
        try:
            datetime.fromisoformat(observed.replace("Z", "+00:00"))
        except ValueError:
            reasons.append("bad-observed-at")
    ev = raw.get("evidence_status") or raw.get("evidence_label") or "unverified-lead"
    label = EVIDENCE_MAP.get(str(ev).strip().lower(), "media")
    sources = raw.get("source_item_ids") or raw.get("source_item_ids") or []
    if not sources:
        reasons.append("missing-source-item-ids")
    amount = raw.get("amount")
    if amount is not None and not raw.get("amount_currency") and not raw.get("unit"):
        reasons.append("amount-without-unit-or-currency")
    capacity = raw.get("capacity_mw")
    if capacity is not None and not isinstance(capacity, (int, float)):
        reasons.append("capacity-mw-not-numeric")
    quantity = raw.get("quantity")
    if quantity is not None and not isinstance(quantity, (int, float)):
        reasons.append("quantity-not-numeric")
    racks = raw.get("capacity_racks")
    if racks is not None and not isinstance(racks, (int, float)):
        reasons.append("capacity-racks-not-numeric")
    status = str(raw.get("status") or "").strip().lower()
    if status and status not in LADDERS.get(norm["relation"], []):
        reasons.append("status-not-in-ladder:" + status)
    return {
        "from": from_slug or norm["from"],
        "to": to_slug or norm["to"],
        "relation": norm["relation"],
        "relation_label": TAXONOMY.get(norm["relation"], norm["relation"]),
        "amount": raw.get("amount"),
        "amount_currency": raw.get("amount_currency"),
        "capacity_mw": raw.get("capacity_mw"),
        "capacity_unit": raw.get("capacity_unit"),
        "status": status or LADDERS.get(norm["relation"], [""])[0],
        "observed_at": observed,
        "valid_from": raw.get("valid_from"),
        "valid_to": raw.get("valid_to"),
        "evidence_label": label,
        "source_item_ids": sources,
        "segment": raw.get("segment"),
        "quantity": raw.get("quantity"),
        "quantity_unit": raw.get("quantity_unit"),
        "capacity_racks": raw.get("capacity_racks"),
        "region": raw.get("region"),
        "last_verified_at": datetime.now(timezone.utc).isoformat(),
    }, reasons


def collect_edges(packet):
    if isinstance(packet, list):
        return packet
    out = []
    for cluster in packet.get("clusters", []):
        out.extend(cluster.get("relationship_edges", []))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("packet")
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    try:
        packet = json.load(open(args.packet, encoding="utf-8"))
    except OSError as exc:
        print("packet-read-failed:", exc)
        sys.exit(1)
    raw_edges = collect_edges(packet)
    passed, failed = [], []
    for raw in raw_edges:
        norm, norm_errors = normalize_edge(raw)
        if norm is None:
            failed.append({"input": raw, "reasons": norm_errors})
            continue
        edge, reasons = validate(raw, norm)
        if reasons:
            failed.append({"input": raw, "normalized": norm, "reasons": reasons})
        else:
            passed.append(edge)
    stats = {
        "input_edges": len(raw_edges),
        "passed": len(passed),
        "failed": len(failed),
        "by_evidence": {},
        "by_relation": {},
    }
    for e in passed:
        stats["by_evidence"][e["evidence_label"]] = stats["by_evidence"].get(e["evidence_label"], 0) + 1
        stats["by_relation"][e["relation"]] = stats["by_relation"].get(e["relation"], 0) + 1
    report = {
        "schema_version": SCHEMA,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_packet": args.packet,
        "stats": stats,
        "edges": passed,
        "failures": failed,
    }
    with open(args.output, "w", encoding="utf-8") as fh:
        json.dump(report, fh, ensure_ascii=False, indent=2)
    print(json.dumps(stats, ensure_ascii=False, indent=2))
    for fail in failed:
        print("FAILED:", fail["reasons"], "|", json.dumps(fail.get("input", {}), ensure_ascii=False)[:180])


if __name__ == "__main__":
    main()
