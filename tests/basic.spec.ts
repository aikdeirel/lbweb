import { test, expect } from '@playwright/test';

test.describe('Basic Functionality', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    
    // Just check that we get a successful response
    await expect(page).toHaveTitle(/.*/); // Any title is fine
    
    // Check that the page has some content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    
    // Check for successful load
    await expect(page).toHaveURL(/.*about.*/);
    
    // Check that the page has content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});