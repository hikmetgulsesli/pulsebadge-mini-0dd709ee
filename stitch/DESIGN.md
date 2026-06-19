---
name: Deterministic Utility
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 16px
  gutter: 12px
  stack-sm: 4px
  stack-md: 8px
  stack-lg: 16px
---

## Brand & Style
The design system is engineered for high-density information environments where reliability and clarity are paramount. The aesthetic is "Professional Utilitarian," drawing heavily from developer tools and infrastructure monitoring dashboards. 

The visual language prioritizes function over form, utilizing a systematic approach to layout and state management. The emotional response is one of confidence and precision—users should feel that the interface is a direct, unfiltered window into their system's health. By stripping away decorative elements and focusing on clear borders, strict alignment, and semantic signaling, the design system ensures that critical status changes are never missed.

## Colors
The palette is rooted in a neutral "Slate" scale to provide a calm, unobtrusive backdrop for high-frequency data updates. 

- **Primary & Neutral:** Deep Slates (#0F172A) are used for high-contrast text and primary actions, while mid-tones provide secondary context.
- **Semantic Signaling:** The system uses a strict "Traffic Light" model for status. Green (OK), Amber (Warn), and Red (Down) are the only high-saturation colors permitted, ensuring they immediately draw the eye to areas requiring attention.
- **Surfaces:** A bright, clean canvas with subtle gray backgrounds helps differentiate between global navigation and individual monitoring modules.

## Typography
The typography system is built for density and legibility. **Inter** provides a highly readable base for the majority of the UI, while **Geist** is introduced for labels and data-heavy strings to provide a technical, monospaced feel that aligns with the developer-tool aesthetic.

Vertical rhythm is tight to maximize the number of visible monitoring rows. Use `label-caps` for all uppercase metadata headers to create clear visual separation between sections without requiring heavy lines or large gaps.

## Layout & Spacing
This design system utilizes a **Fixed Grid** logic for desktop to ensure dashboard consistency, transitioning to a fluid stack for mobile. 

The spacing rhythm is based on a strict 4px baseline. High density is achieved by using `stack-sm` (4px) for related elements (e.g., a status icon and its label) and `stack-md` (8px) for separating logical units within a card. Margins are kept compact at 16px to minimize "dead air" and ensure that the monitoring utility can be kept open in a narrow side-window or small screen.

## Elevation & Depth
Depth is communicated through **Low-contrast outlines** rather than shadows. This maintains a flat, technical profile that avoids the visual "mushiness" of soft shadows in high-density layouts.

- **Level 0 (Canvas):** The base background layer (#F8FAFC).
- **Level 1 (Cards/Panels):** Pure white surface (#FFFFFF) with a 1px solid border (#E2E8F0).
- **Interactive State:** On hover or focus, borders darken to #CBD5E1. 
- **Active Selection:** A 2px left-border "accent" in the primary color indicates the currently selected monitor or active detail view.

## Shapes
Shapes are intentionally "Soft" (0.25rem) to provide a modern feel without sacrificing the structured, grid-based layout. Small radius values are applied to cards, buttons, and input fields. Status badges and tags use a slightly more rounded profile (rounded-lg) to distinguish them from structural containers and indicate their role as discrete "pills" of information.

## Components
- **Status Badges:** High-contrast pills. For "OK", use a subtle green tint background with deep green text; for "Down", use a solid red background with white text to maximize urgency.
- **Monitoring Cards:** Minimalist white containers with a 1px border. The header should contain the service name and current uptime percentage. The body should feature a "Sparkline" or "Pulse" bar showing historical status.
- **Toggles:** Small, tactile switches. When "Off," they should blend into the neutral background; when "On," they use the Primary color to show an active process.
- **Action Buttons:** "Ghost" style by default (border and text only). Solid primary backgrounds are reserved only for the "Add Monitor" or "Save Changes" terminal actions.
- **Data Tables:** Row-based layouts with no vertical dividers. Use zebra-striping (Level 0 vs Level 1 colors) only when data density exceeds 20 rows.
- **Inputs:** Square-ish with 1px borders. Use `mono-data` font for any input fields involving URLs, IP addresses, or IDs.