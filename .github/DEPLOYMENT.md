# GitHub Pages Deployment Setup

This repository uses GitHub Actions to automatically deploy to GitHub Pages.

## Initial Setup Required

To enable GitHub Pages deployment, follow these steps:

### 1. Enable GitHub Pages
1. Go to repository **Settings** > **Pages**
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
3. Save the settings

### 2. Verify Configuration
- The `homepage` field in `package.json` should be: `https://cywf.github.io/willow`
- The workflow file `.github/workflows/deploy.yml` has the required permissions:
  - `contents: read`
  - `pages: write`
  - `id-token: write`

### 3. Trigger Deployment
Once GitHub Pages is enabled:
- Push changes to the `main` branch, or
- Manually trigger the workflow from Actions tab using "Run workflow"

## Troubleshooting

### 404 Error During Deployment
If you see "HttpError: Not Found" during deployment:
- Verify GitHub Pages is enabled in Settings > Pages
- Ensure the source is set to "GitHub Actions"
- Check that the workflow has necessary permissions

### Build Succeeds but Deployment Fails
- Confirm the `github-pages` environment exists
- Verify you have admin/write access to the repository
- Check that Pages is not disabled by organization policies

### Incorrect Asset Paths
If CSS/JS files return 404 after deployment:
- Verify `homepage` in `package.json` matches your GitHub Pages URL
- Rebuild the project: `npm run build`
- Check that build output references `/willow/` path prefix

## Manual Deployment

For manual deployment using gh-pages:
```bash
npm run build
npm run deploy
```

Note: This requires the `gh-pages` branch approach, which is different from the GitHub Actions deployment.
