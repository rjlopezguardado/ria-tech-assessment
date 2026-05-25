# Ria Tech Assessment — Test Automation Suite

A Playwright-based test automation project covering UI and API testing.

- **UI tests** run against [SauceDemo](https://www.saucedemo.com)
- **API tests** run against [ReqRes](https://reqres.in)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm

---

## Installation

```bash
npm install
```

Install Playwright browsers (required on first setup):

```bash
npx playwright install
```

Install the Allure CLI globally (required to generate and open reports):

```bash
npm install -g allure-commandline
```

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# UI Testing
UI_URL=https://www.saucedemo.com
VALID_UI_USERNAME=standard_user
VALID_UI_PASSWORD=secret_sauce
LOCKED_UI_USERNAME=locked_out_user
LOCKED_UI_PASSWORD=secret_sauce

# API Testing
API_URL=https://reqres.in
API_TOKEN=your_api_token
VALID_API_USERNAME=eve.holt@reqres.in
VALID_API_PASSWORD=cityslicka
INVALID_API_USERNAME=eve.holt@reqres.in
INVALID_API_PASSWORD=wrongpassword
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run all tests with browser visible |
| `npm run test:ui` | Run UI tests only |
| `npm run test:api` | Run API tests only |

---

## Viewing Test Reports

### Allure Reports (default)

Tests generate raw results in `./allure-results/`. Use the following npm scripts to build and view the report:

| Command | Description |
|---|---|
| `npm run allure:generate` | Build the HTML report from the latest test run |
| `npm run allure:open` | Open the previously generated report in the browser |
| `npm run allure:report` | Generate and open the report in one step |

**Typical workflow:**

```bash
npm test                  # run tests (writes to allure-results/)
npm run allure:report     # generate HTML report and open in browser
```

The generated report is saved to `./allure-report/`.

### Playwright HTML Report

A Playwright HTML report is also generated automatically after each run in `./playwright-report/`. Open it with:

```bash
npx playwright show-report
```
ß
---

## Tech Stack

- [Playwright](https://playwright.dev/) v1.60
- [Allure Report](https://allurereport.org/) (allure-playwright + allure-commandline)
- Node.js / JavaScript
- dotenv
