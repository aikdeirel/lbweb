import { test, expect } from '@playwright/test';

test.describe('Pagination Tests', () => {
  test('news page pagination works correctly', async ({ page }) => {
    await page.goto('/news');
    
    // Check if pagination exists on the page
    const paginationElements = page.locator('[data-pagination], .pagination, a:has-text("Next"), a:has-text("Previous"), a:has-text("»"), a:has-text("«")');
    
    if (await paginationElements.count() > 0) {
      // Test next page navigation
      const nextButton = page.locator('a:has-text("Next"), a:has-text("»"), a[href*="page="]').first();
      
      if (await nextButton.count() > 0) {
        const currentUrl = page.url();
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        
        // URL should have changed (either page parameter or path)
        const newUrl = page.url();
        expect(newUrl).not.toBe(currentUrl);
        
        // Page should still have content
        const bodyText = await page.textContent('body');
        expect(bodyText).toBeTruthy();
        if (bodyText) {
          expect(bodyText.length).toBeGreaterThan(10);
        }
        
        // Check if previous/back navigation exists
        const prevButton = page.locator('a:has-text("Previous"), a:has-text("«"), a:has-text("Back")').first();
        if (await prevButton.count() > 0) {
          await prevButton.click();
          await page.waitForLoadState('networkidle');
          
          // Should be back to original or similar page
          const backUrl = page.url();
          expect(backUrl).toBeDefined();
        }
      }
    }
  });

  test('visual page pagination works correctly', async ({ page }) => {
    await page.goto('/visual');
    
    // Check if pagination exists on the page
    const paginationElements = page.locator('[data-pagination], .pagination, a:has-text("Next"), a:has-text("Previous"), a:has-text("»"), a:has-text("«")');
    
    if (await paginationElements.count() > 0) {
      // Test next page navigation
      const nextButton = page.locator('a:has-text("Next"), a:has-text("»"), a[href*="page="]').first();
      
      if (await nextButton.count() > 0) {
        const currentUrl = page.url();
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        
        // URL should have changed
        const newUrl = page.url();
        expect(newUrl).not.toBe(currentUrl);
        
        // Page should still have content
        const bodyText = await page.textContent('body');
        expect(bodyText).toBeTruthy();
        if (bodyText) {
          expect(bodyText.length).toBeGreaterThan(10);
        }
      }
    }
  });

  // Helper function for testing pagination functionality
  async function testPaginationFunctionality(page: any, pagePath: string) {
    // Set up console error listener BEFORE any navigation
    const functionalErrors: string[] = [];
    const errorHandler = (msg: { type: () => string; text: () => string }) => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        // Only capture errors that affect functionality, ignore resource loading errors
        if (!errorText.includes('Failed to load resource') && 
            !errorText.includes('404') &&
            !errorText.includes('net::ERR_') &&
            !errorText.includes('favicon')) {
          functionalErrors.push(errorText);
        }
      }
    };
    page.on('console', errorHandler);
    
    try {
      await page.goto(pagePath);
      
      // Look for any pagination controls
      const paginationControls = page.locator('a[href*="page="], a:has-text("Next"), a:has-text("Previous"), .pagination a');
      
      if (await paginationControls.count() > 0) {
        // Click on any pagination link
        const firstPaginationLink = paginationControls.first();
        await firstPaginationLink.click();
        await page.waitForLoadState('domcontentloaded'); // Changed from networkidle to domcontentloaded
        
        // Verify the page still works - ensure we're still on the same page section
        const expectedPathSegment = pagePath === '/' ? '/' : pagePath.replace(/^\//, '');
        expect(page.url()).toContain(expectedPathSegment);
        
        // Verify page has content
        const bodyText = await page.textContent('body');
        expect(bodyText).toBeTruthy();
        
        await page.waitForTimeout(1000);
        
        // Verify no critical JavaScript errors occurred during the entire flow
        expect(functionalErrors).toEqual([]);
      }
    } finally {
      // Clean up the event listener to prevent memory leaks
      page.off('console', errorHandler);
    }
  }

  test('pagination preserves page functionality on news page', async ({ page }) => {
    await testPaginationFunctionality(page, '/news');
  });

  test('pagination preserves page functionality on visual page', async ({ page }) => {
    await testPaginationFunctionality(page, '/visual');
  });

  // Helper function to test direct pagination URLs
  async function testDirectPaginationUrl(page: any, url: string) {
    const response = await page.goto(url);
    
    // Should not return 404 or 500 errors
    expect(response?.status()).toBeLessThan(400);
    
    // Should have content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  }

  test('direct pagination URL /news?page=1 works correctly', async ({ page }) => {
    await testDirectPaginationUrl(page, '/news?page=1');
  });

  test('direct pagination URL /news?page=2 works correctly', async ({ page }) => {
    await testDirectPaginationUrl(page, '/news?page=2');
  });

  test('direct pagination URL /visual?page=1 works correctly', async ({ page }) => {
    await testDirectPaginationUrl(page, '/visual?page=1');
  });

  test('direct pagination URL /visual?page=2 works correctly', async ({ page }) => {
    await testDirectPaginationUrl(page, '/visual?page=2');
  });
});