# UX Guidelines

## 1. POS Speed & Usability Rules
1. **Barcode Focus Invariant**: The product search bar automatically regains focus after adding items, changing tender, or closing modals.
2. **Keyboard First Operations**:
   * `F2`: Global Product Search
   * `F4`: Customer Phone Lookup
   * `F6`: Hold Current Active Bill
   * `F7`: Resume Parked Bill
   * `F8`: Complete Sale / Open Tender
   * `F9`: Print Last Receipt
   * `⌘K` / `Ctrl+K`: Global Command Palette
   * `Esc`: Close Modal / Cancel
3. **Change Tender Velocity**: Quick cash tender chips (`[Exact]`, `[+₹100]`, `[+₹500]`, `[+₹2000]`) with instant high-contrast calculation of change due to customer.

---

## 2. Standard State Handling Patterns

* **Loading States**: Shimmering skeleton cards and table rows matching target dimensions (No layout shift).
* **Empty States**: Centered icon circle + bold title + descriptive subtitle + primary action button.
* **Error States**: Non-technical explanation + `Retry` action (No raw stack traces).
* **Success Toast**: Non-blocking toast (`4000ms`) with checkmark and direct receipt link.
* **Confirmation Modals**: High-impact dialogs explaining exact consequences for stock adjustments and cancellations.

---

## Source Reference
* Authoritative Specification: [.ai/UI_RULES.md](../../.ai/UI_RULES.md)
