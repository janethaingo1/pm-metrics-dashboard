---
name: pm-dashboard-plugin-sync
description: Use when Jane asks Codex to reuse, inspect, implement, deploy, or sync the PM Dashboard project-management plugin, including master-ai-data.json, pm-dashboard.js, pm-dashboard.css, PMMetricsAI, Master AI sync, GitHub jane-portfolio/plugins/project-management, Vercel UAT, or cross-agent dashboard handoff work.
metadata:
  short-description: Reuse PM Dashboard plugin and Master AI sync
---

# PM Dashboard Plugin Sync

Use this skill for Jane's PMMetricsAI / PM Dashboard plugin workflow, especially when the source is the GitHub-style folder:

```text
jane-portfolio/plugins/project-management/
  master-ai-data.json
  pm-dashboard.js
  pm-dashboard.css
```

## Fast Path

1. Locate project roots before editing:
   - PMMetricsAI app: `/Users/thaingo/Documents/Prudential/PM metrics dashboard`
   - Plugin source when present: `/Users/thaingo/Documents/Claude/Projects/jane-portfolio/plugins/project-management`
   - Current sync master: `/Users/thaingo/Documents/Prudential/PM metrics dashboard/AGENTS.md`
2. Read `AGENTS.md` first and treat it as the current local source of truth.
3. If the plugin files exist, run:
   ```bash
   python3 ~/.codex/skills/pm-dashboard-plugin-sync/scripts/check_pm_dashboard_plugin.py /path/to/plugins/project-management
   ```
4. Keep all work mock-data-only. Do not request, create, or accept real PII, real claim IDs, real policy IDs, or real customer data.
5. Preserve the PMMetricsAI pilot rules unless Jane explicitly changes them.

## Required File Contract

The plugin folder should contain:

- `master-ai-data.json` — shared data contract and Master AI sync payload.
- `pm-dashboard.js` — dashboard behavior, render logic, toggles, filters, and UAT interactions.
- `pm-dashboard.css` — visible dashboard styling.

If one is missing, report the gap first. Do not invent a replacement without saying it is a scaffold.

## PMMetricsAI Rules To Preserve

- `AGENTS.md` is the sync-AI master for Codex, Claude, Gemini, Antigravity, and OpenClaw.
- Mock data only. No real PII.
- `reserve_vnd`, `cross_sell_eligible`, and `clv_update_pct` use special schemas and must not be forced into the standard metric schema.
- Claim complexity must be explicit as `claim_type: simple | complex`.
- S3 fraud is the primary RED alert; manual intervention is supporting context explaining why manual review is required.
- S4 final alerts are RED `tat_days`, RED `sla_compliance`, RED `csat`, RED `ces`, and AMBER `pct_manual_intervention`.
- AI outputs are advisory-only, include `confidence_pct`, cite `source_claims`, and keep human-in-the-loop review visible.

## Reuse Workflow

When Jane asks to reuse or deploy this dashboard/plugin:

1. **Inspect**
   - Check for the three plugin files.
   - Read `master-ai-data.json` shape before touching JS/CSS.
   - Compare current PMMetricsAI rules in `AGENTS.md` against the plugin payload.
2. **Implement**
   - Keep edits narrow.
   - Prefer existing local UI/style patterns.
   - For UAT toggles, make controls keyboard/click friendly, visible, and resilient to generated UI overlays.
3. **Sync**
   - Update the project-local sync docs in the same PM dashboard folder when behavior or contract changes.
   - State what was updated locally versus what still requires GitHub/cloud sync.
4. **Verify**
   - Run the checker script for the plugin folder when available.
   - Run project build/tests when a frontend/backend repo is touched.
   - For Vercel deployments, verify deployment `READY`, production alias HTTP `200`, and live HTML/API markers.

## Security And Quality Gate

Block delivery if:

- Any real PII or real claim/customer data appears.
- AI recommendations can auto-execute claims decisions.
- `master-ai-data.json` cannot be parsed.
- The UI hides the AI advisory-only, source claims, confidence, or human-review guardrails.
- Vercel or external write actions are needed but Jane has not approved them.

## Reference

Read `references/plugin_contract.md` when you need the file-by-file validation checklist.
