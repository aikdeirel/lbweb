import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
    test('all pages have proper heading hierarchy', async ({ page }) => {
        const pages = ['/news', '/about', '/noise', '/visual', '/pit', '/interlace', '/impressum'];

        for (const pagePath of pages) {
            await page.goto(pagePath);

            // Every page should have exactly one h1 in the main content area
            const h1Elements = page.locator('main h1, .main h1');
            expect(await h1Elements.count()).toBe(1);

            // H1 should not be empty
            const h1Text = await h1Elements.first().textContent();
            expect(h1Text?.trim()).toBeTruthy();
        }

        // Home page should have exactly one main heading for accessibility
        await page.goto('/');
        const homeH1Count = await page.locator('main h1, .main h1').count();
        expect(homeH1Count).toBe(1); // Should have exactly one H1
    });

    test('all images have alt text', async ({ page }) => {
        const pages = ['/news', '/visual', '/about', '/noise', '/pit'];

        for (const pagePath of pages) {
            await page.goto(pagePath);

            const images = page.locator('img');
            const imageCount = await images.count();

            if (imageCount > 0) {
                for (let i = 0; i < imageCount; i++) {
                    const img = images.nth(i);

                    // Every image should have an alt attribute
                    await expect(img).toHaveAttribute('alt');
                }
            }
        }
    });

    test('navigation is keyboard accessible', async ({ page }) => {
        await page.goto('/');

        // Focus on the first navigation link
        const firstNavLink = page.locator('.nav-link').first();
        await firstNavLink.focus();

        // Verify the link is focused
        await expect(firstNavLink).toBeFocused();

        // Tab through navigation links
        const navLinks = page.locator('.nav-link');
        const navLinkCount = await navLinks.count();

        for (let i = 1; i < Math.min(4, navLinkCount); i++) {
            await page.keyboard.press('Tab');
            await expect(navLinks.nth(i)).toBeFocused();
        }
    });

    test('external links have proper security attributes', async ({ page }) => {
        const pages = ['/news', '/noise'];

        for (const pagePath of pages) {
            await page.goto(pagePath);

            // Only check content external links
            const externalLinks = page.locator('main a[target="_blank"], .main a[target="_blank"]');
            const linkCount = await externalLinks.count();

            for (let i = 0; i < linkCount; i++) {
                const link = externalLinks.nth(i);
                const href = await link.getAttribute('href');

                // Skip framework/development related links
                if (href && !href.includes('astro.build') && !href.includes('github.com/astro')) {
                    // External links should have rel="noopener noreferrer"
                    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
                }
            }
        }
    });

    test('page has proper language attribute', async ({ page }) => {
        await page.goto('/');

        const html = page.locator('html');
        await expect(html).toHaveAttribute('lang', 'en');
    });

    test('media elements have proper controls', async ({ page }) => {
        await page.goto('/pit');

        // Check audio elements
        const audioElements = page.locator('audio');
        const audioCount = await audioElements.count();

        for (let i = 0; i < audioCount; i++) {
            const audio = audioElements.nth(i);

            // Should have controls
            await expect(audio).toHaveAttribute('controls');
        }

        // Check video elements if any
        const videoElements = page.locator('video');
        const videoCount = await videoElements.count();

        for (let i = 0; i < videoCount; i++) {
            const video = videoElements.nth(i);

            // Should have controls
            await expect(video).toHaveAttribute('controls');
        }
    });
}); 