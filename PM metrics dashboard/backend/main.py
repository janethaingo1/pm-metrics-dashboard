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
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.data import load_mock_data
from backend.anomalies import evaluate_claim, correlate_anomalies
from backend.nlp import ask, get_prompt_hash

# ── App ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="PMMetricsAI — Life Claims Anomaly Dashboard",
    version="1.0.0",
    description="AI-governed KPI dashboard for Prudential Life Claims pilot",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── State ──────────────────────────────────────────────────────────────
store = load_mock_data()
ai_layer_enabled = True
AI_LOG_PATH = Path(__file__).resolve().parent.parent / "ai_decisions.log"


# ── Models ─────────────────────────────────────────────────────────────
class NLPQuery(BaseModel):
    query: str


class KillSwitchPayload(BaseModel):
    enabled: Optional[bool] = None


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
    }


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
    """Return anomalies for all claims (AI layer gated)."""
    if not ai_layer_enabled:
        return {"anomalies": [], "count": 0, "ai_layer_enabled": False}

    all_anomalies: list[dict] = []
    for cid, c in store["claims_by_id"].items():
        cards = evaluate_claim(cid, c)
        all_anomalies.extend(cards)

    # Suppress low confidence
    filtered = [a for a in all_anomalies if a.get("confidence_pct", 100) >= 70]

    _log_ai_decision("anomaly_scan", {
        "total_cards": len(filtered),
        "claims_scanned": len(store["claims_by_id"]),
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
    filtered = [a for a in cards if a.get("confidence_pct", 100) >= 70]

    _log_ai_decision("anomaly_single", {
        "claim_id": claim_id,
        "cards": len(filtered),
    })

    return {
        "claim_id": claim_id,
        "anomalies": filtered,
        "count": len(filtered),
        "ai_layer_enabled": True,
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
    """NLP Q&A via DeepSeek."""
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
        "confidence_pct": result.get("confidence_pct"),
        "source_claims": result.get("source_claims"),
        "advisory_only": result.get("advisory_only"),
    })

    return result


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
