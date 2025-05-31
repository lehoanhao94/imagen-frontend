---
name: 🌍 Add New Language Support
about: Add internationalization support for a new language
title: '[i18n] Add support for [LANGUAGE_NAME] ([LANGUAGE_CODE])'
labels: ['i18n', 'enhancement', 'localization']
assignees: ''
---

## 📋 Language Information

**Language Name:** <!-- e.g., Français, Español, Deutsch -->
**Language Code:** <!-- e.g., fr, es, de -->
**Region Code (if applicable):** <!-- e.g., fr_CA, es_MX, de_AT -->

## 🎯 Objective

Add complete internationalization support for [LANGUAGE_NAME] to make the application accessible to [LANGUAGE_NAME] speakers.

## 📝 Tasks Checklist

### 1. Locale Configuration
- [ ] Add language entry to `nuxt.config.ts` in the `i18n.locales` array
- [ ] Update `i18n.config.ts` to import the new locale file
- [ ] Add language option to `translate-locale.config.js`

### 2. Locale File Creation
- [ ] Create new locale file: `i18n/locales/[LANGUAGE_CODE].json`
- [ ] Copy structure from `i18n/locales/en.json` as base template
- [ ] Translate all text strings to [LANGUAGE_NAME]

### 3. UI Components Update
- [ ] Add language option to `AppFooter.vue` locale selector
- [ ] Update `app/stores/app.ts` if needed for locale handling
- [ ] Test locale switching functionality

### 4. Font Support (if needed)
- [ ] Add appropriate fonts for [LANGUAGE_NAME] if special characters are required
- [ ] Update CSS for font-family support

## 🔧 Implementation Guidelines

### Step 1: Update Nuxt Configuration

Add the new language to `nuxt.config.ts`:

```typescript
i18n: {
  defaultLocale: 'vi',
  locales: [
    { code: 'en', name: 'English', file: 'en.json' },
    { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' },
    { code: 'zh_cn', name: '简体中文', file: 'zh.json' },
    { code: 'ja', name: '日本語', file: 'ja.json' },
    { code: '[LANGUAGE_CODE]', name: '[LANGUAGE_NAME]', file: '[LANGUAGE_CODE].json' } // Add this line
  ],
  strategy: 'no_prefix'
}
```

### Step 2: Update i18n Configuration

Add import to `i18n.config.ts`:

```typescript
import [LANGUAGE_CODE] from './i18n/locales/[LANGUAGE_CODE].json'

export default defineI18nConfig(() => ({
  // ... existing config
  messages: {
    en,
    zh,
    ja,
    vi,
    [LANGUAGE_CODE] // Add this line
  }
}))
```

### Step 3: Create Locale File

Create `i18n/locales/[LANGUAGE_CODE].json` with the following structure:

```json
{
  "system": "[Translated: AI Image Generator]",
  "helloWorld": "[Translated: Hello World!]",
  "appTitle": "[Translated: AI Image Creation]",
  "copyright": "[Translated: Copyright © {year}, AI Image Creation]",
  "nav": {
    "aitool": "[Translated: AI Tool]",
    "library": "[Translated: Library]",
    "api": "[Translated: API]",
    "login": "[Translated: Login]"
  },
  "auth": {
    "login": "[Translated: Login]",
    "loginDescription": "[Translated: Login to your account to continue]",
    "email": "[Translated: Email]",
    // ... continue with all auth translations
  },
  "buyCredits": {
    "checkout": "[Translated: Checkout]",
    "checkoutDescription": "[Translated: Confirm your order then choose your payment method.]",
    "orderDetail": "[Translated: Order detail]",
    // ... continue with all buyCredits translations
  }
  // ... continue with all other sections
}
```

### Step 4: Update UI Components

Add the new locale to `AppFooter.vue`:

```vue
<script setup lang="ts">
import { en, vi, ja, zh_cn, [LANGUAGE_CODE] } from '@nuxt/ui/locale' // Add import

// ... existing code

<ULocaleSelect
  v-model="i18nLocale"
  :locales="[en, ja, vi, zh_cn, [LANGUAGE_CODE]]" // Add to array
  variant="ghost"
  size="xs"
/>
```

## 🧪 Testing Checklist

- [ ] Language appears in footer locale selector
- [ ] All UI text displays correctly in the new language
- [ ] No missing translation keys (check browser console)
- [ ] Text fits properly in UI components
- [ ] Special characters render correctly
- [ ] Locale persistence works (refresh page maintains language)
- [ ] Navigation links are translated
- [ ] Form validation messages are translated
- [ ] Error messages are translated

## 📚 Translation Guidelines

1. **Consistency**: Use consistent terminology throughout the application
2. **Context**: Consider the context of each text string
3. **UI Constraints**: Keep translations concise to fit UI components
4. **Cultural Adaptation**: Adapt content to local cultural norms when appropriate
5. **Technical Terms**: Maintain technical terms that are commonly used in [LANGUAGE_NAME]

## 🔗 Related Files

- `nuxt.config.ts` - Main Nuxt configuration
- `i18n.config.ts` - i18n module configuration  
- `i18n/locales/[LANGUAGE_CODE].json` - New locale file
- `app/components/AppFooter.vue` - Locale selector component
- `translate-locale.config.js` - Translation automation config

## 📋 Definition of Done

- [ ] New language is fully integrated into the application
- [ ] All existing text is translated to the new language
- [ ] UI components display correctly with the new language
- [ ] Language switching works seamlessly
- [ ] No console errors related to missing translations
- [ ] Documentation is updated if necessary
- [ ] Code review completed
- [ ] Testing completed on different devices/browsers

## 🚀 Additional Notes

<!-- Add any specific requirements, cultural considerations, or technical notes for this language -->
