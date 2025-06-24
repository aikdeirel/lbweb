import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('can navigate to all main pages from homepage', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to main pages
    const links = [
      { selector: 'a[href="/about"]', expectedUrl: '/about', name: 'About' },
      { selector: 'a[href="/news"]', expectedUrl: '/news', name: 'News' },
      { selector: 'a[href="/visual"]', expectedUrl: '/visual', name: 'Visual' },
      { selector: 'a[href="/interlace"]', expectedUrl: '/interlace', name: 'Interlace' },
      { selector: 'a[href="/noise"]', expectedUrl: '/noise', name: 'Noise' },
      { selector: 'a[href="/pit"]', expectedUrl: '/pit', name: 'Pit' },
      { selector: 'a[href="/impressum"]', expectedUrl: '/impressum', name: 'Impressum' },
    ];

    for (const link of links) {
      // Go back to homepage
      await page.goto('/');
      
      // Check if link exists before clicking
      const linkElement = page.locator(link.selector).first();
      if (await linkElement.count() > 0) {
        await linkElement.click();
        await page.waitForURL(`**${link.expectedUrl}`);
        
        // Verify we're on the correct page
        expect(page.url()).toContain(link.expectedUrl);
        
        // Verify page has loaded (has content)
        const bodyText = await page.textContent('body');
        expect(bodyText).toBeTruthy();
        expect(bodyText!.length).toBeGreaterThan(10);
      }
    }
  });

  test('can return to homepage from any page', async ({ page }) => {
    const pages = ['/about', '/news', '/visual', '/interlace', '/noise', '/pit', '/impressum'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Look for home link (could be logo, "Home", etc.)
      const homeLinks = page.locator('a[href="/"], a[href="./"], a:has-text("Home"), a:has-text("Liquid Barbed Wire")').first();
      
      if (await homeLinks.count() > 0) {
        await homeLinks.click();
        await page.waitForURL('**/');
        expect(page.url()).toMatch(/\/$|\/index/);
      }
    }
  });

  test('all internal links are working', async ({ page }) => {
    await page.goto('/');
    
    // Get all internal links
    const links = await page.locator('a[href^="/"], a[href^="./"], a[href^="../"]').all();
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.includes('#') && !href.includes('mailto:')) {
        const response = await page.request.get(href);
        expect(response.status(), `Link ${href} should return a successful response`).toBeLessThan(400);
      }
    }
  });
});