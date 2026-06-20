# PMMetricsAI Design System — "Luminous Clarity"

The design system for **PMMetricsAI**, Jane Ngo's AI-governed KPI dashboard pilot for
**Prudential Vietnam** life-claims operations. It captures the *Luminous Clarity*
visual direction — a clean, light, high-readability enterprise look chosen for C-suite
and claims-ops review — and packages it as reusable tokens, components, foundation
cards, and a product UI kit.

> **Domain:** Life Claims Operations (Term Life, Whole Life, Critical Illness).
> **Governance frame:** SBV Circular 09, IFRS 17, OWASP Agentic Top 10 — the product is
> *advisory-only*, human-in-the-loop, with a visible AI kill switch.

---

## Sources (for anyone with access)

- **Codebase:** `PM metrics dashboard/` (local mount). Live React/Vite implementation at
  `frontend/` — the source of truth for the Luminous Clarity UI. Backend (FastAPI) under
  `backend/`, mock data in `data/mock_claims.json` and `mock_claims_uat.json`.
- **Key docs:** `BRD_v1.0.md`, `PRD_v1.1.md`, `uat_test_plan.md`, `UI_LATEST_SYNC.md`,
  `NEXT_AGENT_HANDOFF.md`, `validation_rules.md`, `PMMetricsAI_Pilot_BRD_UAT.xlsx`.
- **Stitch project (design ref):** `https://stitch.withgoogle.com/projects/6325402822248126490`.
  Note: the `stitch_exports/` folder is the **archived dark "Neon Tokyo" direction** — it was
  *rejected* in favor of Luminous Clarity and should not be used as a visual reference.
- **Compiler namespace:** `window.DesignSystem_9c1142`.

---

## Content fundamentals (voice & copy)

The product speaks like a **calm, precise risk analyst** — never salesy, never alarmist.

- **Tone:** factual, governed, evidence-first. Every AI statement is framed as advice that a
  human must act on. Cards literally carry the line *"AI insight — review before action"* and an
  `advisory_only` badge.
