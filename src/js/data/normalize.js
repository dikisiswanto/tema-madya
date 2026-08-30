/**
 * Canonical playground data normalization.
 *
 * The CMS remains the source of truth in PHP. The playground normalizes the
 * single demo.json source into the same field vocabulary used by renderers.
 */

const COLLECTION_FIELDS = {
    programs: ['id', 'title', 'description', 'icon', 'link_url', 'link_text', 'sort_order', 'show'],
    extracurriculars: ['id', 'title', 'description', 'icon', 'icon_color', 'sort_order', 'show'],
    teachers: ['id', 'name', 'photo', 'role', 'experience', 'education', 'social_facebook', 'social_instagram', 'social_linkedin', 'sort_order', 'show'],
    achievements: ['id', 'student_name', 'photo', 'class_name', 'achievement', 'level', 'year', 'medal', 'sort_order', 'show'],
    testimonials: ['id', 'name', 'photo', 'role', 'quote', 'sort_order', 'show'],
    events: ['id', 'title', 'slug', 'description', 'location', 'event_date', 'event_time', 'sort_order', 'status', 'show'],
    galleries: ['id', 'category', 'image', 'caption', 'is_featured', 'sort_order', 'show'],
    faq: ['id', 'question', 'answer', 'category', 'sort_order', 'show'],
    news: ['id', 'title', 'slug', 'excerpt', 'content', 'body', 'published_at', 'created_at', 'image', 'image_url', 'image_width', 'image_height', 'width', 'height', 'image_srcset', 'image_sizes', 'srcset', 'sizes', 'category', 'author', 'view_count'],
    comments: ['id', 'news_slug', 'name', 'email', 'avatar', 'comment', 'created_at', 'is_approved', 'parent_id'],
    downloads: ['id', 'category', 'title', 'description', 'url', 'file_size', 'sort_order', 'show'],
    pages: ['id', 'title', 'slug', 'content', 'excerpt', 'image', 'status', 'meta_title', 'meta_description'],
};

function parseJsonValue(value, fallback) {
    if (value === null || value === undefined || value === '') return fallback;
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function normalizeList(value) {
    const parsed = parseJsonValue(value, value);
    return Array.isArray(parsed) ? parsed : [];
}

function normalizeObject(value) {
    const parsed = parseJsonValue(value, value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

function normalizeCollection(value, keys) {
    return normalizeList(value).map((item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
        return Object.fromEntries(keys.filter((key) => item[key] !== undefined).map((key) => [key, item[key]]));
    });
}

export function normalizeState(raw = {}) {
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const state = {
        site_name: source.site_name || 'SekolahKu',
        site_tagline: source.site_tagline || '',
        site_description: source.site_description || '',
        site_url: source.site_url || '',
        meta_author: source.meta_author || '',
        meta_keywords: source.meta_keywords || '',
        meta_description: source.meta_description || '',
        site_logo_text: source.site_logo_text || source.site_name || 'SekolahKu',
        site_logo_icon: source.site_logo_icon || 'graduation-cap',
        social_facebook: source.social_facebook || '',
        social_instagram: source.social_instagram || '',
        social_youtube: source.social_youtube || '',
        social_tiktok: source.social_tiktok || '',
        footer_description: source.footer_description || '',
        footer_copyright: source.footer_copyright || '',
        footer_services: normalizeList(source.footer_services),
        footer_links: normalizeList(source.footer_links),
        spmb_url: source.spmb_url || '',
        contact_phone: source.contact_phone || '',
        contact_email: source.contact_email || '',
        contact_address: source.contact_address || '',
        contact_hours: source.contact_hours || '',
        hero_badge: source.hero_badge || '',
        hero_title: source.hero_title || '',
        hero_subtitle: source.hero_subtitle || '',
        hero_btn_primary_text: source.hero_btn_primary_text || '',
        hero_btn_primary_url: source.hero_btn_primary_url || '',
        hero_btn_secondary_text: source.hero_btn_secondary_text || '',
        hero_btn_secondary_url: source.hero_btn_secondary_url || '',
        theme_color: source.theme_color || 'default',
        section_settings: normalizeObject(source.section_settings),
        page_banners: normalizeObject(source.page_banners),
        about: normalizeObject(source.about),
        principal: normalizeObject(source.principal),
        hero_stats: normalizeList(source.hero_stats),
        counter_stats: normalizeList(source.counter_stats),
        urls: normalizeObject(source.urls),
        navigation: normalizeList(source.navigation || source.menu_tree),
    };

    for (const [collection, fields] of Object.entries(COLLECTION_FIELDS)) {
        state[collection] = normalizeCollection(source[collection], fields);
    }

    return state;
}

export { COLLECTION_FIELDS };
