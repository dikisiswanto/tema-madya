import { test, expect } from '@playwright/test';

async function expectSingleColumn(page, selector) {
    const grid = page.locator(selector).first();
    await expect(grid).toBeVisible();

    const columns = await grid.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns,
    );

    expect(columns.trim().split(/\s+/)).toHaveLength(1);
}

test('sidebar layouts collapse to one column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto('/pages/sejarah-sekolah');
    await expectSingleColumn(page, '.static-page-layout');

    await page.goto('/downloads');
    await expectSingleColumn(page, '.download-content-grid');

    await page.goto('/news');
    await expectSingleColumn(page, '.news-list-shell');

    await page.goto('/news/membuka-semester-dengan-semangat-baru');
    await expectSingleColumn(page, '.article-detail-layout');
});

test('desktop sidebar layouts remain two-column where intended', async ({
    page,
}) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    await page.goto('/downloads');
    await expect(page.locator('.download-content-grid')).toHaveCSS(
        'grid-template-columns',
        /.+ .+/,
    );

    await page.goto('/pages/sejarah-sekolah');
    await expect(page.locator('.static-page-layout')).toHaveCSS(
        'grid-template-columns',
        /.+ .+/,
    );
});

test('news list shell collapses to one column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/news');

    const shell = page.locator('.news-list-shell').first();
    await expect(shell).toBeVisible();

    const columns = await shell.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns,
    );
    expect(columns.trim().split(/\s+/)).toHaveLength(1);
});

test('header keeps brand left and navigation controls right-aligned', async ({
    page,
}) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const inner = page.locator('.madya-header-inner').first();
    const brand = inner.locator('.brand').first();
    const nav = inner.locator('.desktop-nav-wrap').first();
    const search = inner.locator('.header-search').first();

    await expect(brand).toBeVisible();
    await expect(nav).toBeVisible();
    await expect(search).toBeVisible();

    const [innerBox, brandBox, navBox, searchBox] = await Promise.all([
        inner.boundingBox(),
        brand.boundingBox(),
        nav.boundingBox(),
        search.boundingBox(),
    ]);

    expect(innerBox).not.toBeNull();
    expect(brandBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(searchBox).not.toBeNull();

    expect(brandBox.x).toBeLessThan(innerBox.x + innerBox.width / 2);
    expect(navBox.x).toBeGreaterThan(brandBox.x + brandBox.width);
    expect(searchBox.x).toBeGreaterThan(navBox.x + navBox.width - 1);
});

test('mobile header keeps controls visible while desktop navigation is hidden', async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.locator('.desktop-nav-wrap')).toBeHidden();
    await expect(page.locator('.brand')).toBeVisible();
    await expect(page.locator('.header-search')).toBeVisible();
    await expect(page.locator('.mobile-toggle')).toBeVisible();
});

test('mobile header gives brand the flexible space and keeps search/menu compact', async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const inner = page.locator('.madya-header-inner').first();
    const brand = inner.locator('.brand').first();
    const search = inner.locator('.header-search').first();
    const menu = inner.locator('.mobile-toggle').first();

    const [brandBox, searchBox, menuBox] = await Promise.all([
        brand.boundingBox(),
        search.boundingBox(),
        menu.boundingBox(),
    ]);

    expect(brandBox).not.toBeNull();
    expect(searchBox).not.toBeNull();
    expect(menuBox).not.toBeNull();

    expect(searchBox.width).toBeLessThanOrEqual(40);
    expect(menuBox.width).toBeLessThanOrEqual(40);
    expect(searchBox.height).toBeLessThanOrEqual(40);
    expect(menuBox.height).toBeLessThanOrEqual(40);
    expect(brandBox.width).toBeGreaterThan(searchBox.width + menuBox.width);
});
