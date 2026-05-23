# Postman API Tests - Newman Runner

API test suite for the ESA QA Task using Postman collection format, runnable from the command line with Newman.

**Target API:** https://api.practicesoftwaretesting.com
**Collection:** Products API Tests (11 test cases, 29 assertions)

---

## Prerequisites

- **Node.js** v18 or higher → https://nodejs.org/
- **Newman** (Postman CLI runner)
- **newman-reporter-htmlextra** (for HTML reports)

### Install Newman and the HTML reporter

```bash
npm install -g newman
npm install -g newman-reporter-htmlextra
```

### Verify installation

```bash
newman --version
```

Expected output: `6.x.x`

---

## Files in this folder

| File | Purpose |
|------|---------|
| `ESA_Products_API_Tests.postman_collection.json` | Postman collection — 11 test cases |
| `ESA_Practice_API.postman_environment.json` | Environment variables (baseUrl, accessToken, etc.) |

---

## How to run the tests

From the **project root** (not from inside `/postman`):

### Basic CLI run

```bash
newman run postman/ESA_Products_API_Tests.postman_collection.json -e postman/ESA_Practice_API.postman_environment.json
```

### Run with HTML report (recommended)

```bash
newman run postman/ESA_Products_API_Tests.postman_collection.json -e postman/ESA_Practice_API.postman_environment.json -r "cli,htmlextra" --reporter-htmlextra-export docs/newman-report.html
```

The HTML report will be saved to `docs/newman-report.html` and can be opened in any browser.

---

## Test cases overview

| # | Test | Type | Method | Expected |
|---|------|------|--------|----------|
| 01 | Login (Setup) | Auth | POST `/users/login` | 200 OK + access_token |
| 02 | Get Categories (Setup) | Setup | GET `/categories/tree` | 200 OK |
| 03 | Get Brands (Setup) | Setup | GET `/brands` | 200 OK |
| 04 | Get Product Images (Setup) | Setup | GET `/images` | 200 OK |
| 05 | POST Product - Customer not authorized | Security | POST `/products` | 401 / 403 |
| 06 | POST Product - No token | Security | POST `/products` | 401 Unauthorized |
| 07 | POST Product - Invalid token | Security | POST `/products` | 401 Unauthorized |
| 08 | POST Product - Missing name | Validation | POST `/products` | 422 Unprocessable |
| 09 | POST Product - Missing product_image_id | Validation | POST `/products` | 422 Unprocessable |
| 10 | POST Product - Negative price | Validation | POST `/products` | 422 Unprocessable |
| 11 | GET Products | Positive | GET `/products` | 200 OK + data array |

---

## Notes for the evaluator

- The Practice API is a public demo site (`practicesoftwaretesting.com`). The user account stored in the collection may be wiped if the demo database is reset. If Login (test 01) returns 401, register a new user via the website and update the credentials in `01 - Login (Setup)` request body.
- Several tests are expected to **fail** — these failures document real API bugs discovered during testing (see `docs/Bug_Report.pdf` for details). The collection is intentionally written against the **correct** expected behavior, not the current (buggy) behavior.

---

**Author:** Marko Djordjevic
**Submitted as part of the ESA Gaming QA Engineer test task, 2026.**