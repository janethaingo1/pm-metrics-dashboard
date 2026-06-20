# PMMetricsAI Pilot — Debug Log

> Every bug found in UAT gets logged here per AGENTS.md debug-no-recur.

## BUG-009 · 2026-06-18 20:23
**Symptom**: Project `mock_claims_uat.json` had the authoritative v1.2 timestamp but still carried the older S4 anomaly mix: RED `csat`, RED `ces`, and no RED `clv_update_pct`. The current componentized UI also multiplied whole-number percent metrics, which could display API success `99.6` as `9960%`.
**Root cause**: Multiple agent sync passes left a stale v1.2 variant in the project file and simplified `backend/data.py`, losing normalization for metric key aliases, percent scales, explicit claim type, S3 manual context, and platform aliases.
**Fix**: Re-promoted Jane's attached `mock_claims_uat.json` generated `2026-06-17T10:00:00Z`; restored the v1.2 loader normalizer; updated frontend percent display helpers in the current componentized UI; updated sync docs to the new S4 contract.
**Regression check**: `python3 backend/uat_regression_check.py` and `npm run build` pass; direct smoke check confirms S4 = RED `tat_days`, RED `sla_compliance`, RED `clv_update_pct`, AMBER `csat`, AMBER `pct_manual_intervention`. → location: `backend/uat_regression_check.py`
