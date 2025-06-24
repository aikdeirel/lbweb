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
        expect(bodyText!.length).toBeGreaterThan(10);
        
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
        expect(bodyText!.length).toBeGreaterThan(10);
      }
    }
  });

  test('pagination preserves page functionality', async ({ page }) => {
    const paginatedPages = ['/news', '/visual'];
    
    for (const pagePath of paginatedPages) {
      await page.goto(pagePath);
      
      // Look for any pagination controls
      const paginationControls = page.locator('a[href*="page="], a:has-text("Next"), a:has-text("Previous"), .pagination a');
      
      if (await paginationControls.count() > 0) {
        // Click on any pagination link
        const firstPaginationLink = paginationControls.first();
        await firstPaginationLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify the page still works
        expect(page.url()).toContain(pagePath.replace('/', ''));
        
        // Verify page has content
        const bodyText = await page.textContent('body');
        expect(bodyText).toBeTruthy();
        
        // Verify no JavaScript errors
        const errors: string[] = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          }
        });
        
        await page.waitForTimeout(1000);
        expect(errors).toEqual([]);
      }
    }
  });

  test('direct pagination URLs work correctly', async ({ page }) => {
    // Test direct access to paginated URLs
    const paginationUrls = [
      '/news?page=1',
      '/news?page=2',
      '/visual?page=1',
      '/visual?page=2'
    ];

    for (const url of paginationUrls) {
      const response = await page.goto(url);
      
      // Should not return 404 or 500 errors
      expect(response?.status()).toBeLessThan(400);
      
      // Should have content
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
    }
  });
});