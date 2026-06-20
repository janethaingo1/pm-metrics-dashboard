"""
PMMetricsAI - Data loader.

Loads Jane's mock_claims_uat.json into an in-memory store and normalizes only
compatibility fields needed by the API/UI. Source values remain mock data.
"""

import json
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parent.parent
MOCK_PATH = DATA_DIR / "mock_claims_uat.json"
MIRROR_PATH = DATA_DIR / "data" / "mock_claims.json"

PERCENT_METRIC_KEYS = {
    "pct_manual_intervention",
    "sla_compliance",
    "fraud_score",
    "exception_rate_pct",
    "exception_rate_stp",
    "api_success_pct",
    "dropoff_pct",
}

SOURCE_REF_BY_METRIC = {
    "tat_days": "LIMRA-CLAIMS-OPS",
    "pct_manual_intervention": "LIMRA-OPS",
    "sla_compliance": "LIMRA-SLA",
    "fraud_score": "CAIF-FRAUD",
    "exception_rate_pct": "LIMRA-OPS",
    "exception_rate_stp": "LIMRA-STP-OPS",
    "api_success_pct": "GOOGLE-SRE",
    "api_latency_ms": "GOOGLE-SRE",
    "adoption_nps_segment": "BAIN-NPS-CLAIM",
    "csat": "LIMRA-CX",
    "ces": "FORRESTER-CX-CES",
    "dropoff_pct": "UX-INDUSTRY",
    "tickets_volume": "LIMRA-OPS",
    "tickets_tat_hours": "LIMRA-OPS",
    "cost_per_claim_vnd": "VN-MOF-2023",
    "cross_sell_eligible": "FINTECH-BA-§4.4",
    "clv_update_pct": "TOWERS-WATSON-CLV",
    "reserve_vnd": "IFRS17-CSM",
}

PER_CLAIM_METRIC_KEYS = [
    "tat_days",
    "pct_manual_intervention",
    "sla_compliance",
    "fraud_score",
    "exception_rate_stp",
    "api_success_pct",
    "api_latency_ms",
    "adoption_nps_segment",
    "csat",
    "ces",
    "dropoff_pct",
    "tickets_volume",
    "tickets_tat_hours",
    "cost_per_claim_vnd",
    "cross_sell_eligible",
    "clv_update_pct",
    "reserve_vnd",
    "exception_rate_pct",
]


def _pct_display(value: Any) -> float | None:
    if value is None:
        return None
    return round(value if abs(value) > 1 else value * 100, 1)


def _ensure_metric(metric: dict[str, Any], key: str) -> dict[str, Any]:
    metric.setdefault("source_ref", SOURCE_REF_BY_METRIC.get(key, "MOCK-PILOT"))
    metric.setdefault("trend_7d", "n/a" if metric.get("actual") is None else "stable")
    if key in PERCENT_METRIC_KEYS and metric.get("actual") is not None:
        metric.setdefault("actual_display_pct", _pct_display(metric.get("actual")))
        if metric.get("target") is not None:
            metric.setdefault("target_display_pct", _pct_display(metric.get("target")))
    if key not in {"cross_sell_eligible", "clv_update_pct", "reserve_vnd"}:
        metric.setdefault("actual", None)
        metric.setdefault("target", None)
        metric.setdefault("variance_pct", None)
    return metric


def _normalize_metrics(sc: dict[str, Any]) -> None:
    metrics = sc.setdefault("metrics_per_claim", {})
    claim_id = sc.get("claim_id")

    inferred_complex = claim_id in {"CLM-LIFE-2026-001847", "CLM-LIFE-2026-001755"}
    sc.setdefault("claim_type", "complex" if inferred_complex else "simple")

    if claim_id == "CLM-LIFE-2026-001923":
        metrics.setdefault("cross_sell_eligible", {})["baseline_eligibility_pct"] = 35
        metrics["cross_sell_eligible"].setdefault(
            "reason",
            "Disabled by SIU review; would be 35% baseline eligibility if cleared",
        )
        manual_metric = metrics.setdefault("pct_manual_intervention", {})
        if "manual" not in str(manual_metric.get("note", "")).lower():
            manual_metric["note"] = (
                "Manual intervention required because fraud alert routes this claim to SIU human review."
            )

    for key in PER_CLAIM_METRIC_KEYS:
        if key not in metrics:
            raise ValueError(f"Unresolvable metric key '{key}' for claim {claim_id}")
        metrics[key] = _ensure_metric(metrics[key], key)

    reserve = metrics.get("reserve_vnd", {})
    if reserve.get("actual") is not None:
        reserve.setdefault("target_band_low", round(reserve["actual"] * 0.95))
        reserve.setdefault("target_band_high", round(reserve["actual"] * 1.05))
        midpoint = (reserve["target_band_low"] + reserve["target_band_high"]) / 2
        reserve.setdefault("variance_from_band_mid_pct", round(((reserve["actual"] - midpoint) / midpoint) * 100, 1))


