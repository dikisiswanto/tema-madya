import { test, expect } from '@playwright/test';

test('homepage and hybrid navigation are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(/Membentuk Generasi/i);
    await page.locator('a[href="#programs"]').first().click();
    await expect(page).toHaveURL(/#programs$/);
    await expect(page.locator('h1')).toContainText('Program Akademik');
});

test('mobile menu supports drill-down', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('[data-mobile-menu]').click();
    await expect(page.locator('#mobile-navigation')).toHaveAttribute(
        'aria-hidden',
        'false',
    );
    await expect(page.locator('#mobile-navigation')).not.toHaveAttribute(
        'inert',
    );
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-navigation')).toHaveAttribute(
        'aria-hidden',
        'true',
    );
    await expect(page.locator('#mobile-navigation')).toHaveAttribute(
        'inert',
        '',
    );
});

test('desktop disclosure is keyboard accessible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
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

test('desktop navigation activates only at the spacious breakpoint', async ({
    page,
}) => {
    await page.setViewportSize({ width: 1199, height: 900 });
    await page.goto('/');
    await expect(page.locator('.desktop-nav-wrap')).toBeHidden();
    await page.setViewportSize({ width: 1200, height: 900 });
    await expect(page.locator('.desktop-nav-wrap')).toBeVisible();
});

test('mobile submenu trigger exposes its controlled panel', async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const trigger = page.locator('[data-mobile-trigger]').first();
    const panelId = await trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    await expect(page.locator(`#${panelId}`)).toHaveAttribute(
        'data-mobile-level',
        await trigger.getAttribute('data-mobile-trigger'),
    );
    await trigger.click();
    await expect(page.locator(`#${panelId}`)).toHaveAttribute(
        'aria-hidden',
        'false',
    );
});

test('deep desktop navigation reaches fourth level without leaving the viewport contract', async ({
    page,
}) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const labels = ['Profil', 'Sejarah', 'Kepemimpinan'];
    for (const label of labels) {
        const trigger = page
            .locator('[data-nav-toggle]', { hasText: label })
            .last();
        await trigger.focus();
        await page.keyboard.press('ArrowDown');
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    }
    await expect(
        page.getByRole('link', { name: 'Kepala Sekolah' }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
});

test('deep mobile navigation drills down four levels and restores focus', async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('[data-mobile-menu]').click();
    for (const id of ['profile', 'history', 'leadership']) {
        const trigger = page.locator(`[data-mobile-trigger="${id}"]`).first();
        await expect(trigger).toBeVisible();
        await trigger.click();
    }
    await expect(
        page.getByRole('link', { name: 'Kepala Sekolah' }),
    ).toBeVisible();
    await page.locator('[data-mobile-back]').first().click();
    await expect(
        page.locator('[data-mobile-level="leadership"]'),
    ).toHaveAttribute('aria-hidden', 'true');
    await page.locator('[data-mobile-back]').first().click();
    await page.locator('[data-mobile-back]').first().click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-navigation')).toHaveAttribute(
        'aria-hidden',
        'true',
    );
});

test('desktop sibling below submenu keeps the parent panel open', async ({
    page,
}) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const rootTrigger = page
        .locator('[data-nav-toggle]', { hasText: 'Profil' })
        .first();
    await rootTrigger.hover();
    const rootPanel = page.locator(
        `#${await rootTrigger.getAttribute('aria-controls')}`,
    );
    await expect(rootPanel).toBeVisible();

    const submenuTrigger = rootPanel.locator('[data-nav-toggle]', {
        hasText: 'Sejarah',
    });
    await submenuTrigger.hover();
    await expect(submenuTrigger).toHaveAttribute('aria-expanded', 'true');

    // Moving to the sibling below must close only Sejarah's branch, not Profil's
    // root panel. This is the regression that previously made the desktop menu
    // appear to disappear while traversing level-2+ items.
    const sibling = rootPanel
        .locator('[data-nav-item]', { hasText: 'Visi & Misi' })
        .first();
    await sibling.hover();
    await expect(rootPanel).toBeVisible();
    await expect(rootTrigger).toHaveAttribute('aria-expanded', 'true');
});

test('desktop deep flyouts stay inside the viewport at level 2+', async ({
    page,
}) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    for (const label of ['Profil', 'Sejarah', 'Kepemimpinan']) {
        const trigger = page
            .locator('[data-nav-toggle]', { hasText: label })
            .last();
        await trigger.hover();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    }

    const panels = page.locator(
        '[data-nav-item][data-open="true"] > .nav-panel',
    );
    const count = await panels.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < count; i += 1) {
        const box = await panels.nth(i).boundingBox();
        expect(box).not.toBeNull();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(1280);
        expect(box.y + box.height).toBeLessThanOrEqual(900);
    }
});

