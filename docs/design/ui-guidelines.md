# UI Guidelines

## 1. Application Shell & Top Navigation
* **Fixed Header (64px)**: Logo + App Name + Main Nav (`Dashboard`, `POS`, `Inventory`, `Sales`, `Purchases`, `Reports`, `More ▾`) + Search trigger (`⌘K`) + Notification Bell + User Profile.
* **No Left Sidebar**: The primary navigation is strictly a clean, CareOps-inspired top navigation bar.

## 2. Desktop Breakpoint Strategy
* **Phase 1 Focus**: Strictly desktop-only.
* **Priority Targets**: `1366×768` (Counter POS laptops) and `1440×900` (Office monitors).
* **Zero Scroll Overflow Rule**: The POS billing cart, totals, and tender buttons must fit within `1366×768` without requiring page-level vertical scrolling.

## 3. Spacing & Elevation Scale
* **Base 4px Multiplier**: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`.
* **Border Radii**: `rounded-md` (`6px`), `rounded-lg` (`8px`) for inputs/buttons; `rounded-xl` (`12px`) for cards; `rounded-full` for status pills.
* **Shadows**: Soft multi-layer shadows (`box-shadow: 0 1px 3px rgba(0,0,0,0.04)`). Never use heavy pure black drop shadows.

---

## Source Reference
* Authoritative Specification: [.ai/UI_RULES.md](../../.ai/UI_RULES.md)
