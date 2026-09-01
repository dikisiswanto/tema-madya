import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(
    await readFile(path.join(root, 'package.json'), 'utf8'),
);

export const themeVersion = packageJson.version;
export default themeVersion;
