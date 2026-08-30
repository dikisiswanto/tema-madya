import { readFile } from 'node:fs/promises';

const [header, playground, iconPhp, sectionJs, homePhp, demoRaw] = await Promise.all([
    readFile('src/theme/app/Views/themes/madya/layouts/header.php', 'utf8'),
    readFile('playground/index.html', 'utf8'),
    readFile('src/theme/app/Views/themes/madya/components/ui/icon.php', 'utf8'),
    readFile('src/js/views/section.js', 'utf8'),
    readFile('src/theme/app/Views/themes/madya/pages/home.php', 'utf8'),
    readFile('playground/data/demo.json', 'utf8'),
]);

const failures = [];
const fontAwesomeUrl = 'font-awesome/6.5.0/css/all.min.css';
if (!header.includes(fontAwesomeUrl)) failures.push('PHP theme does not load Font Awesome 6.5.0');
if (!playground.includes(fontAwesomeUrl)) failures.push('Playground does not load Font Awesome 6.5.0');
if (!iconPhp.includes("$fontAwesomeName = 'fas ' . $fontAwesomeName")) failures.push('PHP icon adapter does not normalize single fa-* values');
if (!sectionJs.includes('--rich-icon-color')) failures.push('Rich extracurricular renderer does not expose icon_color');
if (!sectionJs.includes("iconMarkup(item.icon || 'users-round', '', iconColor)")) failures.push('Rich extracurricular renderer does not pass CMS icon color to icon adapter');
if (/program-showcase-icon[^\n]+data-lucide/.test(homePhp)) failures.push('Homepage program icon bypasses the shared CMS icon adapter');

const demo = JSON.parse(demoRaw);
for (const [index, item] of (demo.extracurriculars || []).entries()) {
    if (!/^(?:fas|far|fab|fal|fat)\s+fa-[a-z0-9-]+$/i.test(item.icon || '')) {
        failures.push(`Demo extracurricular #${index + 1} is not exercising a CMS Font Awesome class`);
    }
    if (!/^#[0-9a-f]{6}$/i.test(item.icon_color || '')) {
        failures.push(`Demo extracurricular #${index + 1} has invalid icon_color`);
    }
}

if (failures.length) {
    console.error('CMS icon contract audit failed:\n- ' + failures.join('\n- '));
    process.exit(1);
}
console.log('CMS icon contract audit: OK');
