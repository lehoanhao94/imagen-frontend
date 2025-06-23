## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

## Internationalization (i18n)

This project supports multiple languages with locale files located in `i18n/locales/`. The reference locale is `en.json`.

### Available Scripts

- **Check missing translations**: `npm run i18n:check`
  - Analyzes all locale files and reports missing keys compared to `en.json`
  - Shows completion percentage for each locale

- **Add missing keys automatically**: `npm run i18n:add-missing`
  - Automatically adds missing keys to locale files using English values as placeholders
  - Useful for ensuring all locale files have the same structure
  - Developers can later replace English placeholders with proper translations

- **Fix specific translations**: `npm run i18n:fix`
  - Uses predefined translation mappings to add specific translations
  - Requires manual translation definitions in the script

- **Validate i18n structure**: `npm run i18n:validate`
  - Validates the overall i18n structure and consistency

### Supported Languages

- English (`en.json`) - Reference locale
- Vietnamese (`vi.json`) - Default locale
- Chinese Simplified (`zh.json`)
- Japanese (`ja.json`)
- German (`de.json`)
- Spanish (`es.json`)
- French (`fr.json`)
- Portuguese (`pt.json`)

### Workflow

1. Add new keys to `en.json` (reference locale)
2. Run `npm run i18n:add-missing` to add placeholders to other locales
3. Replace English placeholders with proper translations
4. Run `npm run i18n:check` to verify completeness

<<<<<<< HEAD
## PR Previews

This repository includes automated PR preview deployments. When you create a pull request targeting the `develop` branch:

- 🚀 Automatic build and deployment to GitHub Pages
- 🔗 Unique preview URL for each PR (`/pr-{number}/`)
- 💬 Automatic PR comment with preview link
- 🧹 Auto-cleanup when PR is closed

See [`docs/PR_PREVIEW_SETUP.md`](docs/PR_PREVIEW_SETUP.md) for setup instructions.

=======
>>>>>>> main