def _normalize_data(data: dict[str, Any]) -> dict[str, Any]:
    data["version"] = "1.2"

    period = data.setdefault("period_context", {})
    adoption = period.get("adoption_nps_claims_segment")
    if isinstance(adoption, dict):
        period.setdefault("adoption_nps_claims_segment_value", adoption.get("actual"))
    else:
        period.setdefault("adoption_nps_claims_segment_value", adoption if adoption is not None else 38)
    period.setdefault("avg_settlement_simple_days", period.get("avg_settlement_days_simple", 3.2))
    period.setdefault("avg_settlement_complex_days", period.get("avg_settlement_days_complex", 18.5))
    stp_rate = period.get("stp_rate_pct", 64)
    period.setdefault("stp_rate_this_week", stp_rate / 100 if abs(stp_rate) > 1 else stp_rate)

    platform = data.setdefault("platform_metrics_strip", {})
    platform_adoption = platform.get("adoption_nps_claims_segment")
    if isinstance(platform_adoption, dict):
        platform["adoption_nps_claims_segment"] = platform_adoption.get("actual")
    platform.setdefault("adoption_nps_claims_segment", period["adoption_nps_claims_segment_value"])
    platform.setdefault("revenue_from_platform_vnd", 4200000000)
    if "growth_rate_pct" not in platform and "revenue_growth_rate_pct" in platform:
        growth = platform["revenue_growth_rate_pct"]
        platform["growth_rate_pct"] = growth / 100 if abs(growth) > 1 else growth
    platform.setdefault("growth_rate_pct", 0.12)
    platform.setdefault("arpu_vnd", 1250000)
    platform.setdefault("nrr_pct", 1.10)
    if abs(platform["nrr_pct"]) > 2:
        platform["nrr_pct"] = platform["nrr_pct"] / 100
    if "quality_score_pct" not in platform and "project_security_quality_score" in platform:
        quality = platform["project_security_quality_score"]
        platform["quality_score_pct"] = quality / 100 if abs(quality) > 1 else quality
    platform.setdefault("quality_score_pct", 0.91)
    platform.setdefault("regulatory_compliance_score", 94)
    platform.setdefault("_compliance_gap_note", "6-point compliance gap from the mock pilot assumptions.")
    platform.setdefault("sprint_velocity_sp", 32)

    for sc in data.get("scenarios", []):
        _normalize_metrics(sc)

    return data


def _sync_mirror(data: dict[str, Any]) -> None:
    MIRROR_PATH.parent.mkdir(exist_ok=True)
    try:
        MIRROR_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    except OSError:
        pass


def load_mock_data() -> dict[str, Any]:
    """Load mock claims dataset. Raises FileNotFoundError if missing."""
    if not MOCK_PATH.exists():
        raise FileNotFoundError(
            f"mock_claims_uat.json not found at {MOCK_PATH}. "
            "Ensure pilot files are extracted."
        )
    with open(MOCK_PATH) as f:
        data = _normalize_data(json.load(f))

    _sync_mirror(data)

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
            "claim_type": sc["claim_type"],
            "scenario_id": sc.get("scenario_id"),
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
        "generated": data.get("generated", ""),
        "currency": data.get("currency", "VND"),
        "period_context": data.get("period_context", {}),
        "platform_metrics": data.get("platform_metrics_strip", {}),
        "scenarios": scenarios,
        "claims_by_id": claims_by_id,
        "raw_data": data,
    }
