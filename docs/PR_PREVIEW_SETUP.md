# PR Preview Setup Guide

This guide explains how to set up the CI/CD system for pull request previews.

## Overview

The CI/CD system automatically builds and deploys each pull request targeting the `develop` branch to GitHub Pages, creating unique preview URLs for verification before merging.

## Features

- **Automatic Build**: Each PR is built using `pnpm run generate`
- **Unique URLs**: Each PR gets its own preview URL (e.g., `https://username.github.io/imagen-frontend/pr-123/`)
- **PR Comments**: Automatic comments on PRs with preview URLs
- **Cleanup**: Preview deployments are removed when PRs are closed
- **Incremental Updates**: Previews update automatically when new commits are pushed

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"

### 2. Add Required Secrets

Add the following secrets in your repository settings (Settings → Secrets and variables → Actions):

- `NUXT_UI_PRO_LICENSE`: Your @nuxt/ui-pro license key (required for production builds)

To get a @nuxt/ui-pro license:
1. Visit https://ui.nuxt.com/pro/pricing
2. Purchase a license
3. Add the license key to GitHub secrets

### 3. Workflows

Two workflows are included:

#### `pr-preview.yml`
- Triggers on PR open/sync to `develop` branch
- Builds the project and deploys to GitHub Pages
- Comments on PR with preview URL

#### `pr-cleanup.yml`
- Triggers when PRs are closed
- Removes the preview deployment
- Keeps other PR previews intact

## How It Works

1. **PR Created/Updated**: When a PR is opened or updated targeting `develop`:
   - Workflow checks out the PR code
   - Installs dependencies with pnpm
   - Builds the static site using `pnpm run generate`
   - Deploys to GitHub Pages under `/pr-{number}/`
   - Comments on PR with preview URL

2. **PR Closed**: When a PR is closed:
   - Cleanup workflow removes the specific PR directory
   - Other PR previews remain active

## URL Structure

- Main site: `https://username.github.io/imagen-frontend/`
- PR previews: `https://username.github.io/imagen-frontend/pr-{number}/`

## Troubleshooting

### Build Failures

1. **Missing License**: Ensure `NUXT_UI_PRO_LICENSE` secret is set
2. **Network Issues**: Font provider failures are warnings and don't stop the build
3. **Dependencies**: Make sure `pnpm-lock.yaml` is up to date

### Deployment Issues

1. **GitHub Pages**: Ensure Pages is enabled with "GitHub Actions" source
2. **Permissions**: Workflows have correct permissions for deployment
3. **Branch Protection**: Ensure workflows can run on PRs

## Manual Testing

To test the build locally:

```bash
# Install dependencies
pnpm install

# Build for production
NUXT_UI_PRO_LICENSE=your_license_key pnpm run generate

# Preview built files
pnpm run preview
```

## Security

- Workflows use minimal required permissions
- Secrets are only accessible to workflows, not exposed in logs
- PR previews use read-only deployment to GitHub Pages