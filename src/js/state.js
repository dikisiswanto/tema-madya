import { normalizeState } from './data/normalize.js';

let state = {};

export async function initState() {
    const element = document.getElementById('theme-state');
    const source =
        document.documentElement.dataset.demoSource ||
        document.querySelector('[data-demo-source]')?.dataset.demoSource;

    try {
        if (element?.textContent?.trim()) {
            state = normalizeState(JSON.parse(element.textContent));
            return state;
        }

        const cmsShell = document.querySelector(
            '[data-spa-content][data-spa-runtime="cms-home"]',
        );
        // Never let a CMS page silently fall back to playground demo.json.
        // Missing CMS state is an integration error, not a reason to invent
        // production content.
        if (cmsShell) {
            console.error(
                'CMS theme state is missing. Demo data fallback is disabled.',
            );
            state = { runtime: 'cms-home' };
            return state;
        }

        if (!source) {
            state = {};
            return state;
        }

        const response = await fetch(source, {
            headers: { Accept: 'application/json' },
        });
        if (!response.ok)
            throw new Error(`Demo data request failed: ${response.status}`);
        state = normalizeState(await response.json());
        return state;
    } catch (error) {
        console.error('Theme state could not be loaded.', error);
        state = {};
        return state;
    }
}

export function getState() {
    return state;
}
