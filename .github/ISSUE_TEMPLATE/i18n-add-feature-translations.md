---
name: ✨ Add i18n Support for New Feature
about: Add internationalization support for a new feature or component
title: '[i18n] Add translations for [FEATURE_NAME]'
labels: ['i18n', 'feature', 'localization']
assignees: ''
---

## 📋 Feature Information

**Feature/Component Name:** <!-- e.g., User Profile Settings, Payment Gateway, Image Gallery -->
**Related PR/Issue:** <!-- Link to the feature implementation PR/issue -->
**Files Affected:** <!-- List of component files that need i18n -->

## 🎯 Objective

Add complete internationalization support for the new [FEATURE_NAME] feature across all supported languages.

## 📝 Translation Requirements

### New Translation Keys Needed:

<!-- List all the hardcoded text that needs to be internationalized -->

| Component/File | Hardcoded Text | Proposed Key | Context |
|---------------|----------------|--------------|---------|
| `ComponentName.vue` | "Save Changes" | `feature.saveChanges` | Button text |
| `ComponentName.vue` | "Are you sure?" | `feature.confirmAction` | Confirmation dialog |
| | | | |

### Supported Languages:
- [ ] English (`en.json`)
- [ ] Vietnamese (`vi.json`) 
- [ ] Chinese Simplified (`zh.json`)
- [ ] Japanese (`ja.json`)

## 🛠️ Implementation Steps

### Step 1: Identify Hardcoded Text
Scan the feature files for hardcoded text strings:

```bash
# Find hardcoded text in Vue components
grep -n "\"[A-Z]" app/components/[feature-path]/*.vue
grep -n "'[A-Z]" app/components/[feature-path]/*.vue

# Find hardcoded text in TypeScript files
grep -n "\"[A-Z]" app/[feature-path]/*.ts
```

### Step 2: Define Translation Keys
Create a consistent key structure for the feature:

```json
{
  "[featureName]": {
    "title": "Feature Title",
    "description": "Feature description",
    "actions": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete"
    },
    "messages": {
      "success": "Operation successful",
      "error": "Operation failed"
    },
    "labels": {
      "name": "Name",
      "email": "Email"
    }
  }
}
```

### Step 3: Update Component Files
Replace hardcoded text with i18n function calls:

**Before:**
```vue
<template>
  <UButton>Save Changes</UButton>
  <p>Are you sure you want to delete this item?</p>
</template>
```

**After:**
```vue
<template>
  <UButton>{{ $t('feature.saveChanges') }}</UButton>
  <p>{{ $t('feature.confirmDelete') }}</p>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
```

### Step 4: Add Translations to All Locale Files

**English (`i18n/locales/en.json`):**
```json
{
  "[featureName]": {
    "title": "Feature Title",
    "saveChanges": "Save Changes",
    "confirmDelete": "Are you sure you want to delete this item?"
  }
}
```

**Vietnamese (`i18n/locales/vi.json`):**
```json
{
  "[featureName]": {
    "title": "Tiêu đề tính năng",
    "saveChanges": "Lưu thay đổi", 
    "confirmDelete": "Bạn có chắc chắn muốn xóa mục này không?"
  }
}
```

**Chinese (`i18n/locales/zh.json`):**
```json
{
  "[featureName]": {
    "title": "功能标题",
    "saveChanges": "保存更改",
    "confirmDelete": "您确定要删除此项目吗？"
  }
}
```

**Japanese (`i18n/locales/ja.json`):**
```json
{
  "[featureName]": {
    "title": "機能タイトル",
    "saveChanges": "変更を保存",
    "confirmDelete": "このアイテムを削除してもよろしいですか？"
  }
}
```

## 🧪 Testing Checklist

### Functionality Testing:
- [ ] All text displays correctly in English
- [ ] All text displays correctly in Vietnamese
- [ ] All text displays correctly in Chinese
- [ ] All text displays correctly in Japanese
- [ ] Language switching works for the new feature
- [ ] No missing translation warnings in console

### UI/UX Testing:
- [ ] Text fits properly in all UI components
- [ ] Button text doesn't overflow
- [ ] Modal/dialog text is readable
- [ ] Form labels are properly aligned
- [ ] Responsive design works with different text lengths

### Edge Cases:
- [ ] Long translations don't break layout
- [ ] Special characters render correctly
- [ ] Pluralization works (if applicable)
- [ ] Dynamic content interpolation works

## 📋 Translation Guidelines

### 1. Key Naming Convention
```
[featureName].[section].[specificKey]

Examples:
- userProfile.settings.title
- paymentGateway.actions.processPayment
- imageGallery.messages.uploadSuccess
```

### 2. Text Categories
- **titles**: Page/section titles
- **labels**: Form labels, field names
- **actions**: Button text, action items
- **messages**: Success/error/info messages
- **descriptions**: Help text, explanations
- **placeholders**: Input placeholders

### 3. Translation Quality
- Keep translations concise for UI elements
- Maintain consistent terminology
- Consider cultural context
- Use appropriate formality level
- Test with native speakers when possible

## 🔧 Automation Tools

### Using translate-locale.config.js:
If you have the translation automation tool set up:

```bash
# Add new keys to English first, then run:
npm run translate:auto # (if script exists)
```

### Manual Translation Workflow:
1. Add English translations first
2. Use translation tools for initial drafts
3. Review and refine translations
4. Test in actual UI components
5. Get native speaker review

## 🔗 Related Files

### Component Files:
- List all component files that need i18n updates

### Locale Files:
- `i18n/locales/en.json`
- `i18n/locales/vi.json`
- `i18n/locales/zh.json`
- `i18n/locales/ja.json`

### Configuration:
- `i18n.config.ts`
- `nuxt.config.ts`

## 📋 Definition of Done

- [ ] All hardcoded text is replaced with i18n function calls
- [ ] Translation keys follow consistent naming convention
- [ ] All supported languages have complete translations
- [ ] UI displays correctly in all languages
- [ ] No console errors or missing translation warnings
- [ ] Responsive design works with all translations
- [ ] Code review completed
- [ ] Testing completed across all languages
- [ ] Documentation updated (if needed)

## 🚀 Additional Notes

<!-- Add any specific requirements, technical considerations, or context for this feature -->

### Special Considerations:
<!-- e.g., Dynamic content, complex pluralization, date/time formatting -->

### Dependencies:
<!-- Any dependencies on other features or external libraries -->
