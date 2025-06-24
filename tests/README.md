# E2E Testing with Playwright

This directory contains end-to-end tests for the Liquid Barbed Wire website using [Playwright](https://playwright.dev/).

## What These Tests Do

The E2E tests verify that your Astro application works correctly from a user's perspective:

- **Smoke Tests** (`smoke.spec.ts`): Verify all pages load successfully without errors
- **Navigation Tests** (`navigation.spec.ts`): Test that users can navigate between pages
- **Pagination Tests** (`pagination.spec.ts`): Test pagination functionality on news and visual pages

## Running Tests Locally

### First Time Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npm run test:install
   ```

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in a specific browser
npx playwright test --project=chromium

# Run a specific test file
npx playwright test tests/smoke.spec.ts
```

## What the Tests Check

### Smoke Tests
- ✅ All main pages load successfully (200 status)
- ✅ Pages have content (not empty)
- ✅ No JavaScript errors in console
- ✅ 404 page works correctly
- ✅ API endpoints respond correctly

### Navigation Tests
- ✅ Can navigate to all pages from homepage
- ✅ Can return to homepage from any page
- ✅ All internal links work correctly

### Pagination Tests
- ✅ Pagination controls work on news and visual pages
- ✅ Page content loads correctly when navigating between pages
- ✅ Direct pagination URLs work correctly
- ✅ No JavaScript errors during pagination

## CI/CD Integration

These tests run automatically on:
- Pull requests to the `main` branch
- Pushes to the `main` branch

The GitHub Action will:
1. Build your Astro application
2. Start the preview server
3. Run all E2E tests across multiple browsers
4. Upload test results and reports as artifacts

## Test Configuration

The tests are configured in `playwright.config.ts` to:
- Run against multiple browsers (Chrome, Firefox, Safari, Mobile)
- Start your Astro preview server automatically
- Take screenshots on failures
- Generate detailed HTML reports

## Adding New Tests

To add new tests:

1. Create a new `.spec.ts` file in the `tests/` directory
2. Import the Playwright test utilities
3. Write your tests using the Page Object Model
4. The tests will automatically run in CI

Example:
```typescript
import { test, expect } from '@playwright/test';

test('my new test', async ({ page }) => {
  await page.goto('/my-page');
  await expect(page.locator('h1')).toContainText('Expected Title');
});
```