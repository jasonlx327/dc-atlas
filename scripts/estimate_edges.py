#!/usr/bin/env python3
"""IDC Atlas estimate engine: turn edge data + benchmarks into estimates or vacancies.

Reads the normalized relationship-edge store produced by build_relationship_edges.py
and the benchmark catalog scripts/benchmarks.json. For every edge without a disclosed
amount, it either attaches an estimate (range + method + basis + confidence) or marks
the edge as vacant with a reason. It never fabricates numbers: no matching benchmark
or no quantity -> vacant.

Usage:
  python3 scripts/estimate_edges.py input-edges.json \
    --benchmarks scripts/benchmarks.json --output out.json
  python3 scripts/estimate_edges.py --check
"""

import argparse
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BENCHMARKS_DEFAULT = os.path.join(ROOT, "scripts", "benchmarks.json")
FIXTURE = os.path.join(ROOT, "scripts", "fixtures", "estimate-edges-fixture.json")

SEGMENT_BENCH = {
    "gpu-h100": "gpu-asp-h100-us",
    "gpu-h200": "gpu-asp-h200-us",
    "gpu-b200": "gpu-asp-b200-us",
    "gpu-h20": "gpu-asp-h20-cn",
    "rack-gb200": "rack-gb200-nvl72-us",
    "server-8g-cn": "gpu-server-8g-h200-cn",
    "hbm3e": "hbm3e-per-gb-ref",
}

# Relation-based rules: (benchmark ids, quantity extractor, unit label, capacity factor)
RULE_POWER = {
    "benchmarks": ["ppa-solar-na-p25", "ppa-wind-na-p25"],
    "capacity_factor": (0.22, 0.38),  # low = solar at 22% CF, high = wind at 38% CF
    "unit_label": "USD",
}
RULE_COOL = {
    "benchmarks": ["cooling-asp-per-kw"],
    "unit_label": "USD",
}


def fmt_range(vmin, vmax, unit):
    if vmin is None or vmax is None:
        return None
    if abs(vmin - vmax) < 1e-9:
        return "约 {:,} {}".format(int(round(vmin)), unit)
    return "约 {:,}–{:,} {}".format(int(round(vmin)), int(round(vmax)), unit)


def estimate_edge(edge, bench_by_id, rules):
    """Return (tier, est_dict) where tier in disclosed/estimated/vacant."""
    if edge.get("amount") is not None:
        return "disclosed", None

    b = None
    method = None
    basis = None
    conf = None
    qty = None

    segment = str(edge.get("segment") or "").strip().lower()
    if segment in SEGMENT_BENCH:
        b = bench_by_id.get(SEGMENT_BENCH[segment])
        qty = edge.get("quantity")
        if qty is None:
            return "vacant", {"reason": "缺少数量口径（quantity），无法用量 × 单价估算"}
        vmin = float(b["value_min"]) * float(qty)
        vmax = float(b["value_max"]) * float(qty)
        unit_label = b["unit"].split("/")[0]
        method = "{} × {}".format(b["metric"], edge.get("quantity_unit") or "数量")
        basis = b["name"] + "（" + "；".join(s["title"] for s in b["sources"][:1]) + "）"
        conf = b["confidence"]
        return "estimated", {
            "range": fmt_range(vmin, vmax, unit_label),
            "method": method,
            "basis": basis,
            "confidence": conf,
            "benchmark_id": b["id"],
        }

    rel = str(edge.get("relation") or "").strip()
    mw = edge.get("capacity_mw")

    if rel == "powers":
        if mw is None:
            return "vacant", {"reason": "供电边缺少容量（capacity_mw），无法估算年购电金额"}
        lo_cf, hi_cf = rules["power"]["capacity_factor"]
        vals = [float(x["value_min"]) * float(mw) * 8760 * lo_cf for x in rules["power"]["benchmarks"]]
        vals += [float(x["value_max"]) * float(mw) * 8760 * hi_cf for x in rules["power"]["benchmarks"]]
        b = rules["power"]["benchmarks"]
        method = "PPA 电价 × 供电容量(MW) × 年小时数 × 容量系数({:.0f}%–{:.0f}%)".format(lo_cf * 100, hi_cf * 100)
        basis = "LevelTen 北美太阳能/风电 PPA P25（Q4 2025）"
        conf = "中"
        return "estimated", {
            "range": fmt_range(min(vals), max(vals), "USD/年"),
            "method": method,
            "basis": basis,
            "confidence": conf,
            "benchmark_id": "|".join(x["id"] for x in b),
        }

    if rel == "cools":
        if mw is None:
            return "vacant", {"reason": "冷却边缺少容量（capacity_mw），无法估算"}
        kw = float(mw) * 1000
        b = rules["cool"]["benchmarks"][0]
        vmin = float(b["value_min"]) * kw
        vmax = float(b["value_max"]) * kw
        method = "液冷单价(USD/kW) × 服务容量(kW)"
        basis = b["name"]
        conf = b["confidence"]
        return "estimated", {
            "range": fmt_range(vmin, vmax, "USD"),
            "method": method,
            "basis": basis,
            "confidence": conf,
            "benchmark_id": b["id"],
        }

    if rel in ("leases-to", "hosts"):
        racks = edge.get("capacity_racks")
        if racks is None:
            return "vacant", {"reason": "租约边缺少机柜数（capacity_racks），无法估算"}
        if str(edge.get("region") or "").strip().lower() != "cn":
            return "vacant", {"reason": "缺少美国机柜租金基准，暂不估算（仅 CN 有基准）"}
        b = bench_by_id.get("rack-rent-cn-tower")
        vmin = float(b["value_min"]) * float(racks)
        vmax = float(b["value_max"]) * float(racks)
        method = "单柜年租金 × 机柜数"
        basis = b["name"]
        conf = b["confidence"]
        return "estimated", {
            "range": fmt_range(vmin, vmax, "CNY/年"),
            "method": method,
            "basis": basis,
            "confidence": conf,
            "benchmark_id": b["id"],
        }

    return "vacant", {"reason": "供货/其他边缺少产品细分（segment）与量化口径，无匹配基准"}


