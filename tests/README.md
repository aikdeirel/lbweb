# E2E Testing with Playwright

This directory contains comprehensive end-to-end tests for the Liquid Barbed Wire website using [Playwright](https://playwright.dev/).

## What These Tests Do

The E2E tests verify that your Astro application works correctly from a user's perspective across multiple dimensions:

### Core Functionality Tests
- **Smoke Tests** (`smoke.spec.ts`): Verify all pages load successfully without errors
- **Basic Tests** (`basic.spec.ts`): Test fundamental page loading functionality  
- **Navigation Tests** (`navigation.spec.ts`): Test that users can navigate between pages
- **Pagination Tests** (`pagination.spec.ts`): Test pagination functionality on news and visual pages

### Advanced Quality Assurance Tests
- **Content Validation** (`content-validation.spec.ts`): Ensure all content displays correctly and catch content regressions
- **Accessibility Tests** (`accessibility.spec.ts`): Verify the site is usable by everyone and follows accessibility best practices
- **SEO & Metadata Tests** (`seo-metadata.spec.ts`): Ensure proper search engine optimization and metadata
- **Error Handling Tests** (`error-handling.spec.ts`): Test graceful handling of edge cases and failures
- **Mobile Responsiveness** (`mobile-responsive.spec.ts`): Ensure the site works well across different devices and screen sizes

## Running Tests Locally

### First Time Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   # Install only Chromium (recommended - faster)
   npm run test:install
   
   # Or install all browsers (Chrome, Firefox, Safari)
   npm run test:install:all
   ```

### Running Tests

#### Option 1: Standard Local Development
```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run specific test categories
npm run test:content      # Content validation tests
npm run test:accessibility # Accessibility tests
npm run test:seo          # SEO and metadata tests
npm run test:errors       # Error handling tests
npm run test:mobile       # Mobile responsiveness tests

# Run tests in a specific browser
npx playwright test --project=chromium

# Run a specific test file
npx playwright test tests/smoke.spec.ts
```

#### Option 2: Docker Development (Recommended for Docker users)
```bash
# 1. Start your app in Docker
npm run dev:docker

# 2. Run tests against the Dockerized app
npm run test:e2e:docker

# 3. Clean up when done
npm run dev:docker:down
```

## What the Tests Check

### Core Functionality Tests

#### Smoke Tests
- ✅ All main pages load successfully (200 status)
- ✅ Pages have content (not empty)
- ✅ No JavaScript errors in console
- ✅ 404 page works correctly

#### Navigation Tests
- ✅ Can navigate to all pages from homepage
- ✅ Can return to homepage from any page
- ✅ All internal links work correctly
- ✅ Navigation active states work properly

#### Pagination Tests
- ✅ Pagination controls work on news and visual pages
- ✅ Page content loads correctly when navigating between pages
- ✅ Direct pagination URLs work correctly
- ✅ No JavaScript errors during pagination

### Advanced Quality Assurance Tests

#### Content Validation Tests
- ✅ Homepage displays correct structure (haiku, cards, navigation)
- ✅ News page shows news content with proper formatting
- ✅ Visual page displays images with lazy loading
- ✅ About page shows band information
- ✅ Albums display correctly on noise page
- ✅ Audio content works on pit page
- ✅ Contact information is accessible
- ✅ Legal information displays properly

#### Accessibility Tests
- ✅ Proper heading hierarchy (H1, H2, H3 structure)
- ✅ All images have descriptive alt text
- ✅ Keyboard navigation works correctly
- ✅ External links have proper security attributes
- ✅ Page has proper language attribute
- ✅ Media elements have proper controls

#### SEO & Metadata Tests
- ✅ All pages have proper title tags (under 60 characters)
- ✅ Essential meta tags are present (viewport, charset)
- ✅ Favicon and icons are properly configured
- ✅ robots.txt and sitemap.xml are accessible
- ✅ Proper heading structure for SEO
- ✅ Images have SEO-friendly alt text
- ✅ URLs are SEO-friendly and clean
- ✅ Page load times are reasonable
- ✅ Structured data is present where applicable

#### Error Handling Tests
- ✅ 404 pages display correctly for non-existent content
- ✅ Invalid pagination parameters are handled gracefully
- ✅ Missing images don't break layout
- ✅ External link failures don't affect functionality
- ✅ Audio/video elements handle missing media
- ✅ Slow network conditions are handled
- ✅ Special characters in URLs work correctly
- ✅ Date formatting handles edge cases

#### Mobile Responsiveness Tests
- ✅ Navigation adapts to different screen sizes
- ✅ Content layout adapts properly on mobile
- ✅ Images scale correctly on mobile devices
- ✅ Touch interactions work properly
- ✅ Typography scales appropriately
- ✅ Mobile menu functionality works
- ✅ Grid layouts adapt to screen size
- ✅ Pagination controls are touch-friendly
- ✅ Form elements are mobile-friendly
- ✅ Media queries work correctly

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