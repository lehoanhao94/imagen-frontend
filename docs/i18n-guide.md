# 🌍 Internationalization (i18n) Guide

This guide provides comprehensive instructions for working with internationalization in the Imagen Frontend project.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Setup](#project-setup)
3. [Adding New Languages](#adding-new-languages)
4. [Translation Workflow](#translation-workflow)
5. [Best Practices](#best-practices)
6. [Automation Tools](#automation-tools)
7. [Troubleshooting](#troubleshooting)

## 🎯 Overview

Our project uses **Nuxt i18n** module for internationalization with the following supported languages:

- **English (en)** - Primary/Reference language
- **Vietnamese (vi)** - Default language
- **Chinese Simplified (zh_cn)** - Mapped to `zh.json`
- **Japanese (ja)** - Full support

### Current Configuration

```typescript
// nuxt.config.ts
i18n: {
  defaultLocale: 'vi',
  locales: [
    { code: 'en', name: 'English', file: 'en.json' },
    { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' },
    { code: 'zh_cn', name: '简体中文', file: 'zh.json' },
    { code: 'ja', name: '日本語', file: 'ja.json' }
  ],
  strategy: 'no_prefix'
}
```

## 🛠️ Project Setup

### File Structure
```
i18n/
├── locales/
│   ├── en.json     # English (reference)
│   ├── vi.json     # Vietnamese (default)
│   ├── zh.json     # Chinese Simplified
│   └── ja.json     # Japanese
└── i18n.config.ts  # i18n configuration
```

### Key Configuration Files

1. **`i18n.config.ts`** - Main i18n configuration
2. **`nuxt.config.ts`** - Nuxt module configuration
3. **`translate-locale.config.js`** - Translation automation config
4. **`app/stores/app.ts`** - Locale state management

## 🌐 Adding New Languages

### Step 1: Update Configuration

Add the new language to `nuxt.config.ts`:

```typescript
i18n: {
  locales: [
    // ... existing locales
    { code: 'fr', name: 'Français', file: 'fr.json' }
  ]
}
```

### Step 2: Create Locale File

Create `i18n/locales/fr.json` using English as reference:

```json
{
  "system": "Générateur d'images IA",
  "helloWorld": "Bonjour le monde !",
  "nav": {
    "aitool": "Outil IA",
    "library": "Bibliothèque",
    "api": "API",
    "login": "Connexion"
  }
}
```

### Step 3: Update i18n Configuration

Add import to `i18n.config.ts`:

```typescript
import fr from './i18n/locales/fr.json'

export default defineI18nConfig(() => ({
  messages: {
    en, zh, ja, vi, fr // Add new locale
  }
}))
```

### Step 4: Update UI Components

Add to locale selector in `AppFooter.vue`:

```vue
<script setup lang="ts">
import { en, vi, ja, zh_cn, fr } from '@nuxt/ui/locale'

<ULocaleSelect
  :locales="[en, ja, vi, zh_cn, fr]"
/>
```

## 🔄 Translation Workflow

### 1. Using Translation Functions

**In Vue Templates:**
```vue
<template>
  <h1>{{ $t('page.title') }}</h1>
  <p>{{ $t('page.description') }}</p>
  <UButton>{{ $t('actions.save') }}</UButton>
</template>
```

**In Script Setup:**
```vue
<script setup lang="ts">
const { t } = useI18n()

const message = computed(() => t('welcome.message'))
</script>
```

### 2. Key Naming Convention

Use nested structure with descriptive keys:

```json
{
  "nav": {
    "aitool": "AI Tool",
    "library": "Library"
  },
  "auth": {
    "login": "Login",
    "signup": "Sign Up",
    "validation": {
      "required": "This field is required",
      "invalidEmail": "Invalid email format"
    }
  },
  "buyCredits": {
    "checkout": "Checkout",
    "orderDetail": "Order detail",
    "actions": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  }
}
```

### 3. Dynamic Content

**With Variables:**
```vue
<template>
  <p>{{ $t('welcome.user', { name: user.name }) }}</p>
</template>
```

```json
{
  "welcome": {
    "user": "Welcome, {name}!"
  }
}
```

**With Pluralization:**
```vue
<template>
  <p>{{ $t('items.count', { count: items.length }, items.length) }}</p>
</template>
```

```json
{
  "items": {
    "count": "No items | {count} item | {count} items"
  }
}
```

## 📋 Best Practices

### 1. Translation Quality

- **Consistency**: Use the same translation for identical concepts
- **Context**: Consider the UI context when translating
- **Conciseness**: Keep button and label text short
- **Cultural Adaptation**: Adapt content to local cultural norms

### 2. Key Management

- **Descriptive Names**: Use clear, descriptive key names
- **Logical Grouping**: Group related translations together
- **Avoid Duplication**: Reuse translations where appropriate
- **Consistent Structure**: Maintain the same structure across all locales

### 3. Development Workflow

1. **English First**: Always add English translations first
2. **Test Early**: Test translations in actual UI components
3. **Review Process**: Have native speakers review translations
4. **Incremental Updates**: Update translations incrementally

## 🤖 Automation Tools

### Translation Validation Script

Create `scripts/i18n-check.js`:

```javascript
const fs = require('fs');
const path = require('path');

function checkMissingTranslations() {
  const reference = JSON.parse(fs.readFileSync('./i18n/locales/en.json', 'utf8'));
  const locales = ['vi.json', 'zh.json', 'ja.json'];
  
  locales.forEach(locale => {
    const translations = JSON.parse(fs.readFileSync(`./i18n/locales/${locale}`, 'utf8'));
    // Compare and report missing keys
  });
}

checkMissingTranslations();
```

### NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "i18n:check": "node scripts/i18n-check.js",
    "i18n:validate": "node scripts/i18n-validate.js",
    "i18n:usage": "node scripts/i18n-usage.js"
  }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Missing Translation Warnings**
   ```
   [vue-i18n] Not found 'key.name' key in 'vi' locale messages.
   ```
   **Solution**: Add the missing key to the locale file

2. **JSON Syntax Errors**
   ```
   SyntaxError: Unexpected token in JSON
   ```
   **Solution**: Validate JSON syntax using online tools or IDE

3. **Text Overflow in UI**
   **Solution**: Adjust CSS or shorten translations

4. **Locale Not Switching**
   **Solution**: Check locale code mapping in configuration

### Debugging Tips

1. **Check Console**: Look for i18n warnings in browser console
2. **Validate JSON**: Use `node -e "JSON.parse(require('fs').readFileSync('file.json'))"`
3. **Test Switching**: Manually test locale switching functionality
4. **Compare Files**: Ensure all locale files have the same structure

## 📚 Resources

### Translation Tools
- [Google Translate](https://translate.google.com/) - Quick translations
- [DeepL](https://www.deepl.com/) - High-quality translations
- [Linguee](https://www.linguee.com/) - Context and examples

### Documentation
- [Nuxt i18n Module](https://nuxt.com/modules/i18n)
- [Vue i18n](https://vue-i18n.intlify.dev/)
- [Unicode CLDR](http://cldr.unicode.org/) - Locale data

### Style Guides
- [Google Developer Style Guide](https://developers.google.com/style)
- [Microsoft Style Guides](https://docs.microsoft.com/en-us/style-guide/)

## 🎯 Quick Reference

### Common Translation Patterns

```vue
<!-- Basic translation -->
{{ $t('key') }}

<!-- With variables -->
{{ $t('key', { variable: value }) }}

<!-- With pluralization -->
{{ $t('key', { count }, count) }}

<!-- In script -->
const { t } = useI18n()
const text = t('key')
```

### File Locations
- Locale files: `i18n/locales/*.json`
- Configuration: `i18n.config.ts`, `nuxt.config.ts`
- Components: `app/components/**/*.vue`
- Scripts: `scripts/i18n-*.js`
