import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const playgroundRoot = path.join(projectRoot, 'playground');
const appEntry = path.join(projectRoot, 'src', 'js', 'app.js');
const outputRoot = path.join(projectRoot, 'dist-assets');

export default defineConfig({
    root: playgroundRoot,
    plugins: [tailwindcss()],
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
