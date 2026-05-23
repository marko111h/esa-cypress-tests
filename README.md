---

## How to run

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run interactively (Cypress UI)

```bash
npm run cy:open
```

### Run headless (CLI)

```bash
npm run cy:run
```

### Run a single spec

```bash
npx cypress run --spec cypress/e2e/04-checkout.cy.js
```

---

## Test coverage

| Spec | Description | Test count |
|---|---|---|
| `01-user.cy.js` | Registration validation, login (valid/invalid creds, wrong format) | 7 |
| `02-search.cy.js` | Empty search, case-insensitive search, sort, filter combinations | 8 |
| `03-cart.cy.js` | Add to cart, quantity update, persistence, remove items, qty limits | 6 |
| `04-checkout.cy.js` | Empty cart guard, sign-in step, 5 payment methods, credit card validations | 13 |
| **Total** | | **34** |

### 04-checkout.cy.js — detailed breakdown

**Cart & Sign-in step:**
- TC-38 — Empty cart shows "The cart is empty" message (negative path)
- TC-30 — Sign-in step shows both "Sign in" and "Continue as Guest" tabs

**Payment methods (5 — all complete the checkout end-to-end):**
- TC-31 — Bank Transfer
- TC-35 — Cash on Delivery
- TC-36 — Credit Card (valid card)
- TC-37 (×4) — Buy Now Pay Later (parameterized for 3 / 6 / 9 / 12 monthly installments)
- TC-39 — Gift Card

**Credit Card validations (3 — verify form rejects invalid input):**
- TC-32 — Invalid card number format → Confirm disabled
- TC-33 — Expired date → Confirm disabled
- TC-34 — CVV with letters → Confirm disabled

---

## Design decisions

### Guest checkout instead of authenticated checkout

The `04-checkout` suite uses the **"Continue as Guest"** flow rather than logging into an existing customer account.

**Why?** On this site, the "Sign in" tab on the checkout page is a link that redirects to `/auth/login`, and after authentication the user lands on `/account`, breaking the checkout flow. The guest path stays on `/checkout` throughout, which makes the test:
- More stable (no cross-page navigation)
- Faster (one fewer page load)
- Easier to reason about (single, linear flow)

User authentication is covered separately in `01-user.cy.js`.

### Parameterized tests for Buy Now Pay Later

TC-37 uses a `forEach` loop to generate 4 tests (one per installment option: 3, 6, 9, 12 months) from a single test definition. This avoids duplication and makes it trivial to add or remove installment options if the site changes.

### Confirm-button assertion for invalid payment input

The site disables the Confirm button while any field on the Credit Card form is invalid, instead of allowing submit-then-show-error. Tests TC-32 / TC-33 / TC-34 therefore assert:
1. The Confirm button is disabled (`.should("be.disabled")`)
2. The exact inline validation message is shown (e.g. `"CVV must be 3 or 4 digits"`)

This matches the actual UX rather than a hypothetical click-then-fail behaviour.

### Page Object Model

All selectors are centralized in `cypress/pages/*.js`. Test specs never use raw `data-test=...` strings directly. This means a UI change requires updating one POM method, not every test that touches that element.

### Selector strategy

Primary selector: `data-test="..."` attributes (provided by the site for testing).
Fallback: semantic selectors (`cy.contains("Continue as Guest")`) when no `data-test` exists.
Never used: CSS classes (`.btn-primary`) or XPath — both are too fragile.

---

## CI / CD

GitHub Actions workflow (`.github/workflows/cypress.yml`) runs the full suite on every push and pull request to `main`. Cypress runs in headless mode on Ubuntu, and the workflow fails if any test fails.

---

## Author

**Marko Djordjevic** — submitted as part of the ESA Gaming QA Engineer test task, 2026.