"""
PMMetricsAI - FastAPI Backend Server
AI Anomaly Dashboard for Life Claims — 3-day pilot (Jun 17-19, 2026)

Endpoints:
  GET  /api/health
  GET  /api/claims              — list all claims
  GET  /api/claims/{claim_id}   — single claim detail
  GET  /api/anomalies           — all anomalies
  GET  /api/anomalies/{claim_id}— anomalies for one claim
  GET  /api/period              — period + platform metrics
  POST /api/nlp                 — NLP query → DeepSeek
  POST /api/killswitch          — toggle AI layer
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.data import load_mock_data
from backend.anomalies import evaluate_claim, correlate_anomalies
from backend.nlp import ask, get_prompt_hash
from collections import defaultdict
import time

# ── App ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="PMMetricsAI — Life Claims Anomaly Dashboard",
    version="1.0.0",
    description="AI-governed KPI dashboard for Prudential Life Claims pilot",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get(
        "CORS_ALLOW_ORIGINS",
        "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173",
    ).split(","),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── State ──────────────────────────────────────────────────────────────
# Load .env manually to ensure environment variables are read
try:
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip())
except Exception:
    pass

store = load_mock_data()
ai_layer_enabled = os.environ.get("AI_LAYER_ENABLED", "true").lower() != "false"
AI_LOG_PATH = Path(__file__).resolve().parent.parent / "logs" / "ai_decisions.log"
start_time = time.time()

_last_anomaly_time = 0.0
ANOMALY_COOLDOWN_SECS = 60
_nlp_counts = defaultdict(int)
MAX_NLP_PER_SESSION = 5


# ── Models ─────────────────────────────────────────────────────────────
class NLPQuery(BaseModel):
    query: str


class KillSwitchPayload(BaseModel):
    enabled: Optional[bool] = None



# ── Source ref lookup (assumptions_appendix.md) ──────────────────────
SOURCE_REFS: dict[str, dict] = {
    "BAIN-NPS-CLAIM": {"row": "A1", "title": "Adoption NPS", "source": "Bain NPS Prism 2025",
                       "value": "VN life insurance avg NPS +38", "ref": "Bain & Company, NPS Prism Insurance Report 2025"},
    "VN-MOF-2023": {"row": "C1", "title": "Cost per Claim", "source": "VN MoF + LIMRA 2024",
                    "value": "Avg 1.1M VND per claim", "ref": "Ministry of Finance Vietnam Circular 50/2024"},
    "FINTECH-BA-§4.4": {"row": "C2", "title": "Cross-sell Rate", "source": "Fintech-BA §4.4",
                        "value": "~35% eligibility rate", "ref": "fintech-ba-toolkit §4.4 Retention"},
    "TOWERS-WATSON-CLV": {"row": "C3", "title": "CLV", "source": "Towers Watson + Bain 2025",
                          "value": "Avg 15M VND per premium customer", "ref": "Towers Watson Life Insurance Asia Study 2025"},
    "BAIN-RENEWAL-CLAIM": {"row": "C4", "title": "CLV Erosion", "source": "Bain Renewal Study 2025",
                           "value": "-15% ~ 10.5M VND at risk", "ref": "Bain Claim-Satisfaction Renewal Correlation Study"},
    "BAIN-LOYALTY": {"row": "C5", "title": "CLV Opportunity", "source": "Bain Renewal + Loyalty",
                     "value": "+8% ~ 4.8M VND lift", "ref": "Bain Renewal + Bain Loyalty Economics"},
    "MUNICH-RE-FRAUD": {"row": "F1", "title": "Fraud Score", "source": "Munich Re + EY Insurance",
                        "value": "Score >0.65 triggers SIU", "ref": "Munich Re Fraud Risk Framework"},
    "EY-INSURANCE-FRAUD": {"row": "F2", "title": "Fraud Flags", "source": "EY Insurance Fraud",
                           "value": "5 signals: policy age, beneficiary, scene, sum, timing",
                           "ref": "EY Global Insurance Fraud Survey 2025"},
    "IFRS17-CSM": {"row": "I1", "title": "IFRS17 Reserve", "source": "IFRS 17 CSM",
                   "value": "target_band = expected loss component", "ref": "IFRS 17 Standard"},
    "LIMRA-CLAIMS-OPS": {"row": "O1", "title": "TAT (simple)", "source": "LIMRA Claims Ops 2024",
                         "value": "<3d green, 3-5d amber, >5d red", "ref": "LIMRA Claims Benchmark 2024"},
    "LIMRA-OPS": {"row": "O4", "title": "Exception Rate", "source": "LIMRA Ops",
                  "value": "<20% green, >30% red", "ref": "LIMRA Claims Operations Benchmark"},
    "LIMRA-SLA": {"row": "P1", "title": "SLA Compliance", "source": "Prudential Internal",
                  "value": ">95% green, <90% red", "ref": "Prudential Vietnam SLA 2025"},
    "GOOGLE-SRE": {"row": "S1", "title": "API Success", "source": "Google SRE",
                   "value": ">99.5% target", "ref": "Google Site Reliability Engineering"},
    "HANSA-CUES-2026": {"row": "X1", "title": "CSAT", "source": "Hansa Cues 2026",
                        "value": ">4.2 green, <4.0 red", "ref": "Hansa Cues Customer Satisfaction Insurance 2026"},
    "FORRESTER-CX": {"row": "X2", "title": "CES", "source": "Forrester CX 2025",
                     "value": ">4.0 green, <3.6 red", "ref": "Forrester Customer Effort Score 2025"},
    "BAIN-DIGITAL-CLAIMS": {"row": "X3", "title": "Dropoff", "source": "Bain Digital Claims",
                            "value": "<10% green, >25% red", "ref": "Bain Digital Insurance Claims Benchmark"},
    "LIMRA-STP-OPS": {"row": "O3", "title": "% Manual Intervention", "source": "LIMRA STP Ops",
                      "value": "<25% green, >30% red", "ref": "LIMRA STP Benchmark"},
    "CAIF-FRAUD": {"row": "F1", "title": "Fraud Score", "source": "CAIF Fraud",
                   "value": "Low risk score", "ref": "Coalition Against Insurance Fraud"},
    "MCKINSEY-INSURETECH": {"row": "O1", "title": "Insurtech Ops", "source": "McKinsey Insurtech 2025",
                            "value": "AI-routing benchmark", "ref": "McKinsey Global Insurtech Report 2025"},
    "LIMRA-CX": {"row": "X1", "title": "CSAT", "source": "LIMRA CX", "value": ">4.2 green target",
                 "ref": "LIMRA Customer Experience Benchmark"},
    "UX-INDUSTRY": {"row": "X3", "title": "Dropoff", "source": "UX Industry Standard",
                    "value": "<10% normal abandonment", "ref": "Nielsen Norman Group"},
    "PRUDENTIAL-SLA": {"row": "P1", "title": "SLA", "source": "Prudential Internal",
                       "value": "95% target", "ref": "Prudential Vietnam Service Level Agreement 2025"},
}

# ── AI Audit Log ──────────────────────────────────────────────────────
def _log_ai_decision(entry_type: str, data: dict) -> None:
    """Append to ai_decisions.log as JSONL."""
    log_entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "type": entry_type,
        **data,
    }
    try:
        with open(AI_LOG_PATH, "a") as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
    except OSError:
        pass  # non-fatal


# ── Routes ─────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "pilot": store.get("pilot"),
        "ai_layer_enabled": ai_layer_enabled,
        "claims_count": len(store["claims_by_id"]),
        "uptime_seconds": int(time.time() - start_time),
    }


@app.get("/health")
def root_health():
    """Alias for /api/health to support external health checks."""
    return health()


@app.get("/api/claims")
def list_claims():
    """Return all claims (summary list)."""
    result = []
    for cid, c in store["claims_by_id"].items():
        # Find scenario
        matching = [s for s in store["scenarios"] if s["claim_id"] == cid]
        scenario = matching[0] if matching else {}

        result.append({
            "claim_id": cid,
            "policy_id": c["policy_id"],
            "fnol_date": c["fnol_date"],
            "cause": c["cause"],
            "status": c["status"],
            "day_of_claim": c["day_of_claim"],
            "sum_at_risk": c["sum_at_risk"],
            "policyholder": c["policyholder"],
            "claim_type": c["claim_type"],
            "expected_anomalies_count": len(scenario.get("expected_anomalies", [])),
        })
    return {"claims": result, "count": len(result)}


@app.get("/api/claims/{claim_id}")
def get_claim(claim_id: str):
    """Return full claim detail with metrics."""
    c = store["claims_by_id"].get(claim_id)
    if not c:
        raise HTTPException(404, f"Claim {claim_id} not found")
    return c


@app.get("/api/anomalies")
def get_all_anomalies():
    """Return anomalies for all claims (AI layer gated, rate limited)."""
    global _last_anomaly_time
    now = time.time()
    if now - _last_anomaly_time < ANOMALY_COOLDOWN_SECS:
        remaining = int(ANOMALY_COOLDOWN_SECS - (now - _last_anomaly_time))
        return {"anomalies": [], "count": 0, "ai_layer_enabled": ai_layer_enabled,
                "rate_limited": True, "cooldown_remaining_s": remaining}
    _last_anomaly_time = now
    if not ai_layer_enabled:
        return {"anomalies": [], "count": 0, "ai_layer_enabled": False}

    all_anomalies: list[dict] = []
    for cid, c in store["claims_by_id"].items():
        cards = evaluate_claim(cid, c)
        all_anomalies.extend(cards)

    # Correlate anomalies (merge manual + SLA for S2)
    all_anomalies = correlate_anomalies(all_anomalies)

    # Suppress low confidence
    filtered = [a for a in all_anomalies if a.get("confidence_pct", 100) >= 70]

    _log_ai_decision("anomaly_scan", {
        "total_cards": len(filtered),
        "claims_scanned": len(store["claims_by_id"]),
        "response": filtered,
    })

    return {
        "anomalies": filtered,
        "count": len(filtered),
        "ai_layer_enabled": True,
    }


@app.get("/api/anomalies/{claim_id}")
def get_claim_anomalies(claim_id: str):
    """Return anomalies for a single claim."""
    if not ai_layer_enabled:
        return {"anomalies": [], "claim_id": claim_id, "ai_layer_enabled": False}

    c = store["claims_by_id"].get(claim_id)
    if not c:
        raise HTTPException(404, f"Claim {claim_id} not found")

    cards = evaluate_claim(claim_id, c)
    cards = correlate_anomalies(cards)
    filtered = [a for a in cards if a.get("confidence_pct", 100) >= 70]

    _log_ai_decision("anomaly_single", {
        "claim_id": claim_id,
        "cards": len(filtered),
        "response": filtered,
    })

    return {
        "claim_id": claim_id,
        "anomalies": filtered,
        "count": len(filtered),
        "ai_layer_enabled": True,
    }


@app.get("/api/source/{ref:path}")
def get_source(ref: str):
    """Return assumptions_appendix.md row for a source ref (B8 tooltip support)."""
    ref_upper = ref.upper().strip("/")
    info = SOURCE_REFS.get(ref_upper)
    if not info:
        raise HTTPException(404, f"Source ref {ref} not found")
    return info


@app.get("/api/methodology")
def get_methodology():
    """Return methodology anchor data."""
    return {
        "methodology": store.get("raw_data", {}).get("methodology", ""),
        "platform_source_refs": store.get("platform_metrics", {}).get("source_refs_strip", []),
    }


@app.get("/api/period")
def get_period():
    """Return period context + platform metrics."""
    return {
        "period_context": store.get("period_context", {}),
        "platform_metrics": store.get("platform_metrics", {}),
    }


@app.post("/api/nlp")
def nlp_query(payload: NLPQuery):
    """NLP Q&A via DeepSeek with rate limiting (LLM10)."""
    session_key = f"session_{int(time.time() // 3600)}"
    _nlp_counts[session_key] += 1
    if _nlp_counts[session_key] > MAX_NLP_PER_SESSION:
        _log_ai_decision("nlp_rate_limited", {"query": payload.query})
        return {
            "answer": f"Rate limit reached ({MAX_NLP_PER_SESSION} queries per session). Please wait or ask a combined question.",
            "confidence_pct": 0,
            "source_claims": [],
            "advisory_only": True,
            "rate_limited": True,
        }
    if not ai_layer_enabled:
        return {
            "answer": "AI layer is disabled. Enable via /api/killswitch.",
            "advisory_only": True,
            "ai_layer_enabled": False,
        }

    result = ask(payload.query, store)

    _log_ai_decision("nlp_query", {
        "query": payload.query,
        "prompt_hash": get_prompt_hash(payload.query),
        "response": result.get("answer"),
        "confidence_pct": result.get("confidence_pct"),
        "source_claims": result.get("source_claims"),
        "advisory_only": result.get("advisory_only"),
    })

    return result


@app.get("/api/scenario/{claim_id}/actions")
def get_scenario_actions(claim_id: str):
    """Return highlights_and_actions for a scenario."""
    c = store["claims_by_id"].get(claim_id)
    if not c:
        raise HTTPException(404, f"Claim {claim_id} not found")
    return {
        "claim_id": claim_id,
        "highlights_and_actions": c.get("highlights_and_actions", {}),
    }


@app.post("/api/killswitch")
def toggle_ai(payload: KillSwitchPayload):
    """Toggle AI anomaly + NLP layer on/off."""
    global ai_layer_enabled
    if payload.enabled is not None:
        ai_layer_enabled = payload.enabled
    else:
        ai_layer_enabled = not ai_layer_enabled

    _log_ai_decision("killswitch", {
        "new_state": ai_layer_enabled,
    })

    return {
        "ai_layer_enabled": ai_layer_enabled,
        "message": f"AI layer {'enabled' if ai_layer_enabled else 'disabled'}",
    }


# ── Entry ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    print(f"🚀 PMMetricsAI backend starting on port {port}")
    print(f"📋 Loaded {len(store['claims_by_id'])} claims")
    print(f"🔘 AI layer: {'ON' if ai_layer_enabled else 'OFF'}")
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
