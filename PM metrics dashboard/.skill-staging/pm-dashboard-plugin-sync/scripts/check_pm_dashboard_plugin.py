#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path


REQUIRED = ("master-ai-data.json", "pm-dashboard.js", "pm-dashboard.css")
PII_PATTERNS = {
    "email": re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I),
    "phone_like": re.compile(r"(?:\+?84|0)(?:[\s.-]?\d){8,10}\b"),
    "possible_vn_id": re.compile(r"\b\d{9}|\d{12}\b"),
}


def scan_pii(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    hits = []
    for label, pattern in PII_PATTERNS.items():
        if pattern.search(text):
            hits.append(label)
    return hits


def main() -> int:
    root = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else Path.cwd()
    root = root.resolve()
    if not root.exists():
        print(f"FAIL root does not exist: {root}")
        return 2

    failures = []
    warnings = []

    for name in REQUIRED:
        path = root / name
        if not path.exists():
            failures.append(f"missing required file: {name}")
            continue
        pii_hits = scan_pii(path)
        if pii_hits:
            warnings.append(f"{name}: possible PII patterns found: {', '.join(pii_hits)}")

    data_path = root / "master-ai-data.json"
    if data_path.exists():
        try:
            parsed = json.loads(data_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            failures.append(f"master-ai-data.json invalid JSON: line {exc.lineno} col {exc.colno}")
        else:
            text = json.dumps(parsed, ensure_ascii=False)
            for marker in ("advisory_only", "confidence_pct", "source_claims"):
                if marker not in text:
                    warnings.append(f"master-ai-data.json missing guardrail marker: {marker}")
            for marker in ("reserve_vnd", "cross_sell_eligible", "clv_update_pct", "claim_type"):
                if marker not in text:
                    warnings.append(f"master-ai-data.json missing PMMetricsAI schema marker: {marker}")

    if failures:
        print("FAIL")
        for item in failures:
            print(f"- {item}")
        for item in warnings:
            print(f"- WARN {item}")
        return 1

    print("PASS")
    print(f"root: {root}")
    for name in REQUIRED:
        if (root / name).exists():
            print(f"- found {name}")
    for item in warnings:
        print(f"- WARN {item}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
