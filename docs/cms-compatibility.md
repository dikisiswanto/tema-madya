# CMS SekolahKu 3.1.2 compatibility

Madya is a theme override for SekolahKu 3.1.2. The CMS remains the source of truth for production data and routing.

## Runtime boundary

### CMS production

- `pages/home.php` is server-rendered by `Home::index()`.
- The homepage is server-rendered by `Home::index()` and remains authoritative for both `/` and `/#`.
- An empty hash (`/#`) is not a SPA route and must restore/preserve the exact server-rendered homepage.
- Non-empty supported section hashes such as `/#programs` and `/#faq` may use the Madya hash-enhancement runtime (`cms-home`) for rich sections.
- `/news`, `/news/{slug}`, `/downloads`, `/contact`, and `/{page-slug}` remain native CodeIgniter requests.
- Native pages never receive the SPA content shell and are never intercepted by the SPA router.
- Breadcrumbs on native pages are rendered by PHP through `components/page-header.php` so direct requests and refreshes do not depend on JavaScript.

### Playground

- `playground/data/demo.json` is the only source for demo content.
- `standalone` is allowed to simulate native routes and client-side rendering.
- Demo images and demo-only copy must not be introduced into CMS PHP views. Missing CMS images use neutral theme placeholders only.
- CMS production must never fall back to `playground/data/demo.json` when `theme-state` is missing.

## Homepage data contract

The CMS `Home` controller supplies these collections: programs, extracurriculars, teachers, achievements, testimonials, news, events, galleries, and FAQ. Madya renders a short server-side preview but exposes the **full visible CMS collections** in `theme-state` for rich-component hydration.

Principal data is normalized from the CMS vocabulary (`quote`, `role`) to the renderer vocabulary (`welcome_message`, `role_title`) without inventing content.

## Icons

SekolahKu stores configurable icons as Font Awesome class strings such as `fas fa-flask`, `fas fa-microchip`, and `fa-school`. Madya accepts these values directly. Legacy `fa fa-*` values are also normalized to the solid Font Awesome prefix. Unknown icon values fall back only when the CMS value is actually missing or invalid.

## News

The CMS 3.1.2 `News::index()` controller natively supports `search`, `category`, and `month`. It does **not** currently read a `tag` GET parameter even though it exposes tags in the view data. Therefore the theme must not fake tag filtering with client-side SPA behavior. Article tags are displayed from the article's real `tags` field.

If true server-side tag filtering is required, apply the included `cms-3.1.2-news-tag-filter.patch` to the CMS controller/model. The theme detects whether the `tag` query contract is present; without it, tags are displayed as non-interactive labels rather than pretending a broken filter exists.

## Native page behavior

Native page forms, pagination, category links, download links, comments, and static-page links use ordinary browser navigation. Madya does not call `preventDefault()` for those interactions on CMS pages.
