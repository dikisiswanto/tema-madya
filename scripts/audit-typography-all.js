import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const css = fs.readFileSync(path.join(root, 'src/css/app.css'), 'utf8');
const required = [
    '.rich-sidebar-nav a',
    '.rich-program-card p',
    '.rich-program-row p',
    '.rich-person-card span',
    '.rich-achievement-card p',
    '.rich-event-row p',
    '.rich-gallery-item figcaption',
    '.rich-testimonial small',
    '.rich-faq-list',
    '.downloads-page',
    '.news-list-sidebar',
    '.article-sidebar',
    '.static-page-sidebar',
];
const missing = required.filter((s) => !css.includes(s));
if (missing.length) {
    console.error('Missing typography selectors:', missing.join(', '));
    process.exit(1);
}
if (!css.includes('font-size: max(0.8rem, 1em)')) {
    console.error('Readable typography floor missing');
    process.exit(1);
}
console.log(
    `Typography audit OK — ${required.length} rich/native selectors covered; 0.8rem floor present.`,
);
