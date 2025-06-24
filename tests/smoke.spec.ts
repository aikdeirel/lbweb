import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Basic Page Loading', () => {

  // Helper function to test page loading
  async function testPageLoads(page: any, path: string, name: string) {
    // Set up console error listener BEFORE navigation
    const logs: string[] = [];
    const errorHandler = (msg: { type: () => string; text: () => string }) => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    };
    page.on('console', errorHandler);
    
    try {
      const response = await page.goto(path);
      
      // Check that the page loaded successfully
      expect(response?.status()).toBe(200);
      
      // Check that the page has content (not empty)
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      if (bodyText) {
        expect(bodyText.length).toBeGreaterThan(10);
      }
      
      // Wait a moment for any async operations
      await page.waitForTimeout(1000);
      
      // No JavaScript errors should be present
      expect(logs).toEqual([]);
    } finally {
      // Clean up the event listener
      page.off('console', errorHandler);
    }
  }

  test('Home Page loads successfully', async ({ page }) => {
    await testPageLoads(page, '/', 'Home Page');
  });

  test('About Page loads successfully', async ({ page }) => {
    await testPageLoads(page, '/about', 'About Page');
  });

  test('News Page loads successfully', async ({ page }) => {
    await testPageLoads(page, '/news', 'News Page');
  });

  test('Visual Page loads successfully', async ({ page }) => {
    await testPageLoads(page, '/visual', 'Visual Page');
  });

  test('Interlace Page loads successfully', async ({ page }) => {
    await testPageLoads(page, '/interlace', 'Interlace Page');
  });

  test('Noise Page loads successfully', async ({ page }) => {
    await testPageLoads(page, '/noise', 'Noise Page');
  });

  test('Pit Page loads successfully', async ({ page }) => {
    await testPageLoads(page, '/pit', 'Pit Page');
  });

  test('Impressum Page loads successfully', async ({ page }) => {
    await testPageLoads(page, '/impressum', 'Impressum Page');
  });

  test('404 page works correctly', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    
    // Should return a 404 status or redirect to 404 page
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });

  test('API endpoint /api/news responds correctly', async ({ request }) => {
    const response = await request.get('/api/news');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toBeDefined();
  });
});