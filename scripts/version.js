import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

if (args.length !== 1 || !['patch', 'minor', 'major'].includes(args[0])) {
    throw new Error('Usage: node scripts/version.js <patch|minor|major>');
}

function git(...args) {
    return execFileSync('git', args, {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
}

function runGit(...args) {
    execFileSync('git', args, {
        cwd: root,
        stdio: 'inherit',
    });
}

const status = git('status', '--porcelain');
if (status) {
    throw new Error(
        'Working tree is not clean. Commit or stash existing changes before versioning.',
    );
}

const packagePath = path.join(root, 'package.json');
const oldVersion = JSON.parse(await readFile(packagePath, 'utf8')).version;
let newVersion;
let tag;
let commitCreated = false;
let tagCreated = false;

try {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    execFileSync(
        npm,
        ['version', args[0], '--no-git-tag-version', '--ignore-scripts'],
        {
            cwd: root,
            stdio: 'inherit',
        },
    );

    newVersion = JSON.parse(await readFile(packagePath, 'utf8')).version;
    tag = `v${newVersion}`;

    let tagExists = false;
    try {
        execFileSync('git', ['rev-parse', '--verify', `refs/tags/${tag}`], {
            cwd: root,
            stdio: 'ignore',
        });
        tagExists = true;
    } catch {}

    if (tagExists) {
        throw new Error(`Git tag already exists: ${tag}`);
    }
} catch (error) {
    // npm exits non-zero, or the target tag already exists.
    // Restore the pre-versioning working tree.
    try {
        runGit('reset', '--hard', 'HEAD');
    } catch {}
    throw error;
}

try {
    execFileSync(
        process.platform === 'win32' ? 'npm.cmd' : 'npm',
        ['run', 'sync:version', '--ignore-scripts'],
        { cwd: root, stdio: 'inherit' },
    );

    execFileSync(
        process.platform === 'win32' ? 'npm.cmd' : 'npm',
        ['run', 'check:version', '--ignore-scripts'],
        { cwd: root, stdio: 'inherit' },
    );

    runGit(
        'add',
        'package.json',
        'package-lock.json',
        'src/theme/app/Views/themes/madya/theme.json',
        'src/theme/app/Views/themes/madya/partials/theme-version.php',
    );

    runGit('commit', '-m', `chore: release ${tag}`);
    commitCreated = true;

    runGit('tag', '-a', tag, '-m', `Release ${tag}`);
    tagCreated = true;

    console.log(`Versioned ${oldVersion} → ${newVersion}`);
    console.log(`Created commit and tag ${tag}`);
    console.log('Next: git push --follow-tags');
} catch (error) {
    // If a tag was created before a later failure, never leave it behind.
    if (tagCreated) {
        try {
            execFileSync('git', ['rev-parse', '--verify', `refs/tags/${tag}`], {
                cwd: root,
                stdio: 'ignore',
            });
            runGit('tag', '-d', tag);
        } catch {}
    }

    // If our commit was created, remove it. Otherwise discard the version bump.
    try {
        if (commitCreated) {
            runGit('reset', '--hard', 'HEAD~1');
        } else {
            runGit('reset', '--hard', 'HEAD');
        }
    } catch {}

    throw error;
}
