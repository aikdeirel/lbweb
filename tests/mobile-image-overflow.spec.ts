import { test, expect } from '@playwright/test';

test.describe('Mobile Image Overflow Prevention', () => {
  // Configure mobile viewport (testing below 768px breakpoint)
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE dimensions
  });

  test('should not have horizontal overflow on about page with images', async ({ page }) => {
    await page.goto('/about');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check that no element causes horizontal overflow
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1); // Allow 1px tolerance
  });

  test('should properly constrain card images on mobile', async ({ page }) => {
    await page.goto('/about');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check all card images are properly constrained
    const cards = page.locator('.card');
    const cardCount = await cards.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const images = card.locator('img');
      const imageCount = await images.count();
      
      for (let j = 0; j < imageCount; j++) {
        const image = images.nth(j);
        
        // Check if image exists and is visible
        if (await image.isVisible()) {
          const imageBoundingBox = await image.boundingBox();
          const viewportWidth = 375; // Our mobile viewport width
          
          // Image should not exceed viewport width
          if (imageBoundingBox) {
            expect(imageBoundingBox.width).toBeLessThanOrEqual(viewportWidth);
            expect(imageBoundingBox.x + imageBoundingBox.width).toBeLessThanOrEqual(viewportWidth);
          }
        }
      }
    }
  });

  test('should have proper max-width styles on image elements', async ({ page }) => {
    await page.goto('/about');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check that all images have proper max-width constraints
    const images = page.locator('.card img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      
      if (await image.isVisible()) {
        // Check computed styles
        const maxWidth = await image.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.maxWidth;
        });
        
        const width = await image.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.width;
        });
        
        // Image should have max-width: 100% applied
        expect(maxWidth).toBe('100%');
        
        // Width should also be constrained
        expect(width).toMatch(/100%|auto|\d+px/);
      }
    }
  });

  test('should not cause horizontal scroll on news page with images', async ({ page }) => {
    await page.goto('/news');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check for horizontal overflow
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasHorizontalScroll).toBeFalsy();
  });

  test('should properly handle image grids on mobile', async ({ page }) => {
    await page.goto('/visual');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check that image grid doesn't overflow
    const imageGrid = page.locator('.image-grid');
    
    if (await imageGrid.count() > 0) {
      const gridBoundingBox = await imageGrid.first().boundingBox();
      const viewportWidth = 375;
      
      if (gridBoundingBox) {
        expect(gridBoundingBox.width).toBeLessThanOrEqual(viewportWidth);
        expect(gridBoundingBox.x + gridBoundingBox.width).toBeLessThanOrEqual(viewportWidth);
      }
    }
  });

  test('should have overflow: hidden on image containers', async ({ page }) => {
    await page.goto('/about');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check image containers have overflow: hidden
    const imageContainers = page.locator('.image-content, .images-grid');
    const containerCount = await imageContainers.count();
    
    for (let i = 0; i < containerCount; i++) {
      const container = imageContainers.nth(i);
      
      if (await container.isVisible()) {
        const overflow = await container.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.overflow;
        });
        
        expect(overflow).toBe('hidden');
      }
    }
  });
});

test.describe('Mobile Layout Constraints', () => {
  test.use({
    viewport: { width: 320, height: 568 }, // Smaller mobile device (iPhone 5/SE)
  });

  test('should handle very small mobile screens without overflow', async ({ page }) => {
    await page.goto('/about');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check that no element causes horizontal overflow on very small screens
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1); // Allow 1px tolerance
  });
});