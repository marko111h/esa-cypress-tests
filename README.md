# ESA QA Test Assignment

Test automation and API testing deliverables for [practicesoftwaretesting.com](https://practicesoftwaretesting.com/), submitted as part of the ESA Gaming QA Engineer test task.

This repository contains two deliverables:

- **Cypress E2E test suite** — UI automation against the storefront (`cypress/`)
- **Postman API test collection + Newman runner** — API tests with CLI execution (`postman/`)

Test reports and bug documentation are in `docs/`.

---

## Cypress E2E Test Suite

End-to-end automated test suite built with Cypress 13.

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

## Postman API Test Collection

API test suite for `https://api.practicesoftwaretesting.com` runnable from the command line with Newman.

### Tech stack

- Postman — collection format
- Newman — CLI runner
- newman-reporter-htmlextra — HTML report generator

### How to run

Prerequisites: Node.js 18+.

Install Newman and the HTML reporter:

    npm install -g newman
    npm install -g newman-reporter-htmlextra

Run the tests from the project root:

    newman run postman/ESA_Products_API_Tests.postman_collection.json -e postman/ESA_Practice_API.postman_environment.json -r "cli,htmlextra" --reporter-htmlextra-export docs/newman-report.html

The HTML report will be written to `docs/newman-report.html`.

Full Newman documentation is in [`postman/README.md`](postman/README.md).

### Test coverage

The collection contains 11 requests with 29 assertions across four test types:

| Type | Count | Tests |
|---|---|---|
| Setup | 4 | Login, Get Categories, Get Brands, Get Product Images |
| Security | 3 | No token, Invalid token, Customer role unauthorized |
| Input validation | 3 | Missing name, Missing product_image_id, Negative price |
| Positive | 1 | GET Products |

### Findings

Testing uncovered **4 API bugs** (full details in [`docs/Bug_Report.pdf`](docs/Bug_Report.pdf)):

- POST `/products` without authentication returns 201 Created instead of 401 Unauthorized
- POST `/products` with an invalid bearer token returns 201 Created instead of 401 Unauthorized
- POST `/products` with negative `price` returns 201 Created instead of 422 Unprocessable
- Customer role authorization check happens after input validation (returns 422 before 403)

The collection is intentionally written against the **correct** expected behavior, so these tests fail by design — they serve as documented bug evidence.

---

## Repository structure

    esa-qa-assignment/
    ├── cypress/                       — E2E test suite
    │   ├── e2e/                       — test specs
    │   ├── pages/                     — Page Object Model
    │   ├── fixtures/                  — test data
    │   └── support/                   — commands & config
    ├── postman/                       — API test collection
    │   ├── ESA_Products_API_Tests.postman_collection.json
    │   ├── ESA_Practice_API.postman_environment.json
    │   └── README.md                  — Newman usage docs
    ├── docs/                          — reports
    │   ├── Test_Report.pdf
    │   ├── Bug_Report.pdf
    │   └── newman-report.html
    ├── cypress.config.js
    └── package.json