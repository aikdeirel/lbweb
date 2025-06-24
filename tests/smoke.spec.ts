import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Basic Page Loading', () => {
  // List of all main pages to test
  const pages = [
    { path: '/', name: 'Home Page' },
    { path: '/about', name: 'About Page' },
    { path: '/news', name: 'News Page' },
    { path: '/visual', name: 'Visual Page' },
    { path: '/interlace', name: 'Interlace Page' },
    { path: '/noise', name: 'Noise Page' },
    { path: '/pit', name: 'Pit Page' },
    { path: '/impressum', name: 'Impressum Page' },
  ];

  // Test that each page loads successfully
  for (const page of pages) {
    test(`${page.name} loads successfully`, async ({ page: browserPage }) => {
      // Set up console error listener BEFORE navigation
      const logs: string[] = [];
      const errorHandler = (msg: any) => {
        if (msg.type() === 'error') {
          logs.push(msg.text());
        }
      };
      browserPage.on('console', errorHandler);
      
      try {
        const response = await browserPage.goto(page.path);
        
        // Check that the page loaded successfully
        expect(response?.status()).toBe(200);
        
        // Check that the page has content (not empty)
        const bodyText = await browserPage.textContent('body');
        expect(bodyText).toBeTruthy();
        expect(bodyText!.length).toBeGreaterThan(10);
        
        // Wait a moment for any async operations
        await browserPage.waitForTimeout(1000);
        
        // No JavaScript errors should be present
        expect(logs).toEqual([]);
      } finally {
        // Clean up the event listener
        browserPage.off('console', errorHandler);
      }
    });
  }

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