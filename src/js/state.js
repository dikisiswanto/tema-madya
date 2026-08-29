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
        site_logo_url: raw.site_logo_url || 'https://barka.silirdev.com/media_library/images/logo.png',
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
        hero_btn_secondary_text: raw.hero_btn_secondary_text || '',
        hero_btn_secondary_url: raw.hero_btn_secondary_url || '',
        theme_color: raw.theme_color || 'default',
        section_settings: normalizeObject(raw.section_settings),
        page_banners: normalizeObject(raw.page_banners),
        about: normalizeObject(raw.about),
        principal: normalizeObject(raw.principal),
        hero_stats: normalizeList(raw.hero_stats),
        counter_stats: normalizeList(raw.counter_stats),
        programs: normalizeCollection(raw.programs, ['id','title','description','icon','link_url','link_text','sort_order','show']),
        extracurriculars: normalizeCollection(raw.extracurriculars, ['id','title','description','icon','icon_color','sort_order','show']),
        teachers: normalizeCollection(raw.teachers, ['id','name','photo','role','experience','education','social_facebook','social_instagram','social_linkedin','sort_order','show']),
        achievements: normalizeCollection(raw.achievements, ['id','student_name','photo','class_name','achievement','level','year','medal','sort_order','show']),
        testimonials: normalizeCollection(raw.testimonials, ['id','name','photo','role','quote','sort_order','show']),
        events: normalizeCollection(raw.events, ['id','title','slug','description','location','event_date','event_time','sort_order','status','show']),
        galleries: normalizeCollection(raw.galleries, ['id','category','image','caption','is_featured','sort_order','show']),
        faq: normalizeCollection(raw.faq, ['id','question','answer','category','sort_order','show']),
        news: normalizeCollection(raw.news, ['id','title','slug','excerpt','content','body','published_at','created_at','image','image_url','image_width','image_height','width','height','image_srcset','image_sizes','srcset','sizes','category','author','view_count']),
        comments: normalizeCollection(raw.comments, ['id','news_slug','name','email','avatar','comment','created_at','is_approved','parent_id']),
        downloads: normalizeCollection(raw.downloads, ['id','category','title','description','url','file_size','sort_order','show']),
        urls: normalizeObject(raw.urls),
        navigation: normalizeList(raw.navigation),
    };
}

export async function initState() {
    const element = document.getElementById('theme-state');
    const source = document.documentElement.dataset.demoSource || document.querySelector('[data-demo-source]')?.dataset.demoSource;
    try {
        if (element?.textContent?.trim()) {
            state = normalizeState(JSON.parse(element.textContent));
            return state;
        }
        if (!source) {
            state = {};
            return state;
        }
        const response = await fetch(source, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`Demo data request failed: ${response.status}`);
        state = normalizeState(await response.json());
        return state;
    } catch (error) {
        console.error('Theme state could not be loaded.', error);
        state = {};
        return state;
    }
}

export function getState() { return state; }