- **Person:** mostly impersonal/system voice ("Claims risk is explainable, auditable, and
  human-controlled."). Direct address ("Ask a UAT question") only for the user's own actions.
- **Casing:** Title Case for screen titles and panel headings; **UPPERCASE eyebrows** with wide
  tracking for kickers ("AI-GOVERNED KPI DASHBOARD"); sentence case for body and recommendations.
- **Structure of an AI card:** *Why* (root cause) → *Action* (recommendation) → *Sources*
  (cited `claim_id`s) → confidence %. Always in that order.
- **Numbers:** precise and sourced. Currency is always integer **VND** with comma grouping
  (`800,000,000 VND`), never decimals. Percentages rounded to whole numbers. Variance shown with
  explicit sign (`−40%`, `+8%`). When a value is unknown, say **"Not yet measured"** or
  **"Pending"** — never fake precision or show an error.
- **Regulatory phrasing:** quote the rule ("SBV reporting required if fraud confirmed — Circular 09,
  Article 14"). Keep `source_ref` codes visible (e.g. `IFRS17-CSM-RESERVE`).
- **No emoji.** No exclamation marks. No hype words. Status is carried by the color system and the
  word set {On track · Watch · Escalate}, not adjectives.

---

## Visual foundations

**Vibe.** Quiet, dense, trustworthy. The data *is* the imagery — there is no decorative
photography or illustration. Whitespace, alignment, and one accent color per state do the work.

- **Color.** Neutral light canvas (`#F6F8FB`) with white surfaces. A single ownable brand
  indigo (`#3538CD`) for action/links/active nav. Status is a 3-stop system — green `#087F5B` (good),
  amber `#B75D00` (watch), red `#C5252D` (escalate) — plus purple `#6D42C7` reserved exclusively
  for the Reserve / IFRS 17 financial element. Each signal has a soft surface tint
  (`--good-bg`, `--watch-bg`, `--risk-bg`, `--info-bg`) for fills.
- **Type.** Inter throughout (400–900). Tabular lining figures everywhere numbers must align
  (KPI values, targets, variances). Big values at 28px; tile values 19px; body 13–14px; 11px
  uppercase eyebrows at 0.08em tracking.
- **Spacing.** 4px rhythm. Tile-to-tile gaps stay tight (12px); panels carry generous internal
  padding (18–22px). Fixed 280px sidebar, 390px ops side-column.
- **Backgrounds.** Mostly flat. The app shell carries two *very* faint corner gradients
  (blue ~8%, green ~8%) over the canvas — subtle, not a "gradient background". Topbar and sidebar
  use translucent white + 14px backdrop blur (glass) so content scrolls under them.
- **Corners & elevation.** Soft 8px radius on every card, tile, input, and button; pills fully
  round. Elevation is restrained: a single wide ambient shadow `0 16px 40px rgba(16,32,51,.06)` on
  raised panels — no stacked or harsh drop shadows.
- **Status accent.** Cards and tiles signal state with a **5px left accent bar** + matching tint,
  not a full color flood. (This bar is the system's signature; see the UAT improvement note below
  on using it sparingly.)
- **Borders.** 1px `#D7E0EC` hairlines everywhere; faint `#EDF1F6` row separators inside lists.
- **Motion.** Minimal and functional — `cubic-bezier(.4,0,.2,1)`, 120–200ms. Buttons depress 1px
  and brighten ~4% on hover. No bounces, no looping decorative animation. Kill-switch fallback must
  resolve in ≤2s.
- **Hover/press.** Hover = slight brightness drop / tint; press = 1px translateY. Links underline
  on hover.
- **Dark mode.** First-class. Deep navy canvas (`#101722`), lifted slate surfaces, and brightened
  hues so status colors stay legible on dark. Scoped under `[data-theme="dark"]`.

---

## Brand color & logo

- **Action color:** ownable royal **indigo `#3538CD`** (token `--blue`), chosen over the original
  generic blue `#1959C9` for more identity. It does not collide with the green/amber/red/purple
  status hues. *Prudential Red `#ED1B2E` was considered and rejected — it clashes with the
  escalate-red status signal.* Flag for the user if they want Red regardless.
- **Logo:** an ascending **bar-chart metrics mark** (not a "PM" monogram) in a rounded-square,
  with a white trend line + dot. `assets/logo-mark.svg` (symbol) and `assets/logo-lockup.svg`
  (symbol + "PMMetricsAI / Prudential KPI Control" wordmark).

## Iconography

- **System:** **Lucide** (1.75px stroke, rounded line icons) — loaded from CDN
  (`unpkg.com/lucide@0.460.0`). Used two ways: inside a **38px square badge** (`--surface-alt`
  fill, blue glyph) for nav and metric context, and as **bare line icons** for trends and meta.
- **Trends:** `trending-up` / `trending-down` / `minus` (never the old text "UP/DOWN/FLAT").
- **Emoji / unicode:** never used as iconography.
- **⚠️ Substitution flag:** the original codebase *removed* its Material Icons font (it was
  rendering raw icon names locally) and shipped no icon assets. Lucide is therefore a **chosen
  substitute**, not lifted from source. If Prudential has a mandated icon set, swap it in and update
  this section + `guidelines/brand-icons.card.html`.

---

## UAT improvement direction (2 options)

Jane asked for design improvements off UAT feedback, presented as two options. The genuine
weaknesses found in the current build, and the planned exploration, are tracked in
`guidelines/uat-improvements.*` (in progress):

1. **Polish pass** — replace text-abbreviation icon badges with Lucide; swap text "UP/DOWN/FLAT"
   for trend arrows; use the 5px accent bar + tint *only* on alerting tiles (calmer green baseline);
   tabular figures for true column alignment.
2. **Scan-optimized pass** — same fixes plus a denser executive scorecard layout (sortable/grouped
   by status, RED-first), so a C-suite reader triages by exception in seconds.

---

## Index / manifest

| Path | What |
|---|---|
| `styles.css` | Global entry point (import manifest only). Consumers link this one file. |
| `tokens/colors.css` | Base neutrals, brand + status hues, status tints, semantic aliases, dark mode. |
| `tokens/typography.css` | Inter scale, weights, tabular-figure utilities. |
| `tokens/spacing.css` | 4px spacing scale + layout widths. |
| `tokens/elevation.css` | Radius, borders, accent bar, ambient shadow, motion. |
| `tokens/fonts.css` | Inter webfont (Google Fonts CDN). |
| `tokens/base.css` | Resets, `.eyebrow`, scrollbars. |
| `assets/` | `logo-mark.svg`, `logo-lockup.svg`. |
| `guidelines/*.card.html` | Foundation specimen cards (Colors · Type · Spacing · Brand). |
| `components/core/` | `Button`, `StatusPill` (+ card). |
| `components/data-display/` | `MetricCard` hero KPI tile (+ card). |
| `components/ai/` | `AnomalyCard` governed advisory card (+ card). |
| `ui_kits/pmmetricsai/` | Interactive Luminous Clarity recreation: Executive Scorecard (+ Triage variant), Strategic Ops, Live Ops Monitor. |
| `templates/executive-scorecard/` | Consumer starting-point template (`ExecutiveScorecard.dc.html`) — composes MetricCard, StatusPill & AnomalyCard into the full dashboard; loads the DS via `ds-base.js`. |
| `SKILL.md` | Agent Skill manifest (`pmmetricsai-design`). |

> **Status:** foundations (tokens, assets, cards), four reusable components, all UI-kit screens
> (incl. the UAT-option-2 Triage Scorecard), the Executive Scorecard **template**, and `SKILL.md`
> are complete and compiling under `window.PMMetricsAIDesignSystem_9c1142`.
> Optional next: a Strategic-Ops / claim-deep-dive template, plus Switch/NavItem primitives if needed.
