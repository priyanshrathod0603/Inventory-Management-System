# User Guide (Store Operator & Billing Counter)

## 1. Status Notice
* **Implementation Status**: POS Counter Billing is scheduled for Phase 11.
* The application technical foundation and dynamic category filtering architecture are specified and ready.

---

## 2. Operating the Billing Counter (POS)
1. **Dynamic Category Filtering**: Click dynamic category chips (sourced strictly from your store's real product categories) or view `"All"`.
2. **Scanning & Adding Items**: Point USB/Bluetooth barcode scanner at product barcode, click a product card, or press `F2` to search by title/SKU.
3. **Quantity Stepper**: Use `+` and `-` buttons or keyboard arrows to adjust item quantities.
4. **Applying Discounts**: Enter percentage or fixed Rupee discount per line item or overall order discount.
5. **Selecting Payment Mode**: Select `Cash`, `UPI` (generates dynamic QR code on screen), `Card`, or `Customer Khata Credit`.
6. **Completing Transaction**: Press `F8` or `Enter` to confirm checkout. The receipt automatically dispatches to the thermal printer.

---

## 3. Holding & Resuming Bills
* Press `F6` to park an active customer cart.
* Press `F7` to open the parked bills drawer, select a previously held cart, and resume billing.

---

## Source Reference
* Authoritative Specification: [.ai/PRODUCT_REQUIREMENTS.md](../../.ai/PRODUCT_REQUIREMENTS.md), [.ai/UI_RULES.md](../../.ai/UI_RULES.md), and [.ai/DECISIONS.md](../../.ai/DECISIONS.md)
