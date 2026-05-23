# ESA QA Engineer Task — Cypress Test Automation

End-to-end test automation for [practicesoftwaretesting.com](https://practicesoftwaretesting.com/) — submitted as part of the ESA Gaming QA Engineer test task.

## What is covered

The suite covers all four functional areas required by the test task:

| Area | Spec file | Description |
|---|---|---|
| **User** (Register & Login) | `cypress/e2e/01-user.cy.js` | Login (valid / invalid credentials), email format validation, registration page navigation, BUG-002 reproduction |
| **Search & Filter** | `cypress/e2e/02-search.cy.js` | Search by name, empty state, case-insensitivity, category filter, sort A-Z, sort by price, BUG-001 + BUG-003 reproduction |
| **Cart** | `cypress/e2e/03-cart.cy.js` | Add single / multiple products, quantity update, cart persistence, remove items, BUG-004 reproduction |
| **Checkout & Payment** | `cypress/e2e/04-checkout.cy.js` | Empty cart blocking, sign-in requirement, end-to-end Bank Transfer checkout, credit card field validations |

## Project structure

```
.
├── cypress/
│   ├── e2e/                  # Test specs (one per functional area)
│   │   ├── 01-user.cy.js
│   │   ├── 02-search.cy.js
│   │   ├── 03-cart.cy.js
│   │   └── 04-checkout.cy.js
│   ├── fixtures/
│   │   └── users.json        # Test data (users, addresses, payment data)
│   ├── pages/                # Page Object Model
│   │   ├── LoginPage.js
│   │   ├── HomePage.js
│   │   ├── ProductDetailPage.js
│   │   ├── CartPage.js
│   │   └── CheckoutPage.js
│   └── support/
│       ├── commands.js       # Custom Cypress commands
│       └── e2e.js            # Global hooks and config
├── cypress.config.js         # Cypress configuration
├── package.json
└── README.md
```

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** (comes with Node)

## Setup

```bash
# Clone the repo
git clone https://github.com/<your-username>/esa-cypress-tests.git
cd esa-cypress-tests

# Install dependencies
npm install
```

## Running tests

### Interactive mode (Cypress Test Runner UI)

```bash
npm run cy:open
```

Then pick a spec from the Cypress UI.

### Headless mode (all tests)

```bash
npm test
# or
npm run cy:run
```

### Run a single area

```bash
npm run test:user       # Registration & Login
npm run test:search     # Search & Filter
npm run test:cart       # Cart
npm run test:checkout   # Checkout & Payment
```

### Run in a specific browser

```bash
npm run test:chrome
npm run test:headed     # See the browser while it runs
```

## Test data

Test credentials and other data live in `cypress/fixtures/users.json`. The default customer account is the seeded demo account provided by the application:

- Email: `customer@practicesoftwaretesting.com`
- Password: `welcome01`

You can override these via Cypress environment variables in `cypress.config.js` or via the command line:

```bash
npx cypress run --env CUSTOMER_EMAIL=other@example.com,CUSTOMER_PASSWORD=otherPass
```

## Bug coverage

Several tests intentionally document the bugs identified in manual testing:

| Bug | Severity | Reproduced by |
|---|---|---|
| **BUG-001** — Search 'hammer' misses 'Sledgehammer' (no substring matching) | High | `02-search.cy.js → TC-15` |
| **BUG-002** — Name fields accept numeric input | Medium | `01-user.cy.js → registration name validation test` |
| **BUG-003** — Sort does not reset pagination to page 1 | Low | `02-search.cy.js → BUG-003 reproduction` |
| **BUG-004** — Quantity 0/-1 silently reverts to 1 without message | Low | `03-cart.cy.js → TC-23` |

## CI / CD

Tests run automatically on every push and pull request via GitHub Actions — see `.github/workflows/cypress.yml`.

## Notes / known limitations

- Tests run against the live demo site at `https://practicesoftwaretesting.com/` — flakiness can occur if the site is under load.
- The site uses `data-test` attributes throughout, which is excellent for stable selectors and what the suite primarily relies on.
- Some tests (`BUG-001`, `BUG-003`) are *expected to fail* until the bugs are fixed — they are reproductions, not regression tests.

## Author

**Marko Djordjevic** — submitted for the ESA QA Engineer test task, 2026.
