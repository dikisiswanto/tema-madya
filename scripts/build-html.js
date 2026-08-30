import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist-html');
const assets = path.join(root, 'dist-assets');
const playground = path.join(root, 'playground');

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'assets'), { recursive: true });
await mkdir(path.join(out, 'data'), { recursive: true });
await cp(assets, path.join(out, 'assets'), { recursive: true });
await cp(
    path.join(playground, 'data', 'demo.json'),
    path.join(out, 'data', 'demo.json'),
    { recursive: true },
);
const canonicalAssets = path.join(
    root,
    'src',
    'theme',
    'app',
    'Views',
    'themes',
    'madya',
    'assets',
);
await cp(
    path.join(canonicalAssets, 'generated'),
    path.join(out, 'themes', 'madya', 'assets', 'generated'),
    { recursive: true },
);
await cp(
    path.join(canonicalAssets, 'illustrations'),
    path.join(out, 'themes', 'madya', 'assets', 'illustrations'),
    { recursive: true },
);
await cp(
    path.join(playground, 'theme-favicon.svg'),
    path.join(out, 'theme-favicon.svg'),
);

const template = await readFile(path.join(playground, 'index.html'), 'utf8');

function buildDocument(assetPrefix) {
    return template
        .replace(/<link[^>]+data-static-css[^>]*>\s*/g, '')
        .replace(
            '</head>',
            `    <link rel="stylesheet" href="${assetPrefix}assets/app.css">\n</head>`,
        )
        .replace(
            '<body>',
            `<body data-demo-source="${assetPrefix}data/demo.json">`,
        )
        .replace(
            /<script type="module" src="\/app\.js"><\/script>/,
            `<script type="module" src="${assetPrefix}assets/app.js"></script>`,
        );
}

const routes = [
    { path: '', prefix: './' },
    { path: 'news', prefix: '../' },
    { path: 'news/membuka-semester-dengan-semangat-baru', prefix: '../../' },
    { path: 'downloads', prefix: '../' },
    { path: 'contact', prefix: '../' },
    { path: 'pages/sejarah-sekolah', prefix: '../../' },
];

for (const route of routes) {
    const directory = path.join(out, route.path);
    await mkdir(directory, { recursive: true });
    await writeFile(
        path.join(directory, 'index.html'),
        buildDocument(route.prefix),
    );
}

console.log(
    `Static HTML preview created: ${routes.length} routes in ${path.relative(root, out)}`,
);
