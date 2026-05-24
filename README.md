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

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# UI Testing
UI_URL=https://www.saucedemo.com
VALID_UI_USERNAME=standard_user
VALID_UI_PASSWORD=secret_sauce
INVALID_UI_USERNAME=locked_out_user
INVALID_UI_PASSWORD=wrongpassword

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
| `npm run ui-test` | Run UI tests only |
| `npm run api-test` | Run API tests only |

---

## Viewing Test Reports

After a test run, open the HTML report:

```bash
npx playwright show-report
```

Reports are saved to `./playwright-report/`.

---

## Project Structure

```
├── tests/
│   ├── ui/                  # UI test specs
│   │   └── regression.spec.js
│   ├── api/                 # API test specs
│   │   └── reques.spec.js
│   ├── pages/               # Page Object Model classes
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   └── PageManager.js
│   ├── data/                # Test data
│   └── fixtures/            # Playwright fixtures
├── playwright.config.js     # Playwright configuration
├── package.json
└── .env                     # Environment variables (not committed)
```

---

## Tech Stack

- [Playwright](https://playwright.dev/) v1.60
- Node.js / JavaScript
- dotenv
