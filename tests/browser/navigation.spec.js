import { test, expect } from '@playwright/test';

test('homepage and hybrid navigation are present', async ({ page }) => {
    await page.goto('/playground/');
    await expect(page.locator('h1')).toContainText('Membentuk generasi');
    await page.locator('a[href="#programs"]').first().click();
    await expect(page).toHaveURL(/#programs$/);
    await expect(page.locator('h1')).toContainText('Program Akademik');
});

test('mobile menu supports drill-down', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/playground/');
    await page.locator('[data-mobile-menu]').click();
    await expect(page.locator('#mobile-navigation')).toHaveAttribute('aria-hidden', 'false');
    await expect(page.locator('#mobile-navigation')).not.toHaveAttribute('inert');
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-navigation')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('#mobile-navigation')).toHaveAttribute('inert', '');
});


test('desktop disclosure is keyboard accessible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/playground/');
    const trigger = page.locator('[data-nav-toggle]').first();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panelId = await trigger.getAttribute('aria-controls');
    await expect(page.locator(`#${panelId}`)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
});


test('desktop navigation activates only at the spacious breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto('/playground/');
    await expect(page.locator('.desktop-nav-wrap')).toBeHidden();
    await page.setViewportSize({ width: 1120, height: 900 });
    await expect(page.locator('.desktop-nav-wrap')).toBeVisible();
});

test('mobile submenu trigger exposes its controlled panel', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/playground/');
    const trigger = page.locator('[data-mobile-trigger]').first();
    const panelId = await trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    await expect(page.locator(`#${panelId}`)).toHaveAttribute('data-mobile-level', await trigger.getAttribute('data-mobile-trigger'));
    await trigger.click();
    await expect(page.locator(`#${panelId}`)).toHaveAttribute('aria-hidden', 'false');
});
