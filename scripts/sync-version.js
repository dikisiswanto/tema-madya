import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packagePath = path.join(root, 'package.json');
const themePath = path.join(
    root,
    'src',
    'theme',
    'app',
    'Views',
    'themes',
    'madya',
    'theme.json',
);
const versionViewPath = path.join(
    root,
    'src',
    'theme',
    'app',
    'Views',
    'themes',
    'madya',
    'partials',
    'theme-version.php',
);

const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
const version = packageJson.version;

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`Invalid package version: ${version}`);
}

const themeJson = JSON.parse(await readFile(themePath, 'utf8'));
themeJson.version = version;
await writeFile(themePath, `${JSON.stringify(themeJson, null, 2)}\n`, 'utf8');

await mkdir(path.dirname(versionViewPath), { recursive: true });
await writeFile(versionViewPath, `<?= esc('${version}') ?>\n`, 'utf8');

console.log(`Version synchronized: ${version}`);
