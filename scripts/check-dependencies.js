import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const dependencies = ['vite', 'tailwindcss', '@tailwindcss/vite', 'three'];
const missing = dependencies.filter((name) => {
  try { require.resolve(name); return false; } catch { return true; }
});
if (missing.length) {
  console.error(`Missing npm dependencies: ${missing.join(', ')}`);
  console.error('Run: npm install');
  process.exit(1);
}
console.log('Dependencies: OK');
