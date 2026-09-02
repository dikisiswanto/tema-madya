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
import { platform } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { themeVersion } from './theme-version.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const version = themeVersion;

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`Invalid package version: ${version}`);
}

const releaseDir = path.join(root, 'release');
const releaseApp = path.join(releaseDir, 'app');
const releasePublic = path.join(releaseDir, 'public');

const releaseTheme = path.join(releaseApp, 'Views', 'themes', 'madya');

const releaseBridge = path.join(releaseApp, 'Views', 'pages');

const releaseAssets = path.join(releasePublic, 'themes', 'madya', 'assets');

const releaseGenerated = path.join(releaseAssets, 'generated');

const themeSource = path.join(
    root,
    'src',
    'theme',
    'app',
    'Views',
    'themes',
    'madya',
);

const bridgeSource = path.join(root, 'src', 'theme', 'app', 'Views', 'pages');

const sourceAssets = path.join(themeSource, 'assets');

const heroSource = path.join(sourceAssets, 'generated', 'hero-image.jpg');

const buildAssets = path.join(root, 'dist-assets');

const output = path.join(
    releaseDir,
    `tema-madya-cms-sekolahku-v${version}.zip`,
);

/*
 * Validate the theme before creating the release.
 */
execFileSync(
    process.execPath,
    [path.join(root, 'scripts', 'validate-theme.js')],
    {
        cwd: root,
        stdio: 'inherit',
    },
);

/*
 * Build production CSS and JavaScript.
 *
 * Use the npm CLI currently running this script when available.
 * This avoids calling npm.cmd directly through execFileSync on Windows,
 * which can produce EINVAL.
 */
const npmCli = process.env.npm_execpath;

if (npmCli) {
    execFileSync(process.execPath, [npmCli, 'run', 'build'], {
        cwd: root,
        stdio: 'inherit',
    });
} else {
    execFileSync('npm', ['run', 'build'], {
        cwd: root,
        stdio: 'inherit',
        shell: platform() === 'win32',
    });
}

/*
 * Never package stale release files.
 *
 * release/ is ignored by Git.
 */
await rm(releaseDir, {
    recursive: true,
    force: true,
});

await mkdir(releaseTheme, {
    recursive: true,
});

await mkdir(releaseBridge, {
    recursive: true,
});

await mkdir(releaseAssets, {
    recursive: true,
});

/*
 * CMS application views.
 *
 * Repository source:
 * src/theme/app/Views/themes/madya
 *
 * Production package:
 * app/Views/themes/madya
 *
 * Theme assets are handled separately below because compiled assets
 * come from dist-assets and generated media has its own release contract.
 */
await cp(themeSource, releaseTheme, {
    recursive: true,
    filter: (source) => {
        return !source.split(path.sep).includes('assets');
    },
});

/*
 * CI4 public-view bridge.
 */
await cp(bridgeSource, releaseBridge, {
    recursive: true,
});

/*
 * Vite production output.
 *
 * dist-assets is a build directory, not the final CMS structure.
 */
const buildInfo = await stat(buildAssets).catch(() => null);

if (!buildInfo?.isDirectory()) {
    throw new Error(`Build output not found: ${buildAssets}`);
}

for (const file of ['app.css', 'app.js']) {
    const source = path.join(buildAssets, file);

    const info = await stat(source).catch(() => null);

    if (!info?.isFile()) {
        throw new Error(`Missing compiled asset: ${source}`);
    }

    await cp(source, path.join(releaseAssets, file));
}

/*
 * Copy canonical static theme assets.
 *
 * The generated directory is deliberately excluded here.
 */
for (const entry of await readdir(sourceAssets, {
    withFileTypes: true,
})) {
    if (entry.name === 'generated') {
        continue;
    }

    await cp(
        path.join(sourceAssets, entry.name),
        path.join(releaseAssets, entry.name),
        {
            recursive: true,
        },
    );
}

/*
 * Production generated-asset contract:
 * only hero-image.jpg is allowed.
 */
await mkdir(releaseGenerated, {
    recursive: true,
});

const heroInfo = await stat(heroSource).catch(() => null);

if (!heroInfo?.isFile()) {
    throw new Error(`Missing generated hero image: ${heroSource}`);
}

await cp(heroSource, path.join(releaseGenerated, 'hero-image.jpg'));

/*
 * Synchronize the release manifest version with package.json.
 *
 * The source theme.json itself is not modified.
 */
const themeJsonPath = path.join(releaseTheme, 'theme.json');

const themeJson = JSON.parse(await readFile(themeJsonPath, 'utf8'));

themeJson.version = version;

await writeFile(
    themeJsonPath,
    `${JSON.stringify(themeJson, null, 2)}\n`,
    'utf8',
);

/*
 * Validate the final CMS package structure.
 */
const requiredFiles = [
    path.join(releaseApp, 'Views', 'pages', 'home.php'),

    path.join(releaseApp, 'Views', 'pages', 'news.php'),

    path.join(releaseApp, 'Views', 'pages', 'single_post.php'),

    path.join(releaseApp, 'Views', 'pages', 'downloads.php'),

    path.join(releaseApp, 'Views', 'pages', 'contact.php'),

    path.join(releaseApp, 'Views', 'pages', 'page.php'),

    path.join(releaseTheme, 'theme.json'),

    path.join(releaseAssets, 'app.css'),

    path.join(releaseAssets, 'app.js'),

    path.join(releaseGenerated, 'hero-image.jpg'),
];

for (const file of requiredFiles) {
    const info = await stat(file).catch(() => null);

    if (!info?.isFile()) {
        throw new Error(`Release validation failed: ${file}`);
    }
}

/*
 * Ensure generated/ contains exactly the approved image.
 */
const generatedEntries = await readdir(releaseGenerated, {
    withFileTypes: true,
});

if (
    generatedEntries.length !== 1 ||
    generatedEntries[0].name !== 'hero-image.jpg' ||
    !generatedEntries[0].isFile()
) {
    throw new Error(
        `Generated asset contract failed: ${generatedEntries
            .map((entry) => entry.name)
            .join(', ')}`,
    );
}

/*
 * Create the ZIP.
 *
 * IMPORTANT:
 * The ZIP root must contain:
 *
 * app/
 * public/
 *
 * There must NOT be an additional "madya/" directory.
 *
 * Windows:
 *   PowerShell Compress-Archive
 *
 * Linux/macOS:
 *   zip
 */
if (platform() === 'win32') {
    const sourceApp = path.join(releaseDir, 'app');

    const sourcePublic = path.join(releaseDir, 'public');

    const escapedApp = sourceApp.replaceAll("'", "''");

    const escapedPublic = sourcePublic.replaceAll("'", "''");

    const escapedOutput = output.replaceAll("'", "''");

    const command =
        `$ErrorActionPreference = 'Stop'; ` +
        `$destination = '${escapedOutput}'; ` +
        `Compress-Archive ` +
        `-Path '${escapedApp}','${escapedPublic}' ` +
        `-DestinationPath $destination ` +
        `-Force`;

    execFileSync(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-Command', command],
        {
            cwd: releaseDir,
            stdio: 'inherit',
        },
    );
} else {
    execFileSync('zip', ['-qr', output, 'app', 'public'], {
        cwd: releaseDir,
        stdio: 'inherit',
    });
}

/*
 * Final archive validation.
 */
const archiveInfo = await stat(output).catch(() => null);

if (!archiveInfo?.isFile() || archiveInfo.size === 0) {
    throw new Error(`Release archive was not created: ${output}`);
}

console.log(`Release ready: ${path.relative(root, output)}`);
