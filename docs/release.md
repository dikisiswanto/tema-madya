# Release Workflow

Current version: `0.9.0`

## Local

1. Patch:
   `npm run version:patch`
2. Test:
   `npm test`
3. Release:
   `npm run release`

The release script reads the version only from `package.json`, cleans staging,
copies `app/` and `public/`, retains only compiled `app.css`/`app.js` plus
`generated/hero-image.jpg`, writes `VERSION`, validates the staging contract,
and produces:

`tema-madya-cms-sekolahku-v<version>.zip`

## GitHub

`npm version patch` creates the corresponding Git tag (`v<version>`).
Push it with:

`git push --follow-tags`

GitHub Actions runs only for `v*.*.*` tags. It then verifies:

`Git tag == v + package.json.version`

If they differ, the release fails.

If they match, Actions runs `npm test`, runs `npm run release`, verifies the
versioned ZIP, and publishes that ZIP as the GitHub Release asset.
