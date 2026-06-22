# PMMetricsAI Pilot — Debug Log

> Every bug found in UAT gets logged here per AGENTS.md §debug-no-recur.

## BUG-001 · 2026-06-22 21:00
**Symptom**: S4 CLV lift card showed green (no highlight) while CLV impact card showed RED with an incorrect value of -1500%.
**Root cause**: The CLV Lift card wrapper did not invoke `getMetricClass` to draw its AI borders/background. The -1500% display was caused by double-multiplication in rendering helpers that treated the already-percentage `clv_update_pct` value as a fraction.
**Fix**: Wrapped the CLV Lift metric tile in `OperationsDashboard.tsx` with `getMetricClass` and updated formatting helpers to only multiply fractional metrics by 100.
**Regression check**: Added the RED expected `clv_update_pct` card to Scenario 4 in `mock_claims_uat.json` and `backend/anomalies.py`. Verified by running `backend/uat_regression_check.py`.

## BUG-002 · 2026-06-22 21:05
**Symptom**: Toggling the AI layer ON/OFF did not immediately/reliably update AI anomalies highlights, causing race conditions where the UI showed outdated state.
**Root cause**: `getMetricClass` did not clear highlights when the AI layer was disabled. `App.tsx` performed an optimistic toggle update, firing subsequent requests before the backend had successfully persisted the kill switch state.
**Fix**: Forced `getMetricClass` to immediately return standard border class `border-white/10` if `!aiLayerEnabled`. Removed the optimistic update from `handleToggleKillSwitch` so it waits for the API response.
**Regression check**: Verified live toggle functionality and ran backend health checks during simulated disabled state in `backend/uat_regression_check.py`.

## BUG-003 · 2026-06-22 21:10
**Symptom**: Operations & Risk metric labels and source info links overlapped/wrapped on standard desktop viewports.
**Root cause**: Grid layout used `xl:grid-cols-6` which did not provide enough width per card.
**Fix**: Refactored grid column definitions in `OperationsDashboard.tsx` to `xl:grid-cols-3 2xl:grid-cols-6` and `sm:grid-cols-2 lg:grid-cols-4`.
**Regression check**: Manually verified responsive scaling and layout width across standard screen sizes.

## BUG-004 · 2026-06-22 21:15
**Symptom**: Scenario 2 manual intervention (38%) displayed as AMBER instead of RED per threshold rules (>30% = RED).
**Root cause**: The expected anomaly mapping in `mock_claims_uat.json` and hardcoded backend expectations in `backend/anomalies.py` had the level set to `"AMBER"`.
**Fix**: Updated the anomaly level for S2 manual intervention to `"RED"` in both files.
**Regression check**: Ran `backend/uat_regression_check.py` to assert correct count and levels of expected anomalies.
