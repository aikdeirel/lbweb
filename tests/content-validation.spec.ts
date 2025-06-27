import { test, expect } from '@playwright/test';

test.describe('Content Validation Tests', () => {
    test('homepage displays correct content structure', async ({ page }) => {
        await page.goto('/');

        // Check main site title
        await expect(page).toHaveTitle('Home - Liquid Barbed Wire');

        // Verify haiku is present and visible
        const haiku = page.locator('.haiku');
        await expect(haiku).toBeVisible();

        // Check that haiku contains expected text structure
        await expect(page.locator('.haiku-line')).toHaveCount(3);

        // Verify navigation is present and functional
        const nav = page.locator('.nav-links');
        await expect(nav).toBeVisible();

        // Check for essential navigation links
        await expect(page.locator('.nav-link[href="/news"]')).toBeVisible();
        await expect(page.locator('.nav-link[href="/about"]')).toBeVisible();
        await expect(page.locator('.nav-link[href="/noise"]')).toBeVisible();

        // Verify home content cards are displayed
        const cards = page.locator('.card');
        expect(await cards.count()).toBeGreaterThan(0);
    });

    test('news page displays news content correctly', async ({ page }) => {
        await page.goto('/news');

        // Verify page title and heading
        await expect(page).toHaveTitle('News - Liquid Barbed Wire');
        await expect(page.locator('main h1, .main h1')).toContainText('news from the void');

        // Check that news cards are displayed
        const newsCards = page.locator('.card--news');
        expect(await newsCards.count()).toBeGreaterThan(0);

        // Verify news cards have required content
        const firstCard = newsCards.first();
        await expect(firstCard.locator('.date-display')).toBeVisible();
        await expect(firstCard.locator('p')).toBeVisible();

        // Check pagination if present
        const pagination = page.locator('.pagination');
        if (await pagination.count() > 0) {
            await expect(page.locator('.page-info')).toBeVisible();
        }

        // Verify external links have proper attributes
        const externalLinks = page.locator('main a[target="_blank"], .main a[target="_blank"]');
        for (let i = 0; i < Math.min(3, await externalLinks.count()); i++) {
            const link = externalLinks.nth(i);
            const href = await link.getAttribute('href');

            // Skip framework/development related links
            if (href && !href.includes('astro.build') && !href.includes('github.com/astro')) {
                await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            }
        }
    });

    test('visual page displays images correctly', async ({ page }) => {
        await page.goto('/visual');

        await expect(page).toHaveTitle('Visual - Liquid Barbed Wire');
        await expect(page.locator('main h1, .main h1')).toContainText('enjoy the psychedelic mayhem');

        // Check that visual grid is present
        const visualGrid = page.locator('.visual-grid');
        await expect(visualGrid).toBeVisible();

        // Verify images are displayed
        const images = page.locator('.visual-image');
        expect(await images.count()).toBeGreaterThan(0);

        // Check first few images have proper attributes
        for (let i = 0; i < Math.min(3, await images.count()); i++) {
            const img = images.nth(i);
            await expect(img).toHaveAttribute('src');
            await expect(img).toHaveAttribute('alt');
            await expect(img).toHaveAttribute('loading', 'lazy');
        }

        // Verify image links are functional
        const imageLinks = page.locator('.visual-image-link');
        for (let i = 0; i < Math.min(2, await imageLinks.count()); i++) {
            const link = imageLinks.nth(i);
            await expect(link).toHaveAttribute('href');
        }
    });

    test('about page displays band information', async ({ page }) => {
        await page.goto('/about');

        await expect(page).toHaveTitle('About - Liquid Barbed Wire');
        await expect(page.locator('main h1, .main h1')).toContainText('from the woods we come');

        // Verify subtitle is present
        await expect(page.locator('.page-subtitle')).toContainText('four-piece psychedelic doom noise band');

        // Check content cards
        const cards = page.locator('.card');
        expect(await cards.count()).toBeGreaterThan(0);

        // Verify cards have content
        const firstCard = cards.first();
        await expect(firstCard.locator('p')).toBeVisible();
    });

    test('noise page displays albums correctly', async ({ page }) => {
        await page.goto('/noise');

        await expect(page).toHaveTitle('Noise - Liquid Barbed Wire');
        await expect(page.locator('main h1, .main h1')).toContainText('our footprint');

        // Verify albums are displayed
        const cards = page.locator('.card');
        expect(await cards.count()).toBeGreaterThan(0);

        // Check album cards have expected structure
        for (let i = 0; i < Math.min(3, await cards.count()); i++) {
            const card = cards.nth(i);
            await expect(card.locator('h3')).toBeVisible(); // Album title
            await expect(card.locator('p')).toBeVisible();  // Description
        }
    });

    test('pit page displays audio content', async ({ page }) => {
        await page.goto('/pit');

        await expect(page).toHaveTitle('Pit - Liquid Barbed Wire');
        await expect(page.locator('main h1, .main h1')).toContainText('raw noise from the pit');

        // Check for audio elements
        const audioElements = page.locator('audio');
        if (await audioElements.count() > 0) {
            // Verify audio controls are present
            for (let i = 0; i < Math.min(2, await audioElements.count()); i++) {
                const audio = audioElements.nth(i);
                await expect(audio).toHaveAttribute('controls');
            }
        }

        // Check for pit images
        const pitImages = page.locator('.pit-image');
        if (await pitImages.count() > 0) {
            const firstImage = pitImages.first();
            await expect(firstImage).toHaveAttribute('src');
            await expect(firstImage).toHaveAttribute('alt');
        }
    });

    test('interlace page displays contact information', async ({ page }) => {
        await page.goto('/interlace');

        await expect(page).toHaveTitle('Interlace - Liquid Barbed Wire');
        await expect(page.locator('main h1, .main h1')).toContainText('feel free to contact us');

        // Verify contact email is present and functional
        const emailLink = page.locator('a[href^="mailto:"]');
        await expect(emailLink).toBeVisible();
        await expect(emailLink).toHaveAttribute('href', 'mailto:liquidbarbedwire@gmail.com');
    });

    test('impressum page displays legal information', async ({ page }) => {
        await page.goto('/impressum');

        await expect(page).toHaveTitle('Impressum - Liquid Barbed Wire');
        await expect(page.locator('main h1, .main h1')).toContainText('Impressum');

        // Verify legal content is present
        const impressumContent = page.locator('.impressum-content');
        await expect(impressumContent).toBeVisible();

        // Check for required legal headings
        const headings = page.locator('.impressum-content .heading');
        expect(await headings.count()).toBeGreaterThan(0);
    });

    test('navigation active states work correctly', async ({ page }) => {
        const pages = [
            { path: '/', expectedActive: 'Home' },
            { path: '/news', expectedActive: 'News' },
            { path: '/about', expectedActive: 'About' },
            { path: '/noise', expectedActive: 'Noise' },
            { path: '/visual', expectedActive: 'Visual' },
            { path: '/pit', expectedActive: 'Pit' },
            { path: '/interlace', expectedActive: 'Interlace' },
            { path: '/impressum', expectedActive: 'Impressum' }
        ];

        for (const pageInfo of pages) {
            await page.goto(pageInfo.path);

            // Check that the correct nav link has active class
            const activeLink = page.locator('.nav-link--active');
            await expect(activeLink).toContainText(pageInfo.expectedActive);

            // Verify only one link is active
            expect(await page.locator('.nav-link--active').count()).toBe(1);
        }
    });
}); 