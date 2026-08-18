# Playwright Course

An end-to-end test automation project built with [Playwright](https://playwright.dev/) against a demo shopping application. It demonstrates the Page Object Model, API-assisted setup (cookie/token injection), network mocking, data-driven tests, and a CI pipeline running in GitHub Actions.

**Note:** This is a practice/exercise project I completed as the final task of a test automation course, built to reinforce and demonstrate what I learned about Playwright and automation testing best practices. It's not a production application.

## Tech Stack

- [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- Node.js (CommonJS project with ES module `import` syntax in test files)
- `dotenv` for environment variables
- `node-fetch` for making API calls outside the browser
- `uuid` for generating unique test data (emails/passwords)

## Project Structure

.
├── api-calls/ # Helper functions for calling the app's API directly (e.g. login)
│ └── getLoginToken.js
├── data/ # Static/test data fixtures
│ ├── deliveryDetails.js
│ ├── paymentDetails.js
│ └── userDetails.js
├── page-objects/ # Page Object Model classes, one per page/component
│ ├── Checkout.js
│ ├── DeliveryDetails.js
│ ├── LoginPage.js
│ ├── MyAccountPage.js
│ ├── Navigation.js
│ ├── PaymentPage.js
│ ├── ProductPage.js
│ └── RegisterPage.js
├── tests/ # Test specs
│ ├── example.spec.js
│ ├── my_account.spec.js
│ ├── new_user_full_journey.spec.js
│ └── product_page_add_item.spec.js
├── utils/ # Small shared helpers
│ └── isDesktopViewport.js
├── globalSetup.js # Loads environment variables before the test run
├── playwright.config.js # Playwright configuration (baseURL, projects, timeouts, etc.)
├── shopping-store-linux-amd64 # Binary for running the demo shopping app locally (Linux)
└── .github/workflows/playwrights.yml # CI pipeline definition

## Prerequisites

- Node.js (LTS recommended)
- npm

## Setup

1. Install dependencies:
```bash
   npm ci
```
2. Install the Playwright browsers:
```bash
   npx playwright install
```
3. Create a `.env` file in the project root with the required environment variables:
ADMIN_PASSWORD=your_admin_password
   This is loaded automatically via `globalSetup.js` before tests run.

## Running the Application Under Test

The tests run against a shopping application expected to be available at `http://localhost:2221` (see `baseURL` in `playwright.config.js`).

On Linux, you can start the bundled demo app binary:

```bash
chmod +x ./shopping-store-linux-amd64
./shopping-store-linux-amd64
```

Make sure the app is running before executing the tests.

## Running the Tests

Run tests in headed mode (visible browser):

```bash
npm test
```

Run tests headless (used in CI):

```bash
npm run test:ci
```

Run a single spec file:

```bash
npx playwright test tests/new_user_full_journey.spec.js
```

Run tests in UI mode for debugging:

```bash
npx playwright test --ui
```

## Test Suite Overview

- **`new_user_full_journey.spec.js`** – Full end-to-end flow: browse products, add items to the basket, remove one, sign up as a new user, fill in delivery details, apply a discount, and complete payment.
- **`my_account.spec.js`** – Fetches a login token via the API, mocks the user-details network request, and injects a token cookie directly into the browser to simulate an authenticated session.
- **`product_page_add_item.spec.js`** – Adds a product to the basket and verifies the basket counter and button state (currently skipped).
- **`example.spec.js`** – Sample Playwright starter test against playwright.dev (currently skipped).

## Page Object Model

Each class in `page-objects/` encapsulates the locators and interactions for a specific page or component (e.g. `ProductPage`, `Checkout`, `PaymentPage`). Tests compose these classes to express user flows in readable, high-level steps rather than raw Playwright locator calls.
