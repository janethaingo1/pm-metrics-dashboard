"""
PMMetricsAI - Data loader
Loads mock_claims_uat.json into in-memory store.
All data is mock. No real PII.
"""

import json
import os
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent.parent  # Prudential/
MOCK_PATH = DATA_DIR / "mock_claims_uat.json"


def load_mock_data() -> dict[str, Any]:
    """Load mock claims dataset. Raises FileNotFoundError if missing."""
    if not MOCK_PATH.exists():
        raise FileNotFoundError(
            f"mock_claims_uat.json not found at {MOCK_PATH}. "
            "Ensure pilot files are extracted."
        )
    with open(MOCK_PATH) as f:
        data = json.load(f)

    # Build lookup dicts
    claims_by_id: dict[str, dict] = {}
    scenarios: list[dict] = []

    for sc in data.get("scenarios", []):
        scenarios.append(sc)
        cid = sc["claim_id"]
        claims_by_id[cid] = {
            "claim_id": cid,
            "policy_id": sc["policy_id"],
            "fnol_date": sc["fnol_date"],
            "cause": sc["cause"],
            "sum_at_risk": sc["sum_at_risk"],
            "status": sc["status"],
            "claim_type": sc.get("claim_type", "simple" if "simple" in sc.get("cause","").lower() or "natural" in sc.get("cause","").lower() else "complex"),
            "day_of_claim": sc.get("day_of_claim", 0),
            "policyholder": sc.get("policyholder", {}),
            "metrics": sc.get("metrics_per_claim", {}),
            "fraud_flags": sc.get("fraud_flags", []),
            "expected_anomalies": sc.get("expected_anomalies", []),
            "expected_recommendation": sc.get("expected_recommendation"),
            "highlights_and_actions": sc.get("highlights_and_actions", {}),
        }

    return {
        "pilot": data.get("pilot", ""),
        "version": data.get("version", ""),
        "currency": data.get("currency", "VND"),
        "period_context": data.get("period_context", {}),
        "platform_metrics": data.get("platform_metrics_strip", {}),
        "scenarios": scenarios,
        "claims_by_id": claims_by_id,
        "raw_data": data,
    }
