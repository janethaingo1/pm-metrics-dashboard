---
name: Antigravity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464652'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777683'
  outline-variant: '#c7c5d4'
  surface-tint: '#4f54b4'
  primary: '#15157d'
  on-primary: '#ffffff'
  primary-container: '#2e3192'
  on-primary-container: '#9da1ff'
  inverse-primary: '#c0c1ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#32007d'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c00b5'
  on-tertiary-container: '#b699ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#04006d'
  on-primary-fixed-variant: '#373a9b'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-metric:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  display-metric-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  containerPadding: 24px
  gridGutter: 16px
  componentGap: 12px
  tightGap: 8px
  inlinePadding: 12px 16px
  tableCellPadding: 8px 12px
---

## Brand & Style

The design system is engineered for high-stakes data environments where clarity and rapid cognition are paramount. The brand personality is **authoritative yet frictionless**, positioning itself as an intelligent co-pilot for decision-makers. It evokes a sense of **unshakeable reliability** and **forward-looking intelligence**.

The visual style is **Modern Corporate / Minimalist**, characterized by high information density, systematic alignment, and a sophisticated use of whitespace to prevent cognitive overload. It avoids decorative flourishes in favor of functional aesthetics—utilizing subtle depth, precise borders, and purposeful color application to guide the user's eye to critical anomalies and trends.

## Colors

This design system utilizes a structured palette to communicate performance status instantly. 
- **Deep Indigo (Primary):** Used for navigation, primary actions, and branding to establish trust.
- **Emerald (Success):** Represents positive variance and targets met.
- **Amber (Warning):** Signifies metrics nearing thresholds or requiring attention.
- **Crimson (Danger):** Highlights critical underperformance or urgent errors.
- **Soft Violet (AI Insight):** A unique identifier for machine-generated observations and confidence-based data.
- **Slate & Gray (Neutral):** Used for structural boundaries, typography, and secondary metadata to maintain a clean hierarchy.

## Typography

The system relies on **Inter** for its exceptional legibility in data-dense interfaces. 
- **Metrics:** Use `display-metric` for primary KPI figures to ensure they are the first thing a user sees.
- **Labels:** Use `label-sm` in all-caps for table headers and section titles to differentiate them from data.
- **Data Tables:** Primarily use `body-md` for row content to maximize vertical density.
- **Confidence Indicators:** Percentage values within AI components should use `label-sm` with slightly increased letter spacing for clarity.

## Layout & Spacing

The layout follows a **fluid grid system** designed for 12 columns on desktop. 
- **Margins:** 24px outer margins on desktop, scaling down to 16px on mobile.
- **Information Density:** Spacing is tight but disciplined. Grids use a 4px base unit, with 16px gutters between dashboard cards.
- **Responsive Behavior:** 
  - **Desktop:** Side navigation is persistent; cards can span multiple columns.
  - **Tablet:** Side navigation collapses into a rail; 2-column card layout.
  - **Mobile:** All cards stack vertically; horizontal scrolling enabled for wide data tables.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a clean, professional look.
- **Base Surface:** The main background is a light slate (`#F8FAFC`).
- **Cards:** White surfaces with a 1px solid border (`#E2E8F0`). No shadows are used for static cards to prevent visual "muddiness."
- **Interactive Elements:** Soft, 2px ambient shadows are reserved for hovered states, dropdowns, and modals to indicate focus.
- **AI Insight Layers:** AI-specific components use a subtle Soft Violet tint (`#F5F3FF`) on the background to visually separate automated insights from raw data.

## Shapes

The shape language is **Soft (0.25rem)**, reflecting a professional, structured environment that isn't overly clinical.
- **Cards & Inputs:** 4px (`0.25rem`) corner radius.
- **Variance Chips:** 12px (`0.75rem`) or fully rounded (pill) to distinguish them from functional buttons.
- **Real-time Indicators:** Circular (50% radius) for pulsing status dots.

## Components

### Buttons & Chips
- **Primary:** Solid Deep Indigo with white text.
- **Variance Chips:** Backgrounds with 10% opacity of the semantic color (e.g., 10% Emerald for positive trend) with 100% opacity text. They include inline trend arrows.
- **AI Confidence Chips:** Soft Violet background with a subtle border, displaying "XX% Confidence."

### Cards & AI Insights
- **KPI Cards:** Contain a label, a large metric, a sparkline, and a variance chip.
- **AI Insight Cards:** Distinguished by a 2px left-border in Soft Violet and a light violet background wash. These often contain "Explainability" text and a "Dismiss/Action" button group.

### Data Tables
- **Header:** Sticky headers with a light gray background and `label-sm` typography.
- **Rows:** Alternating subtle zebra striping or 1px bottom borders. High density (8px vertical padding).
- **Status Indicators:** Pulsing 8px dots for real-time data streams (Green = Live, Gray = Stale).

### Trend Charts
- **Sparklines:** Simplified, 2px stroke width, using semantic colors based on the overall period variance.
- **Area Charts:** Subtle gradient fills using 5% opacity of the line color.