def load_benchmarks(path):
    with open(path, encoding="utf-8") as f:
        doc = json.load(f)
    return {b["id"]: b for b in doc.get("benchmarks", [])}


def load_edges(path):
    with open(path, encoding="utf-8") as f:
        doc = json.load(f)
    if isinstance(doc, dict) and "edges" in doc:
        return doc, doc["edges"]
    if isinstance(doc, list):
        return {"edges": doc}, doc
    raise ValueError("input must be an edge list or a store dict with 'edges'")


def run(path, benchmarks_path):
    bench_by_id = load_benchmarks(benchmarks_path)
    store, edges = load_edges(path)
    rules = {
        "power": {
            "benchmarks": [bench_by_id[i] for i in RULE_POWER["benchmarks"]],
            "capacity_factor": RULE_POWER["capacity_factor"],
        },
        "cool": {"benchmarks": [bench_by_id[i] for i in RULE_COOL["benchmarks"]]},
    }
    tiers = {"disclosed": 0, "estimated": 0, "vacant": 0}
    for e in edges:
        tier, est = estimate_edge(e, bench_by_id, rules)
        tiers[tier] += 1
        e["estimate_tier"] = tier
        e["est"] = est
    store["estimate_stats"] = {
        "disclosed": tiers["disclosed"],
        "estimated": tiers["estimated"],
        "vacant": tiers["vacant"],
        "total": len(edges),
        "coverage": "{}/{}".format(tiers["disclosed"] + tiers["estimated"], len(edges)),
    }
    return store


def check():
    store = run(FIXTURE, BENCHMARKS_DEFAULT)
    stats = store["estimate_stats"]
    expected = {"disclosed": 1, "estimated": 3, "vacant": 1, "total": 5}
    problems = []
    for k, v in expected.items():
        if stats.get(k) != v:
            problems.append("{}: expected {} got {}".format(k, v, stats.get(k)))
    for e in store["edges"]:
        if e["estimate_tier"] == "estimated" and not e.get("est", {}).get("range"):
            problems.append("edge {} missing est range".format(e["from"] + ">" + e["to"]))
    if problems:
        print("CHECK FAILED")
        for p in problems:
            print(" -", p)
        return 1
    print("CHECK OK:", json.dumps(stats, ensure_ascii=False))
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("input", nargs="?", help="relationship-edge store JSON")
    ap.add_argument("--benchmarks", default=BENCHMARKS_DEFAULT, help="benchmark catalog JSON")
    ap.add_argument("--output", help="output JSON path (default: stdout)")
    ap.add_argument("--check", action="store_true", help="run fixture self-check and exit")
    args = ap.parse_args()
    if args.check:
        sys.exit(check())
    if not args.input:
        ap.error("input file required (or use --check)")
    store = run(args.input, args.benchmarks)
    out = json.dumps(store, ensure_ascii=False, indent=2)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(out + "\n")
        print("estimate_stats:", json.dumps(store["estimate_stats"], ensure_ascii=False))
    else:
        print(out)


if __name__ == "__main__":
    main()
