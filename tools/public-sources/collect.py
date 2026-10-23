"""Public issuer metadata only. No credentials, article bodies, or editorial drafts."""
import argparse
import json
import os
import subprocess
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

from edgar import set_identity
from edgar.httprequests import download_json

ORACLE = "https://www.oracle.com/corporate/press/rss/rss-pr.xml"
COHERENT = "https://ir.coherent.com/rss/news-releases.xml"
FIELDS = ("accessionNumber", "filingDate", "reportDate", "acceptanceDateTime", "form", "items", "primaryDocument", "primaryDocDescription")
FORMS = {"8-K", "10-K", "10-Q", "20-F", "40-F", "6-K"}
TAGS = ("Revenues", "SalesRevenueNet", "RevenueFromContractWithCustomerExcludingAssessedTax", "OperatingIncomeLoss")


def stamp():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def compact_submissions(raw, issuer):
    if str(raw.get("cik")).zfill(10) != issuer["cik"] or issuer["symbol"] not in raw.get("tickers", []):
        raise ValueError("issuer-identity-mismatch")
    recent = raw["filings"]["recent"]
    cutoff = (datetime.now(timezone.utc) - timedelta(days=120)).date().isoformat()
    indices = [i for i, form in enumerate(recent["form"]) if form.removesuffix("/A") in FORMS and recent["filingDate"][i] >= cutoff]
    return {"cik": raw["cik"], "name": raw["name"], "tickers": raw["tickers"], "filings": {"recent": {
        key: [recent.get(key, [""] * len(recent["form"]))[i] for i in indices] for key in FIELDS}}}


def collect(issuers, previous):
    identity = os.environ["ATLAS_EDGAR_IDENTITY"]
    if "@" not in identity:
        raise ValueError("SEC contact is required")
    set_identity(identity)
    sources = {}
    sec_blocked = False
    for issuer in issuers:
        key = "sec:" + issuer["symbol"]
        url = "https://data.sec.gov/submissions/CIK" + issuer["cik"] + ".json"
        entry = {**previous.get("sources", {}).get(key, {}), "sourceUrl": url, "checkedAt": stamp(), "status": "failed"}
        try:
            if sec_blocked:
                raise RuntimeError("SEC circuit open")
            time.sleep(1.1)
            raw = compact_submissions(download_json(url), issuer)
            entry.update(status="ok", fetchedAt=stamp(), data=raw)
            entry.pop("error", None)
        except Exception as error:
            # Never expose request headers/contact identity through exception strings.
            status = getattr(getattr(error, "response", None), "status_code", None)
            sec_blocked = sec_blocked or status in (403, 429)
            entry["error"] = "HTTP " + str(status) if status else type(error).__name__
        sources[key] = entry
        print(key, entry["status"], flush=True)
        if entry["status"] == "ok":
            recent = entry["data"]["filings"]["recent"]
            quarterly = [i for i, form in enumerate(recent["form"]) if form.removesuffix("/A") in ("10-K", "10-Q")]
            if quarterly:
                index = max(quarterly, key=lambda i: recent["filingDate"][i])
                accession = recent["accessionNumber"][index]
                facts_key = "facts:" + issuer["symbol"]
                facts_url = "https://data.sec.gov/api/xbrl/companyfacts/CIK" + issuer["cik"] + ".json"
                facts = {**previous.get("sources", {}).get(facts_key, {}), "sourceUrl": facts_url, "checkedAt": stamp()}
                if facts.get("accession") != accession or facts.get("status") != "ok":
                    try:
                        if sec_blocked:
                            raise RuntimeError("SEC circuit open")
                        time.sleep(1.1)
                        raw_facts = download_json(facts_url)
                        if str(raw_facts.get("cik")).zfill(10) != issuer["cik"]:
                            raise ValueError("facts-identity-mismatch")
                        gaap = raw_facts.get("facts", {}).get("us-gaap", {})
                        facts.update(status="ok", fetchedAt=stamp(), accession=accession, data={"cik": raw_facts["cik"], "facts": {"us-gaap": {
                            tag: {"units": {"USD": [point for point in gaap.get(tag, {}).get("units", {}).get("USD", []) if point.get("filed", "") >= "2020-01-01"]}} for tag in TAGS}}})
                        facts.pop("error", None)
                    except Exception as error:
                        status = getattr(getattr(error, "response", None), "status_code", None)
                        sec_blocked = sec_blocked or status in (403, 429)
                        facts.update(status="failed", error="HTTP " + str(status) if status else type(error).__name__)
                sources[facts_key] = facts
    for key, url in (("rss:oracle", ORACLE), ("rss:coherent-ir", COHERENT)):
        sources[key] = collect_feed(url, previous.get("sources", {}).get(key, {}))
    return {"schemaVersion": 1, "generatedAt": stamp(), "provider": "EdgarTools 5.62.0 / issuer RSS", "sources": sources}


def collect_feed(url, previous):
    entry = {**previous, "sourceUrl": url, "checkedAt": stamp(), "status": "failed"}
    try:
        response = subprocess.run(["curl", "--fail", "--silent", "--show-error", "--max-time", "30", "--max-filesize", "2000000", url], capture_output=True, check=True, timeout=35)
        body = response.stdout
        if len(body) > 2_000_000 or b"<!DOCTYPE" in body.upper() or b"<!ENTITY" in body.upper():
            raise ValueError("unsafe-feed")
        root = ET.fromstring(body)
        channel = ET.Element("channel")
        items = root.findall("./channel/item")
        if not items:
            raise ValueError("invalid-feed")
        for item in items[:100]:
            output = ET.SubElement(channel, "item")
            for key in ("title", "link", "pubDate", "guid"):
                ET.SubElement(output, key).text = item.findtext(key, "")
        rss = ET.Element("rss", version="2.0")
        rss.append(channel)
        entry.update(status="ok", fetchedAt=stamp(), data=ET.tostring(rss, encoding="unicode"))
        entry.pop("error", None)
    except Exception as error:
        entry["error"] = type(error).__name__
    return entry


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--issuers", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    target = Path(args.output)
    previous = json.loads(target.read_text()) if target.exists() else {}
    snapshot = collect(json.loads(Path(args.issuers).read_text()), previous)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(snapshot, ensure_ascii=False, separators=(",", ":")))
    failed = [key for key, value in snapshot["sources"].items() if value["status"] != "ok"]
    print(json.dumps({"sources": len(snapshot["sources"]), "failed": failed}))
    # Publish failure receipts as well; workflow separately marks the run failed.