test('desktop deep levels share the same viewport-fixed behavior', async ({
    page,
}) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    for (const label of ['Profil', 'Sejarah', 'Kepemimpinan']) {
        const trigger = page
            .locator('[data-nav-toggle]', { hasText: label })
            .last();
        await trigger.hover();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    }

    const openPanels = page.locator(
        '[data-nav-item][data-open="true"] > .nav-panel',
    );
    await expect(openPanels).toHaveCount(3);

    for (let i = 1; i < 3; i += 1) {
        const panel = openPanels.nth(i);
        await expect(panel).toHaveCSS('position', 'fixed');
        await expect(panel).toHaveCSS('transform', 'none');
        const box = await panel.boundingBox();
        expect(box).not.toBeNull();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(1440);
        expect(box.y + box.height).toBeLessThanOrEqual(900);
    }
});

test('desktop deep-tree traversal keeps hover branch alive across leaf and grandparent', async ({
    page,
}) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const profil = page
        .locator('[data-nav-toggle]', { hasText: 'Profil' })
        .first();
    await profil.hover();
    const profilePanel = page.locator(
        `#${await profil.getAttribute('aria-controls')}`,
    );

    const sejarah = profilePanel.locator('[data-nav-toggle]', {
        hasText: 'Sejarah',
    });
    await sejarah.hover();
    const sejarahPanel = page.locator(
        `#${await sejarah.getAttribute('aria-controls')}`,
    );

    const kepemimpinan = sejarahPanel.locator('[data-nav-toggle]', {
        hasText: 'Kepemimpinan',
    });
    await kepemimpinan.hover();
    const leadershipPanel = page.locator(
        `#${await kepemimpinan.getAttribute('aria-controls')}`,
    );

    await expect(
        page.getByRole('link', { name: 'Kepala Sekolah' }),
    ).toBeVisible();

    // Move to a leaf at the deepest level, then back through its ancestors.
    await page.getByRole('link', { name: 'Kepala Sekolah' }).hover();
    await expect(leadershipPanel).toBeVisible();
    await sejarah.hover();
    await expect(profilePanel).toBeVisible();
    await expect(profil).toHaveAttribute('aria-expanded', 'true');
    // Returning to level 2 must prune the stale deeper branch, while keeping
    // the level-1/root ancestry alive.
    await expect(kepemimpinan).toHaveAttribute('aria-expanded', 'false');
    await expect(leadershipPanel).toBeHidden();

    // A leaf sibling closes the previously active child branch, but must not
    // collapse its parent/grandparent branch.
    await profilePanel.getByRole('link', { name: 'Visi & Misi' }).hover();
    await expect(profilePanel).toBeVisible();
    await expect(profil).toHaveAttribute('aria-expanded', 'true');
    await expect(sejarah).toHaveAttribute('aria-expanded', 'false');
    await expect(sejarahPanel).toBeHidden();
});

test('deep desktop flyouts do not become internal scroll containers', async ({
    page,
}) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    for (const label of ['Profil', 'Sejarah', 'Kepemimpinan']) {
        const trigger = page
            .locator('[data-nav-toggle]', { hasText: label })
            .last();
        await trigger.hover();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    }

    const panels = page
        .locator('[data-nav-item][data-open="true"] > .nav-panel')
        .nth(1);
    await expect(panels).toHaveCSS('overflow', 'visible');
    await expect(panels).toHaveCSS('max-height', 'none');
});

test('profile paragraphs follow the wrapper width on desktop', async ({
    page,
}) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#profile');
    const intro = page.locator('.profile-main .static-content-intro').first();
    const paragraph = intro.locator('> p').first();
    await expect(paragraph).toHaveCSS('max-width', 'none');
    const introBox = await intro.boundingBox();
    const paragraphBox = await paragraph.boundingBox();
    expect(introBox).not.toBeNull();
    expect(paragraphBox).not.toBeNull();
    expect(Math.abs(paragraphBox.width - introBox.width)).toBeLessThanOrEqual(
        2,
    );
});

test('static page uses the canonical rich-text renderer', async ({ page }) => {
    await page.goto('/pages/sejarah-sekolah');
    await expect(page.locator('.article-prose')).toBeVisible();
    await expect(page.locator('.article-prose h2')).toHaveCount(1);
    await expect(page.locator('.article-prose blockquote')).toBeVisible();
    await expect(page.locator('.article-prose table')).toBeVisible();
});

test('news detail exposes the canonical sidebar and comments surface', async ({
    page,
}) => {
    await page.goto('/news/membuka-semester-dengan-semangat-baru');
    await expect(page.locator('.article-sidebar')).toBeVisible();
    await expect(page.locator('.article-sidebar .share-card')).toBeVisible();
    await expect(
        page.locator('.article-sidebar .sidebar-card', {
            hasText: 'Arsip Berita',
        }),
    ).toBeVisible();
    await expect(page.locator('#komentar')).toBeVisible();
    await expect(page.locator('[data-playground-comment-form]')).toBeVisible();
});
