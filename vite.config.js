import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { readFile } from 'node:fs/promises';
import { extname, normalize, relative, resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const playgroundRoot = path.join(projectRoot, 'playground');
const appEntry = path.join(projectRoot, 'src', 'js', 'app.js');
const outputRoot = path.join(projectRoot, 'dist-assets');

const canonicalMediaRoot = path.join(projectRoot, 'src', 'theme', 'app', 'Views', 'themes', 'madya', 'assets');
const mediaTypes = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

function canonicalThemeMediaPlugin() {
    return {
        name: 'madya-canonical-theme-media',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const prefix = '/themes/madya/assets/';
                if (!req.url?.startsWith(prefix)) return next();
                const requestPath = decodeURIComponent(req.url.slice(prefix.length).split('?')[0]);
                const safePath = normalize(requestPath).replace(/^([.][.][/\\])+/, '');
                const file = resolve(canonicalMediaRoot, safePath);
                if (!relative(canonicalMediaRoot, file) || relative(canonicalMediaRoot, file).startsWith('..')) return next();
                try {
                    const body = await readFile(file);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', mediaTypes[extname(file).toLowerCase()] || 'application/octet-stream');
                    res.setHeader('Cache-Control', 'public, max-age=3600');
                    res.end(body);
                } catch {
                    next();
                }
            });
        },
    };
}

export default defineConfig({
    root: playgroundRoot,
    plugins: [tailwindcss(), canonicalThemeMediaPlugin()],
    server: {
        host: '0.0.0.0',
        fs: {
            allow: [projectRoot],
        },
    },
    build: {
        manifest: true,
        outDir: outputRoot,
        emptyOutDir: true,
        rollupOptions: {
            input: appEntry,
            output: {
                entryFileNames: 'app.js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) return 'app.css';
                    return 'assets/[name]-[hash][extname]';
                },
            },
        },
    },
});
