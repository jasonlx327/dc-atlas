#!/usr/bin/env python3
"""Daily industry-network builder: watch packet -> edges -> estimates -> merged store.

Closes the loop between the daily atlas-watch packet and the site's industry-network
data module: normalize relationship edges, attach estimates (or mark vacant), merge
with the seed store by (from, relation, to) upsert, and write the merged store.
The site module is then regenerated from this store by sync-industry-network-data.mjs.

Usage:
  python3 scripts/build_industry_network.py docs/daily-reviews/2026-08-06-watch-packet.json \
    --date 2026-08-06 --seed scripts/fixtures/seed-industry-network.json \
    --output docs/daily-reviews/2026-08-06-industry-network.json
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import build_relationship_edges as bre  # noqa: E402
import estimate_edges as ee  # noqa: E402

LADDERS = {
    "投资": ["宣布", "签署", "交割"],
    "订单": ["宣布", "签署", "交付"],
    "供货": ["宣布", "签署", "交付"],
    "租约": ["宣布", "签署", "入驻"],
    "供电": ["宣布", "签署", "运营"],
    "冷却": ["宣布", "签署", "运营"],
    "合作": ["宣布", "签署", "运营"],
    "并购": ["宣布", "交割"],
    "竞争": ["进行中"],
    "监管": ["起草", "生效"],
}

STATUS_INDEX = {
    "announced": 0, "mou": 0, "draft": 0,
    "signed": 1, "closed": 1, "in-force": 1,
    "delivering": 2, "operational": 2, "occupied": 2, "adopted": 1,
    "billed": 3, "exited": 3, "ongoing": 0,
}

KIND_BY_REL = {
    "投资": "cloud", "订单": "hw", "供货": "hw", "租约": "cloud",
    "供电": "power", "冷却": "hw", "合作": "cloud", "并购": "cloud",
    "竞争": "chips", "监管": "power",
}


def placeholder_entity(eid, name, rel_label):
    short = name if len(name) <= 6 else name[:6]
    return {
        "id": eid,
        "name": name,
        "short": short,
        "en": name,
        "tick": "NEW",
        "kind": KIND_BY_REL.get(rel_label, "cloud"),
    }


def to_site_edge(edge):
    """Convert a normalized pipeline edge into the site module's edge shape."""
    rel_label = edge.get("relation_label") or bre.TAXONOMY.get(edge.get("relation"), edge.get("relation"))
    ladder = LADDERS.get(rel_label, ["宣布", "签署", "交付"])
    status = STATUS_INDEX.get(edge.get("status") or "", 0)
    source_ids = edge.get("source_item_ids") or []
    return {
        "id": "{}|{}|{}".format(edge["from"], edge["to"], rel_label),
        "from": edge["from"],
        "to": edge["to"],
        "rel": rel_label,
        "detail": rel_label,
        "amount": None,
        "status": status,
        "ladder": ladder,
        "observed": edge["observed_at"],
        "evidence": edge["evidence_label"],
        "source": "watch {}".format(source_ids[0] if source_ids else "packet"),
        "url": "watch:{}".format(source_ids[0]) if source_ids else "",
        "segment": edge.get("segment"),
        "quantity": edge.get("quantity"),
        "quantity_unit": edge.get("quantity_unit"),
        "capacity_racks": edge.get("capacity_racks"),
        "region": edge.get("region"),
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("packet", help="atlas-watch packet JSON")
    ap.add_argument("--date", required=True, help="run date, e.g. 2026-08-06")
    ap.add_argument("--seed", default=os.path.join(ROOT, "scripts", "fixtures", "seed-industry-network.json"))
    ap.add_argument("--output", required=True)
    args = ap.parse_args()

    try:
        packet = json.load(open(args.packet, encoding="utf-8"))
        seed = json.load(open(args.seed, encoding="utf-8"))
    except OSError as exc:
        print("read-failed:", exc)
        sys.exit(1)

    raw_edges = bre.collect_edges(packet)
    display_names = {}
    for raw in raw_edges:
        for field in ("from", "to"):
            raw_name = str(raw.get(field) or "").strip()
            slug = bre.resolve(raw_name)
            if slug and slug not in display_names:
                display_names[slug] = raw_name
    passed, failed = [], []
    for raw in raw_edges:
        norm, norm_errors = bre.normalize_edge(raw)
        if norm is None:
            failed.append({"input": raw, "reasons": norm_errors})
            continue
        edge, reasons = bre.validate(raw, norm)
        if reasons:
            failed.append({"input": raw, "normalized": norm, "reasons": reasons})
        else:
            passed.append(edge)

    bench_by_id = ee.load_benchmarks(os.path.join(ROOT, "scripts", "benchmarks.json"))
    rules = {
        "power": {"benchmarks": [bench_by_id[i] for i in ee.RULE_POWER["benchmarks"]], "capacity_factor": ee.RULE_POWER["capacity_factor"]},
        "cool": {"benchmarks": [bench_by_id[i] for i in ee.RULE_COOL["benchmarks"]]},
    }

    entities = dict(seed.get("entities", {}))
    edges = list(seed.get("edges", []))
    estimates = dict(seed.get("estimates", {}))
    seen = {e["id"] for e in edges}
    new_edges = 0
    updated_edges = 0

    for edge in passed:
        site_edge = to_site_edge(edge)
        edge_id = site_edge["id"]
        for eid in (site_edge["from"], site_edge["to"]):
            if eid not in entities:
                entities[eid] = placeholder_entity(eid, display_names.get(eid, eid), site_edge["rel"])
        tier, est = ee.estimate_edge(
            {**edge, "segment": site_edge["segment"], "quantity": site_edge["quantity"], "capacity_racks": site_edge["capacity_racks"], "region": site_edge["region"]},
            bench_by_id,
            rules,
        )
        if tier == "estimated" and est:
            est_key = "{}|{}|{}".format(site_edge["from"], site_edge["to"], site_edge["rel"])
            estimates[est_key] = {"range": est["range"], "method": est["method"], "basis": est["basis"], "conf": est["confidence"]}
        if edge_id in seen:
            for idx, existing in enumerate(edges):
                if existing["id"] == edge_id:
                    edges[idx] = site_edge
                    updated_edges += 1
                    break
        else:
            edges.append(site_edge)
            seen.add(edge_id)
            new_edges += 1

    stats = {
        "seed_edges": len(seed.get("edges", [])),
        "new_edges": new_edges,
        "updated_edges": updated_edges,
        "total_edges": len(edges),
        "entities": len(entities),
        "disclosed": sum(1 for e in edges if e.get("amount") is not None),
        "estimated": sum(1 for e in edges if e.get("amount") is None and "{}|{}|{}".format(e["from"], e["to"], e["rel"]) in estimates),
        "vacant": sum(1 for e in edges if e.get("amount") is None and "{}|{}|{}".format(e["from"], e["to"], e["rel"]) not in estimates),
        "watch_passed": len(passed),
        "watch_failed": len(failed),
    }
    store = {
        "schema": "atlas-industry-network.v1",
        "updated_at": args.date,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "entities": entities,
        "edges": edges,
        "estimates": estimates,
        "stats": stats,
    }
    with open(args.output, "w", encoding="utf-8") as fh:
        json.dump(store, fh, ensure_ascii=False, indent=2)
    print(json.dumps(stats, ensure_ascii=False, indent=2))
    for fail in failed:
        print("FAILED:", fail["reasons"], "|", json.dumps(fail.get("input", {}), ensure_ascii=False)[:180])


if __name__ == "__main__":
    main()
