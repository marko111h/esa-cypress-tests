# ESA Cypress Test Suite

End-to-end automated test suite for [practicesoftwaretesting.com](https://practicesoftwaretesting.com/) built with Cypress 13.

This project was created as part of the ESA Gaming QA Engineer test task.

## Tech stack

- Cypress 13 — E2E test runner
- JavaScript (ES6) — test language
- Page Object Model (POM) — for maintainability

## Project structure

The cypress folder contains:

- e2e/ — test specs (01-user, 02-search, 03-cart, 04-checkout)
- pages/ — Page Object Model classes
- fixtures/ — Test data
- support/ — Cypress commands and config

## How to run

Prerequisites: Node.js 18+ and npm.

Install dependencies:

    npm install

Run interactively in Cypress UI:

    npm run cy:open

Run headless from CLI:

    npm run cy:run

Run a single spec:

    npx cypress run --spec cypress/e2e/04-checkout.cy.js

## Test coverage

| Spec | Description | Test count |
|---|---|---|
| 01-user.cy.js | Registration validation, login (valid/invalid credentials, wrong format) | 7 |
| 02-search.cy.js | Empty search, case-insensitive search, sort, filter combinations | 8 |
| 03-cart.cy.js | Add to cart, quantity update, persistence, remove items, qty limits | 6 |
| 04-checkout.cy.js | Empty cart guard, sign-in step, 5 payment methods, credit card validations | 13 |
| Total |  | 34 |

### 04-checkout.cy.js detailed breakdown

Cart and Sign-in step:
- TC-38 — Empty cart shows "The cart is empty" message
- TC-30 — Sign-in step shows both "Sign in" and "Continue as Guest" tabs

Payment methods (5 complete end-to-end flows):
- TC-31 — Bank Transfer
- TC-35 — Cash on Delivery
- TC-36 — Credit Card (valid card)
- TC-37 — Buy Now Pay Later (parameterized: 3, 6, 9, 12 monthly installments)
- TC-39 — Gift Card

Credit Card validations (3 negative tests):
- TC-32 — Invalid card number format
- TC-33 — Expired date
- TC-34 — CVV with letters

## Design decisions

### Guest checkout instead of authenticated checkout

The 04-checkout suite uses the "Continue as Guest" flow rather than logging into an existing customer account.

On this site, the "Sign in" tab on the checkout page is a link that redirects to /auth/login, and after authentication the user lands on /account, breaking the checkout flow. The guest path stays on /checkout throughout, which makes the test more stable, faster, and easier to reason about.

User authentication is covered separately in 01-user.cy.js.

### Parameterized tests for Buy Now Pay Later

TC-37 uses a forEach loop to generate 4 tests (one per installment option: 3, 6, 9, 12 months) from a single test definition. This avoids duplication.

### Confirm-button assertion for invalid payment input

The site disables the Confirm button while any field on the Credit Card form is invalid. Tests TC-32 / TC-33 / TC-34 therefore assert that the Confirm button is disabled and the exact inline validation message is shown.

### Page Object Model

All selectors are centralized in cypress/pages. Test specs never use raw data-test attributes directly. A UI change requires updating one POM method, not every test.

### Selector strategy

Primary selector: data-test attributes provided by the site.
Fallback: semantic selectors (cy.contains) when no data-test exists.
Never used: CSS classes or XPath.

## Author

Marko Djordjevic — submitted as part of the ESA Gaming QA Engineer test task, 2026.