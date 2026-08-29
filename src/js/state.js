let state = {};

function parseJsonValue(value, fallback) {
    if (value === null || value === undefined || value === '') return fallback;
    if (typeof value !== 'string') return value;
    try { return JSON.parse(value); } catch { return fallback; }
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
        if (!item || typeof item !== 'object') return item;
        const normalized = {};
        keys.forEach((key) => { if (item[key] !== undefined) normalized[key] = item[key]; });
        return normalized;
    });
}

function normalizeState(raw) {
    return {
        site_name: raw.site_name || 'SekolahKu',
        site_tagline: raw.site_tagline || '',
        site_description: raw.site_description || '',
        site_logo_text: raw.site_logo_text || raw.site_name || 'SekolahKu',
        site_logo_icon: raw.site_logo_icon || 'graduation-cap',
        social_facebook: raw.social_facebook || '', social_instagram: raw.social_instagram || '', social_youtube: raw.social_youtube || '', social_tiktok: raw.social_tiktok || '',
        footer_description: raw.footer_description || '', footer_copyright: raw.footer_copyright || '',
        footer_services: normalizeList(raw.footer_services), footer_links: normalizeList(raw.footer_links),
        spmb_url: raw.spmb_url || '',
        contact_phone: raw.contact_phone || '',
        contact_email: raw.contact_email || '',
        contact_address: raw.contact_address || '',
        contact_hours: raw.contact_hours || '',
        hero_badge: raw.hero_badge || '',
        hero_title: raw.hero_title || '',
        hero_subtitle: raw.hero_subtitle || '',
        hero_btn_primary_text: raw.hero_btn_primary_text || '',
        hero_btn_primary_url: raw.hero_btn_primary_url || '',
        about: normalizeObject(raw.about),
        principal: normalizeObject(raw.principal),
        hero_stats: normalizeList(raw.hero_stats),
        counter_stats: normalizeList(raw.counter_stats),
        programs: normalizeCollection(raw.programs, ['id','title','name','slug','description','excerpt','image','image_url','image_width','image_height','width','height','image_srcset','image_sizes','srcset','sizes']),
        extracurriculars: normalizeCollection(raw.extracurriculars, ['id','title','name','slug','description','excerpt','image','image_url','image_width','image_height','width','height','image_srcset','image_sizes','srcset','sizes']),
        teachers: normalizeCollection(raw.teachers, ['id','name','title','position','bio','description','image','image_url','image_width','image_height','width','height','image_srcset','image_sizes','srcset','sizes']),
        achievements: normalizeCollection(raw.achievements, ['id','title','name','description','excerpt','image','image_url','year']),
        testimonials: normalizeCollection(raw.testimonials, ['id','name','author','person','quote','content','text','image','image_url']),
        events: normalizeCollection(raw.events, ['id','title','description','excerpt','event_date','date','image','image_url']),
        galleries: normalizeCollection(raw.galleries, ['id','title','description','image','image_url','image_width','image_height','width','height','image_srcset','image_sizes','srcset','sizes','album']),
        faq: normalizeCollection(raw.faq, ['id','question','title','answer','content']),
        news: normalizeCollection(raw.news, ['id','title','slug','excerpt','content','body','published_at','created_at','image','image_url','image_width','image_height','width','height','image_srcset','image_sizes','srcset','sizes','category','author','view_count']),
        downloads: normalizeCollection(raw.downloads, ['id','title','description','category','url','file_size','size','type','extension','created_at']),
        urls: normalizeObject(raw.urls),
    };
}

export function initState() {
    const element = document.getElementById('theme-state');
    if (!element) return;
    try {
        state = normalizeState(JSON.parse(element.textContent || '{}'));
    } catch (error) {
        console.error('Theme state could not be parsed.', error);
        state = {};
    }
}

export function getState() { return state; }
