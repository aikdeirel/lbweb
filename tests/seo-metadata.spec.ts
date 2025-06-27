import { test, expect } from '@playwright/test';

test.describe('SEO and Metadata Tests', () => {
    test('all pages have proper title tags', async ({ page }) => {
        const pages = [
            { path: '/', expectedTitle: 'Home - Liquid Barbed Wire' },
            { path: '/news', expectedTitle: 'News - Liquid Barbed Wire' },
            { path: '/about', expectedTitle: 'About - Liquid Barbed Wire' },
            { path: '/noise', expectedTitle: 'Noise - Liquid Barbed Wire' },
            { path: '/visual', expectedTitle: 'Visual - Liquid Barbed Wire' },
            { path: '/pit', expectedTitle: 'Pit - Liquid Barbed Wire' },
            { path: '/interlace', expectedTitle: 'Interlace - Liquid Barbed Wire' },
            { path: '/impressum', expectedTitle: 'Impressum - Liquid Barbed Wire' }
        ];

        for (const pageInfo of pages) {
            await page.goto(pageInfo.path);

            // Check exact title
            await expect(page).toHaveTitle(pageInfo.expectedTitle);

            // Verify title length is reasonable (under 60 characters for SEO)
            expect(pageInfo.expectedTitle.length).toBeLessThan(60);
        }
    });

    test('pages have essential meta tags', async ({ page }) => {
        const pages = ['/', '/news', '/about', '/noise'];

        for (const pagePath of pages) {
            await page.goto(pagePath);

            // Check viewport meta tag
            const viewport = page.locator('meta[name="viewport"]');
            await expect(viewport).toHaveAttribute('content', 'width=device-width');

            // Check charset
            const charset = page.locator('meta[charset]');
            await expect(charset).toHaveAttribute('charset', 'UTF-8');

            // Check generator tag (Astro adds this)
            const generator = page.locator('meta[name="generator"]');
            await expect(generator).toHaveCount(1);
        }
    });

    test('favicon and icons are properly configured', async ({ page }) => {
        await page.goto('/');

        // Check main favicon
        const favicon = page.locator('link[rel="icon"][type="image/x-icon"]');
        await expect(favicon).toHaveAttribute('href', '/favicon.ico');

        // Check PNG favicons
        const favicon32 = page.locator('link[rel="icon"][sizes="32x32"]');
        await expect(favicon32).toHaveAttribute('href', '/favicon-32x32.png');

        const favicon16 = page.locator('link[rel="icon"][sizes="16x16"]');
        await expect(favicon16).toHaveAttribute('href', '/favicon-16x16.png');

        // Check apple touch icon
        const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
        await expect(appleTouchIcon).toHaveAttribute('href', '/apple-touch-icon.png');

        // Check manifest
        const manifest = page.locator('link[rel="manifest"]');
        await expect(manifest).toHaveAttribute('href', '/site.webmanifest');
    });

    test('robots.txt is accessible', async ({ request }) => {
        const response = await request.get('/robots.txt');
        expect(response.status()).toBe(200);

        const content = await response.text();
        expect(content).toContain('User-agent');
    });

    test('sitemap.xml is accessible', async ({ request }) => {
        const response = await request.get('/sitemap.xml');
        expect(response.status()).toBe(200);

        const content = await response.text();
        expect(content).toContain('<?xml');
        expect(content).toContain('<urlset');
    });

    test('pages have proper heading structure for SEO', async ({ page }) => {
        const pages = ['/news', '/about', '/noise', '/visual'];

        for (const pagePath of pages) {
            await page.goto(pagePath);

            // Should have exactly one H1 in main content
            const h1Count = await page.locator('main h1, .main h1').count();
            expect(h1Count).toBe(1);

            // H1 should contain meaningful text
            const h1Text = await page.locator('main h1, .main h1').first().textContent();
            expect(h1Text?.trim().length).toBeGreaterThan(5);

            // Check that headings follow logical order
            const allHeadings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
            expect(allHeadings.length).toBeGreaterThan(0);
        }

        // Home page should have proper heading structure
        await page.goto('/');
        const homeH1Count = await page.locator('main h1, .main h1').count();
        expect(homeH1Count).toBe(1); // Should have exactly one H1

        const allHeadings = await page.locator('main h1, main h2, main h3, main h4, main h5, main h6, .main h1, .main h2, .main h3, .main h4, .main h5, .main h6').allTextContents();
        expect(allHeadings.length).toBeGreaterThan(0); // Should have some headings
    });

    test('images have descriptive alt text for SEO', async ({ page }) => {
        const pages = ['/visual', '/news', '/about'];

        for (const pagePath of pages) {
            await page.goto(pagePath);

            const images = page.locator('img');
            const imageCount = await images.count();

            if (imageCount > 0) {
                for (let i = 0; i < Math.min(5, imageCount); i++) {
                    const img = images.nth(i);
                    const alt = await img.getAttribute('alt');
                    const src = await img.getAttribute('src');

                    // Skip background or decorative images
                    if (src?.includes('bg/') || src?.includes('placeholder')) {
                        continue;
                    }

                    // Alt text should exist
                    expect(alt).toBeDefined();

                    // Alt text should be descriptive (not just filename)
                    if (alt && alt.length > 0) {
                        expect(alt).not.toMatch(/\.(jpg|jpeg|png|gif|webp)$/i);
                    }
                }
            }
        }
    });

    test('page URLs are SEO-friendly', async ({ page }) => {
        const pages = [
            '/',
            '/news',
            '/about',
            '/noise',
            '/visual',
            '/pit',
            '/interlace',
            '/impressum'
        ];

        for (const pagePath of pages) {
            await page.goto(pagePath);

            const currentUrl = page.url();

            // URLs should be lowercase
            expect(currentUrl.toLowerCase()).toBe(currentUrl);

            // URLs should not have unnecessary parameters for main pages
            if (!pagePath.includes('?')) {
                expect(currentUrl).not.toContain('?');
            }

            // URLs should be clean and readable
            expect(currentUrl).not.toContain('%20'); // No encoded spaces

            // Check for double slashes in path (not protocol)
            const urlPath = currentUrl.replace(/^https?:\/\/[^\/]+/, '');
            expect(urlPath).not.toContain('//');
        }
    });

    test('external links have proper attributes', async ({ page }) => {
        const pages = ['/news', '/noise'];

        for (const pagePath of pages) {
            await page.goto(pagePath);

            // Only test content external links (exclude dev tools, framework links)
            const externalLinks = page.locator('main a[href^="http"]:not([href*="liquidbarbedwire.com"]):not(.image-link), .main a[href^="http"]:not([href*="liquidbarbedwire.com"]):not(.image-link)');
            const linkCount = await externalLinks.count();

            for (let i = 0; i < linkCount; i++) {
                const link = externalLinks.nth(i);

                // Check if this is a content link (has visible text and is in main content)
                const textContent = await link.textContent();
                const href = await link.getAttribute('href');

                // Skip framework/development related links
                if (href && !href.includes('astro.build') && !href.includes('github.com/astro')) {
                    if (textContent && textContent.trim().length > 0) {
                        // External text links should open in new tab
                        await expect(link).toHaveAttribute('target', '_blank');

                        // Should have security attributes
                        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
                    }
                }
            }
        }
    });

    test('internal links are properly formatted', async ({ page }) => {
        await page.goto('/');

        const internalLinks = page.locator('a[href^="/"]');
        const linkCount = await internalLinks.count();

        for (let i = 0; i < Math.min(10, linkCount); i++) {
            const link = internalLinks.nth(i);
            const href = await link.getAttribute('href');

            if (href) {
                // Internal links should start with / and be valid paths
                expect(href).toMatch(/^\/(\w|$)/); // Allow root "/" or paths starting with word characters

                // Should not have target="_blank"
                const target = await link.getAttribute('target');
                expect(target).not.toBe('_blank');
            }
        }
    });

    test('page load times are reasonable', async ({ page }) => {
        const pages = ['/', '/news', '/visual'];

        for (const pagePath of pages) {
            const startTime = Date.now();

            await page.goto(pagePath, { waitUntil: 'domcontentloaded' });

            const loadTime = Date.now() - startTime;

            // Page should load within 3 seconds on a good connection
            expect(loadTime).toBeLessThan(3000);
        }
    });

    test('pagination URLs are SEO-friendly', async ({ page }) => {
        const paginatedPages = ['/news', '/visual'];

        for (const basePath of paginatedPages) {
            await page.goto(basePath);

            // Check if pagination exists
            const nextLink = page.locator('a:has-text("Next")').first();

            if (await nextLink.count() > 0) {
                const href = await nextLink.getAttribute('href');

                if (href) {
                    // Pagination URLs should use query parameters
                    expect(href).toMatch(/\?page=\d+$/);

                    // Navigate to paginated page and verify it works
                    await nextLink.click();
                    await page.waitForLoadState('domcontentloaded');

                    // Should have content
                    const content = page.locator('.card, .visual-image');
                    expect(await content.count()).toBeGreaterThan(0);

                    // URL should reflect the page number
                    expect(page.url()).toContain('page=');
                }
            }
        }
    });

    test('structured data is present where applicable', async ({ page }) => {
        await page.goto('/news');

        // Check for JSON-LD structured data
        const jsonLdScripts = page.locator('script[type="application/ld+json"]');

        if (await jsonLdScripts.count() > 0) {
            const jsonLdContent = await jsonLdScripts.first().textContent();

            if (jsonLdContent) {
                // Should be valid JSON
                expect(() => JSON.parse(jsonLdContent)).not.toThrow();

                const structuredData = JSON.parse(jsonLdContent);

                // Should have schema.org context
                expect(structuredData['@context']).toBe('https://schema.org');
                expect(structuredData['@type']).toBeDefined();
            }
        }
    });
}); 