import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const demoPath = path.join(root, 'playground', 'data', 'demo.json');
const demo = JSON.parse(fs.readFileSync(demoPath, 'utf8'));

const homeContract = {
    scalar: [
        'site_name', 'site_tagline', 'site_description', 'site_logo_text', 'site_logo_icon',
        'contact_phone', 'contact_email', 'contact_address', 'contact_hours',
        'social_facebook', 'social_instagram', 'social_youtube', 'social_tiktok',
        'footer_description', 'footer_copyright', 'hero_badge', 'hero_title', 'hero_subtitle',
        'hero_btn_primary_text', 'hero_btn_primary_url', 'hero_btn_secondary_text',
        'hero_btn_secondary_url', 'spmb_url', 'theme_color',
    ],
    objects: ['section_settings', 'page_banners', 'principal', 'about', 'urls'],
    lists: ['footer_services', 'footer_links', 'hero_stats', 'counter_stats', 'navigation'],
    collections: ['programs', 'extracurriculars', 'teachers', 'achievements', 'testimonials', 'news', 'events', 'galleries', 'faq'],
};

const expected = new Set([...homeContract.scalar, ...homeContract.objects, ...homeContract.lists, ...homeContract.collections]);
const missing = [...expected].filter((key) => demo[key] === undefined);
if (missing.length) {
    console.error(`CMS data contract: field demo hilang: ${missing.join(', ')}`);
    process.exit(1);
}

const collectionFields = {
    programs: ['id', 'title', 'description', 'icon', 'link_url', 'link_text', 'sort_order', 'show'],
    extracurriculars: ['id', 'title', 'description', 'icon', 'icon_color', 'sort_order', 'show'],
    teachers: ['id', 'name', 'photo', 'role', 'experience', 'education', 'social_facebook', 'social_instagram', 'social_linkedin', 'sort_order', 'show'],
    achievements: ['id', 'student_name', 'photo', 'class_name', 'achievement', 'level', 'year', 'medal', 'sort_order', 'show'],
    testimonials: ['id', 'name', 'photo', 'role', 'quote', 'sort_order', 'show'],
    events: ['id', 'title', 'slug', 'description', 'location', 'event_date', 'event_time', 'sort_order', 'status', 'show'],
    galleries: ['id', 'category', 'image', 'caption', 'is_featured', 'sort_order', 'show'],
    faq: ['id', 'question', 'answer', 'category', 'sort_order', 'show'],
    news: ['id', 'title', 'slug', 'excerpt', 'content', 'image', 'published_at', 'category', 'author'],
};

const errors = [];
for (const [collection, fields] of Object.entries(collectionFields)) {
    const rows = Array.isArray(demo[collection]) ? demo[collection] : [];
    for (const [index, row] of rows.entries()) {
        for (const field of fields) {
            if (!(field in row)) errors.push(`${collection}[${index}].${field}`);
        }
    }
}

if (errors.length) {
    console.error(`CMS data contract: field collection hilang:\n- ${errors.join('\n- ')}`);
    process.exit(1);
}

console.log('CMS data contract: OK');
