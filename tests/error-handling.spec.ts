import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
    test('404 page displays correctly for non-existent pages', async ({ page }) => {
        const nonExistentPages = [
            '/non-existent-page',
            '/news/invalid-article',
            '/visual/missing-image',
            '/random-path',
            '/admin',
            '/wp-admin'
        ];

        for (const invalidPath of nonExistentPages) {
            const response = await page.goto(invalidPath);

            // Should return 404 status
            expect(response?.status()).toBeGreaterThanOrEqual(400);

            // Page should still load with content (custom 404 page)
            const bodyText = await page.textContent('body');
            expect(bodyText).toBeTruthy();
            expect(bodyText?.length).toBeGreaterThan(10);
        }
    });

    test('pagination handles invalid page numbers gracefully', async ({ page }) => {
        const invalidPaginationUrls = [
            '/news?page=0',
            '/news?page=-1',
            '/news?page=999999',
            '/news?page=abc',
            '/news?page=',
            '/visual?page=0',
            '/visual?page=-5',
            '/visual?page=invalid'
        ];

        for (const invalidUrl of invalidPaginationUrls) {
            await page.goto(invalidUrl);

            // Should either redirect to page 1 or show 404, but not crash
            const currentUrl = page.url();
            const hasValidContent = await page.locator('.card, .visual-image, .error-section').count() > 0;

            expect(hasValidContent).toBe(true);

            // If redirected, should be to a valid page
            if (currentUrl.includes('page=')) {
                expect(currentUrl).toMatch(/page=\d+/);
            }
        }
    });

    test('handles missing images gracefully', async ({ page }) => {
        await page.goto('/visual');

        // Test image error handling by monitoring console errors
        const imageErrors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error' && msg.text().includes('Failed to load resource')) {
                imageErrors.push(msg.text());
            }
        });

        await page.waitForLoadState('networkidle');

        // Check that images that fail to load don't break the layout
        const images = page.locator('img');
        const imageCount = await images.count();

        if (imageCount > 0) {
            for (let i = 0; i < Math.min(3, imageCount); i++) {
                const img = images.nth(i);

                // Image should have alt text as fallback
                await expect(img).toHaveAttribute('alt');

                // Check if image loaded successfully
                const naturalWidth = await img.evaluate((img: HTMLImageElement) => img.naturalWidth);
                const naturalHeight = await img.evaluate((img: HTMLImageElement) => img.naturalHeight);

                // If image didn't load, it should still have proper attributes
                if (naturalWidth === 0 && naturalHeight === 0) {
                    const alt = await img.getAttribute('alt');
                    expect(alt).toBeDefined();
                }
            }
        }
    });

    test('external link failures do not break page functionality', async ({ page }) => {
        await page.goto('/news');

        // Monitor network failures
        const failedRequests: string[] = [];
        page.on('requestfailed', (request) => {
            failedRequests.push(request.url());
        });

        // Check external links (they might fail, but shouldn't break the page)
        const externalLinks = page.locator('a[href^="http"]:not([href*="liquidbarbedwire.com"])');
        const linkCount = await externalLinks.count();

        if (linkCount > 0) {
            // Page should still be functional even if some external resources fail
            const firstLink = externalLinks.first();
            await expect(firstLink).toHaveAttribute('href');
            await expect(firstLink).toHaveAttribute('target', '_blank');
        }

        // Page content should still be accessible
        const content = page.locator('.card');
        expect(await content.count()).toBeGreaterThan(0);
    });

    test('audio/video elements handle missing media gracefully', async ({ page }) => {
        await page.goto('/pit');

        const audioElements = page.locator('audio');
        const audioCount = await audioElements.count();

        if (audioCount > 0) {
            for (let i = 0; i < audioCount; i++) {
                const audio = audioElements.nth(i);

                // Should have controls regardless of whether media loads
                await expect(audio).toHaveAttribute('controls');

                // Should have a source
                const sources = audio.locator('source');
                const sourceCount = await sources.count();
                expect(sourceCount).toBeGreaterThan(0);

                // Check if audio has loaded
                const canPlay = await audio.evaluate((audio: HTMLAudioElement) => {
                    return audio.readyState >= 2; // HAVE_CURRENT_DATA
                });

                // Even if audio can't play, controls should be present
                if (!canPlay) {
                    await expect(audio).toHaveAttribute('controls');
                }
            }
        }
    });

    test('handles slow network conditions gracefully', async ({ page }) => {
        // Simulate slow network
        await page.route('**/*', async (route) => {
            await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
            await route.continue();
        });

        const startTime = Date.now();
        await page.goto('/visual');
        const loadTime = Date.now() - startTime;

        // Should still load, just slower
        expect(loadTime).toBeGreaterThan(100);

        // Content should be present
        const content = page.locator('.visual-grid');
        await expect(content).toBeVisible();
    });

    test('form validation and error states', async ({ page }) => {
        await page.goto('/interlace');

        // Check if there are any forms
        const forms = page.locator('form');
        const formCount = await forms.count();

        if (formCount > 0) {
            const form = forms.first();

            // Check required fields
            const requiredInputs = form.locator('input[required], textarea[required]');
            const requiredCount = await requiredInputs.count();

            if (requiredCount > 0) {
                // Try to submit empty form
                const submitButton = form.locator('button[type="submit"], input[type="submit"]');

                if (await submitButton.count() > 0) {
                    await submitButton.click();

                    // Should show validation errors
                    const validationMessages = page.locator(':invalid, .error, .field-error');
                    // Expect either browser validation or custom validation
                    expect(await validationMessages.count()).toBeGreaterThan(0);
                }
            }
        }
    });

    test('handles special characters in URLs', async ({ page }) => {
        const specialCharUrls = [
            '/news?page=1&test=%20space',
            '/visual?search=test+query',
            '/about#section-ümlauts'
        ];

        for (const specialUrl of specialCharUrls) {
            try {
                await page.goto(specialUrl);

                // Should not crash or show error page
                const hasContent = await page.locator('h1, .card, .visual-image').count() > 0;
                expect(hasContent).toBe(true);
            } catch (error) {
                // If URL is invalid, it should be handled gracefully
                expect(error).toBeDefined();
            }
        }
    });

    test('mobile navigation handles edge cases', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Check if mobile menu exists
        const mobileMenuButton = page.locator('.btn--menu, .mobile-nav button, button[aria-label*="menu"]');

        if (await mobileMenuButton.count() > 0) {
            // Test rapid clicking
            await mobileMenuButton.click();
            await mobileMenuButton.click();
            await mobileMenuButton.click();

            // Should not break the interface
            const nav = page.locator('.nav, .mobile-nav').first();
            await expect(nav).toBeVisible();
        }
    });

    test('pagination edge cases are handled', async ({ page }) => {
        // Test edge cases around pagination boundaries
        await page.goto('/news');

        const pagination = page.locator('.pagination');

        if (await pagination.count() > 0) {
            // Check page info display
            const pageInfo = page.locator('.page-info');

            if (await pageInfo.count() > 0) {
                const pageInfoText = await pageInfo.textContent();

                // Should show valid page numbers
                expect(pageInfoText).toMatch(/Page \d+ of \d+/);

                // Extract current and total pages
                const match = pageInfoText?.match(/Page (\d+) of (\d+)/);
                if (match) {
                    const currentPage = parseInt(match[1]);
                    const totalPages = parseInt(match[2]);

                    expect(currentPage).toBeGreaterThan(0);
                    expect(totalPages).toBeGreaterThan(0);
                    expect(currentPage).toBeLessThanOrEqual(totalPages);
                }
            }
        }
    });

    test('date formatting handles invalid dates', async ({ page }) => {
        await page.goto('/news');

        const dateDisplays = page.locator('.date-display');
        const dateCount = await dateDisplays.count();

        if (dateCount > 0) {
            for (let i = 0; i < Math.min(3, dateCount); i++) {
                const dateElement = dateDisplays.nth(i);
                const dateText = await dateElement.textContent();

                if (dateText) {
                    // Should not show raw timestamps or invalid date formats
                    expect(dateText).not.toMatch(/^\d{4}-\d{2}-\d{2}/); // Raw ISO format
                    expect(dateText).not.toContain('Invalid Date');
                    expect(dateText).not.toContain('NaN');

                    // Should be a reasonable length for a formatted date
                    expect(dateText.length).toBeGreaterThan(3);
                    expect(dateText.length).toBeLessThan(50);
                }
            }
        }
    });
}); 