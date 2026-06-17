"""Regression checks for Jane's 2026-06-17 PMMetricsAI logic updates."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.anomalies import evaluate_claim
from backend.data import load_mock_data


MAIN_TILE_KEYS = {
    "tat_days",
    "pct_manual_intervention",
    "sla_compliance",
    "fraud_score",
    "csat",
    "ces",
    "dropoff_pct",
    "tickets_volume",
    "tickets_tat_hours",
    "cost_per_claim_vnd",
    "cross_sell_eligible",
    "clv_update_pct",
}

SPECIAL_SCHEMA_KEYS = {"cross_sell_eligible", "clv_update_pct", "reserve_vnd"}


def _levels(cards):
    return [(card["metric"], card["level"]) for card in cards]


def test_updated_uat_logic():
    store = load_mock_data()
    claims = store["claims_by_id"]
    scenarios = {scenario["claim_id"]: scenario for scenario in store["scenarios"]}

    for claim_id, claim in claims.items():
        assert claim["claim_type"] in {"simple", "complex"}, claim_id
        metric_keys = set(claim["metrics"])
        assert MAIN_TILE_KEYS.issubset(metric_keys), claim_id
        assert "reserve_vnd" in metric_keys, claim_id
        assert "reserve_vnd" not in MAIN_TILE_KEYS
        for special_key in SPECIAL_SCHEMA_KEYS:
            assert isinstance(claim["metrics"][special_key], dict), (claim_id, special_key)

    s3_cards = evaluate_claim("CLM-LIFE-2026-001923", claims["CLM-LIFE-2026-001923"])
    assert _levels(s3_cards) == [("fraud_score", "RED")]
    assert "manual" in claims["CLM-LIFE-2026-001923"]["metrics"]["pct_manual_intervention"]["note"].lower()

    s4_expected = [
        ("tat_days", "RED"),
        ("sla_compliance", "RED"),
        ("csat", "RED"),
        ("ces", "RED"),
        ("pct_manual_intervention", "AMBER"),
    ]
    s4_cards = evaluate_claim("CLM-LIFE-2026-001755", claims["CLM-LIFE-2026-001755"])
    assert _levels(s4_cards) == s4_expected
    assert _levels(scenarios["CLM-LIFE-2026-001755"]["expected_anomalies"]) == s4_expected


if __name__ == "__main__":
    test_updated_uat_logic()
    print("updated UAT regression checks passed")
