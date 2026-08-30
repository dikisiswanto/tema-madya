import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const release = path.join(root, 'release');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const themeSource = path.join(
    root,
    'src',
    'theme',
    'app',
    'Views',
    'themes',
    'madya',
);
const assetSource = path.join(root, 'dist-assets');
const releaseRoot = path.join(release, 'madya');
const releaseViews = path.join(releaseRoot, 'app', 'Views', 'themes', 'madya');
const releaseBridgeViews = path.join(releaseRoot, 'app', 'Views', 'pages');
const releaseAssets = path.join(
    releaseRoot,
    'public',
    'themes',
    'madya',
    'assets',
);
const validateScript = path.join(root, 'scripts', 'validate-theme.js');

execFileSync(process.execPath, [validateScript], {
    cwd: root,
    stdio: 'inherit',
});

await rm(dist, { recursive: true, force: true });
await rm(release, { recursive: true, force: true });
await mkdir(releaseViews, { recursive: true });
await mkdir(releaseBridgeViews, { recursive: true });
await mkdir(releaseAssets, { recursive: true });

await cp(themeSource, releaseViews, { recursive: true });
await cp(
    path.join(root, 'src', 'theme', 'app', 'Views', 'pages'),
    releaseBridgeViews,
    { recursive: true },
);

try {
    await stat(assetSource);
} catch {
    throw new Error(
        'Build assets not found. Run the Vite build before packaging.',
    );
}
await cp(assetSource, releaseAssets, { recursive: true });
const canonicalAssetSource = path.join(themeSource, 'assets');
const generatedRelease = path.join(releaseAssets, 'generated');
const illustrationRelease = path.join(releaseAssets, 'illustrations');
await mkdir(generatedRelease, { recursive: true });
await mkdir(illustrationRelease, { recursive: true });
await cp(path.join(canonicalAssetSource, 'generated'), generatedRelease, {
    recursive: true,
});
await cp(
    path.join(canonicalAssetSource, 'illustrations'),
    illustrationRelease,
    { recursive: true },
);

for (const asset of ['app.css', 'app.js']) {
    const info = await stat(path.join(releaseAssets, asset));
    if (info.size < 100) {
        throw new Error(
            `Production asset looks invalid or empty: ${asset} (${info.size} bytes)`,
        );
    }
}

const requiredViews = [
    'pages/home.php',
    'pages/news.php',
    'pages/single_post.php',
    'pages/downloads.php',
    'pages/contact.php',
    'pages/page.php',
];
for (const filename of requiredViews) {
    await stat(path.join(releaseViews, filename));
}

const releaseManifestPath = path.join(releaseViews, 'theme.json');
const releaseManifest = JSON.parse(await readFile(releaseManifestPath, 'utf8'));
if (releaseManifest.version !== pkg.version) {
    throw new Error(
        `Release manifest version mismatch: theme=${releaseManifest.version}, package=${pkg.version}`,
    );
}

await mkdir(dist, { recursive: true });
await cp(releaseRoot, path.join(dist, 'madya'), { recursive: true });

const archive = path.join(
    release,
    `tema-madya-cms-sekolahku-${pkg.version}.zip`,
);
try {
    execFileSync('zip', ['-qr', archive, 'madya'], {
        cwd: release,
        stdio: 'inherit',
    });
} catch (error) {
    if (process.platform !== 'win32') throw error;
    const archiveRelative = path.relative(release, archive);
    execFileSync(
        'powershell.exe',
        [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            `Compress-Archive -Path 'madya' -DestinationPath '${archiveRelative}' -Force`,
        ],
        { cwd: release, stdio: 'inherit' },
    );
}
console.log(`Release package created: ${archive}`);
