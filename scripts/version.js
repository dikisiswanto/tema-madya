import { readFile, writeFile } from 'node:fs/promises';
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

function runNode(script, ...args) {
    execFileSync(process.execPath, [script, ...args], {
        cwd: root,
        stdio: 'inherit',
    });
}

function bumpVersion(version, type) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/);
    if (!match) {
        throw new Error(`Invalid package version: ${version}`);
    }

    let major = Number(match[1]);
    let minor = Number(match[2]);
    let patch = Number(match[3]);

    if (type === 'major') {
        major += 1;
        minor = 0;
        patch = 0;
    } else if (type === 'minor') {
        minor += 1;
        patch = 0;
    } else {
        patch += 1;
    }

    return `${major}.${minor}.${patch}`;
}

const status = git('status', '--porcelain');
if (status) {
    throw new Error(
        'Working tree is not clean. Commit or stash existing changes before versioning.',
    );
}

const packagePath = path.join(root, 'package.json');
const lockPath = path.join(root, 'package-lock.json');

const originalPackage = await readFile(packagePath, 'utf8');
const originalLock = await readFile(lockPath, 'utf8');
const oldVersion = JSON.parse(originalPackage).version;
const newVersion = bumpVersion(oldVersion, args[0]);
const tag = `v${newVersion}`;

let commitCreated = false;
let tagCreated = false;

try {
    // Fail before changing anything if the target tag already exists.
    try {
        execFileSync('git', ['rev-parse', '--verify', `refs/tags/${tag}`], {
            cwd: root,
            stdio: 'ignore',
        });
        throw new Error(`Git tag already exists: ${tag}`);
    } catch (error) {
        if (error?.message === `Git tag already exists: ${tag}`) {
            throw error;
        }
        // rev-parse exits non-zero: the tag does not exist.
    }

    // Do the version bump directly instead of spawning npm/npm.cmd.
    // This avoids Windows EINVAL from npm.cmd and gives us identical
    // behavior on Windows, Linux, and macOS.
    const packageJson = JSON.parse(originalPackage);
    packageJson.version = newVersion;
    await writeFile(
        packagePath,
        `${JSON.stringify(packageJson, null, 4)}\n`,
        'utf8',
    );

    const lockJson = JSON.parse(originalLock);
    lockJson.version = newVersion;
    if (lockJson.packages?.['']) {
        lockJson.packages[''].version = newVersion;
    }
    await writeFile(lockPath, `${JSON.stringify(lockJson, null, 2)}\n`, 'utf8');

    // package.json is now the source of truth; this syncs every generated
    // theme-version artifact from it.
    runNode('scripts/sync-version.js');
    runNode('scripts/check-version.js');

    runGit(
        'add',
        'package.json',
        'package-lock.json',
        'src/theme/app/Views/themes/madya/theme.json',
        'src/theme/app/Views/themes/madya/partials/theme-version.php',
    );

    runGit('commit', '-m', `chore: release ${tag}`);
    commitCreated = true;

    // Annotated tag: git push --follow-tags will publish it.
    runGit('tag', '-a', tag, '-m', `Release ${tag}`);
    tagCreated = true;

    console.log(`Versioned ${oldVersion} → ${newVersion}`);
    console.log(`Created commit and tag ${tag}`);
    console.log('Next: git push --follow-tags');
} catch (error) {
    // Only delete the tag created by this invocation.
    if (tagCreated) {
        try {
            runGit('tag', '-d', tag);
        } catch {}
    }

    // Restore the exact pre-versioning state. The working tree was required
    // to be clean before starting, so this cannot discard unrelated work.
    try {
        if (commitCreated) {
            runGit('reset', '--hard', 'HEAD~1');
        } else {
            await writeFile(packagePath, originalPackage, 'utf8');
            await writeFile(lockPath, originalLock, 'utf8');
            runGit('reset', '--hard', 'HEAD');
        }
    } catch (rollbackError) {
        console.error('Version rollback failed:', rollbackError);
    }

    throw error;
}
