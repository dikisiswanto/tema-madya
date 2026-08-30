/** Derived collections shared by the native playground views. */

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function firstCategory(value) {
    return String(value || '').split(',')[0].trim();
}

export function newsCategories(posts = []) {
    const counts = new Map();
    posts.forEach((post) => {
        const category = firstCategory(post.category);
        if (category) counts.set(category, (counts.get(category) || 0) + 1);
    });
    return [...counts.entries()].map(([name, count]) => ({ name, count }));
}

export function newsTags(posts = []) {
    return [...new Set(posts.flatMap((post) => String(post.category || '').split(',').map((tag) => tag.trim()).filter(Boolean)))];
}

export function newsArchive(posts = []) {
    const counts = new Map();
    posts.forEach((post) => {
        const date = String(post.published_at || post.created_at || '');
        const key = date.slice(0, 7);
        if (key) counts.set(key, (counts.get(key) || 0) + 1);
    });

    return [...counts.entries()]
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, count]) => {
            const [year, monthNumber] = month.split('-');
            return {
                month,
                label: `${MONTH_NAMES[Number(monthNumber) - 1] || monthNumber} ${year}`,
                count,
            };
        });
}

export function relatedNews(posts = [], current) {
    return posts.filter((post) => post !== current).slice(0, 3);
}

export function popularNews(posts = [], limit = 5) {
    return [...posts].sort((a, b) => Number(b.view_count || 0) - Number(a.view_count || 0)).slice(0, limit);
}

export function articleReadMinutes(post) {
    const text = String(post?.content || post?.body || post?.excerpt || '').replace(/<[^>]+>/g, ' ').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    return Math.max(1, Math.ceil(words / 200));
}
