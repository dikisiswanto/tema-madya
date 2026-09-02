import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const packageJson = JSON.parse(
    await readFile(path.join(root, 'package.json'), 'utf8'),
);
const packageVersion = packageJson.version;

const lockJson = JSON.parse(
    await readFile(path.join(root, 'package-lock.json'), 'utf8'),
);
const lockVersion = lockJson.version;
const lockRootVersion = lockJson.packages?.['']?.version;

const themeJson = JSON.parse(
    await readFile(
        path.join(
            root,
            'src',
            'theme',
            'app',
            'Views',
            'themes',
            'madya',
            'theme.json',
        ),
        'utf8',
    ),
);
const themeVersion = themeJson.version;

const versionView = await readFile(
    path.join(
        root,
        'src',
        'theme',
        'app',
        'Views',
        'themes',
        'madya',
        'partials',
        'theme-version.php',
    ),
    'utf8',
);
const viewMatch = versionView.match(/esc\(['"]([^'"]+)['"]\)/);
const viewVersion = viewMatch?.[1];

const values = {
    'package.json': packageVersion,
    'package-lock.json': lockVersion,
    'package-lock root': lockRootVersion,
    'theme.json': themeVersion,
    'theme-version.php': viewVersion,
};

const mismatches = Object.entries(values).filter(
    ([, value]) => value !== packageVersion,
);

if (mismatches.length) {
    console.error('Version consistency: FAILED');
    for (const [name, value] of Object.entries(values)) {
        console.error(`${name}: ${value ?? '<missing>'}`);
    }
    process.exit(1);
}

console.log(`Version consistency: OK (${packageVersion})`);
