import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'playground', 'data', 'demo.json');
const data = JSON.parse(await readFile(file, 'utf8'));

const requiredTopLevel = [
    'site_name',
    'site_description',
    'about',
    'principal',
    'programs',
    'extracurriculars',
    'teachers',
    'achievements',
    'testimonials',
    'events',
    'galleries',
    'faq',
    'news',
    'downloads',
    'navigation',
    'comments',
    'pages',
];

const collectionRequired = {
    programs: ['title', 'description'],
    extracurriculars: ['title', 'description'],
    teachers: ['name', 'photo', 'role'],
    achievements: ['student_name', 'achievement', 'year'],
    testimonials: ['name', 'quote'],
    events: ['title', 'event_date'],
    galleries: ['image'],
    faq: ['question', 'answer'],
    news: ['title', 'slug', 'excerpt', 'published_at', 'category'],
    downloads: ['title', 'category', 'url'],
    navigation: ['id', 'title'],
    comments: ['id', 'news_slug', 'name', 'comment'],
    pages: ['title', 'slug', 'content'],
};

const failures = [];
const isRecord = (value) =>
    value && typeof value === 'object' && !Array.isArray(value);

if (!isRecord(data)) failures.push('Root demo data must be an object.');

for (const key of requiredTopLevel) {
    if (!(key in data)) failures.push(`Missing top-level key: ${key}`);
}

for (const [collection, fields] of Object.entries(collectionRequired)) {
    if (!Array.isArray(data[collection])) {
        failures.push(`${collection} must be an array.`);
        continue;
    }

    data[collection].forEach((item, index) => {
        if (!isRecord(item)) {
            failures.push(`${collection}[${index}] must be an object.`);
            return;
        }
        for (const field of fields) {
            if (
                item[field] === undefined ||
                item[field] === null ||
                item[field] === ''
            ) {
                failures.push(
                    `${collection}[${index}] is missing required field: ${field}`,
                );
            }
        }
    });
}

if (!isRecord(data.about)) failures.push('about must be an object.');
if (!isRecord(data.principal)) failures.push('principal must be an object.');
if (!isRecord(data.urls)) failures.push('urls must be an object.');

const slugs = data.news
    .filter(isRecord)
    .map((item) => item.slug)
    .filter(Boolean);
if (new Set(slugs).size !== slugs.length)
    failures.push('News slugs must be unique.');

const pageSlugs = data.pages
    .filter(isRecord)
    .map((item) => item.slug)
    .filter(Boolean);
if (new Set(pageSlugs).size !== pageSlugs.length)
    failures.push('Page slugs must be unique.');

if (failures.length) {
    console.error('Demo schema check failed.');
    console.error(failures.map((failure) => `- ${failure}`).join('\n'));
    process.exit(1);
}

console.log(
    `Demo schema: OK (${data.news.length} news, ${data.pages.length} pages, ${data.downloads.length} downloads)`,
);
