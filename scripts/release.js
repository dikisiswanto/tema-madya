import {
    cp,
    mkdir,
    readFile,
    readdir,
    rm,
    stat,
    writeFile,
} from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { themeVersion } from './theme-version.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = themeVersion;

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`Invalid package version: ${version}`);
}

const releaseRoot = path.join(root, '.release');
const releaseApp = path.join(releaseRoot, 'app');
const releasePublic = path.join(releaseRoot, 'public');
const releaseAssets = path.join(releasePublic, 'themes', 'madya', 'assets');
const generatedRelease = path.join(releaseAssets, 'generated');
const heroSource = path.join(
    root,
    'public',
    'themes',
    'madya',
    'assets',
    'generated',
    'hero-image.jpg',
);
const output = path.join(root, `tema-madya-cms-sekolahku-v${version}.zip`);

// Never package stale staging files.
await rm(releaseRoot, { recursive: true, force: true });
await rm(output, { force: true });
await mkdir(releaseApp, { recursive: true });
await mkdir(releasePublic, { recursive: true });

// Release contract: app + public only.
await cp(path.join(root, 'app'), releaseApp, { recursive: true });
await cp(path.join(root, 'public'), releasePublic, { recursive: true });

// Remove anything under the copied theme asset tree; repopulate only the
// compiled assets plus the single approved generated hero image.
const stagedThemeAssets = path.join(releasePublic, 'themes', 'madya', 'assets');
await rm(stagedThemeAssets, { recursive: true, force: true });
await mkdir(generatedRelease, { recursive: true });

const canonicalAssets = path.join(root, 'public', 'themes', 'madya', 'assets');
const allowedAssetFiles = new Set(['app.css', 'app.js']);

for (const file of allowedAssetFiles) {
    const source = path.join(canonicalAssets, file);
    const info = await stat(source);
    if (!info.isFile()) throw new Error(`Missing compiled asset: ${source}`);
    await cp(source, path.join(releaseAssets, file));
}

const heroInfo = await stat(heroSource);
if (!heroInfo.isFile()) throw new Error(`Missing hero image: ${heroSource}`);
await cp(heroSource, path.join(generatedRelease, 'hero-image.jpg'));

await writeFile(path.join(releaseRoot, 'VERSION'), `${version}\n`, 'utf8');

// Validate package contents before creating ZIP.
const required = [
    path.join(releaseRoot, 'app'),
    path.join(releaseRoot, 'public'),
    path.join(releaseRoot, 'VERSION'),
    path.join(releaseAssets, 'app.css'),
    path.join(releaseAssets, 'app.js'),
    path.join(generatedRelease, 'hero-image.jpg'),
];

for (const item of required) {
    await stat(item);
}

const stagedGenerated = await readdir(generatedRelease);
if (stagedGenerated.length !== 1 || stagedGenerated[0] !== 'hero-image.jpg') {
    throw new Error(
        `Generated asset contract failed: ${stagedGenerated.join(', ')}`,
    );
}

// Use the repository's existing packaging mechanism if available.
const zipScript = path.join(root, 'scripts', 'zip-release.js');
if (
    await stat(zipScript)
        .then(() => true)
        .catch(() => false)
) {
    execFileSync(process.execPath, [zipScript, releaseRoot, output], {
        cwd: root,
        stdio: 'inherit',
    });
} else {
    // Fall back to the system zip command when the baseline has no packager.
    execFileSync('zip', ['-qr', output, 'app', 'public', 'VERSION'], {
        cwd: releaseRoot,
        stdio: 'inherit',
    });
}

console.log(`Release ready: ${path.basename(output)}`);
