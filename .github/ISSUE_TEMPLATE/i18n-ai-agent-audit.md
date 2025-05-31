---
name: 🤖 AI Agent i18n Audit
about: AI Agent systematic audit to replace hardcoded text with i18n syntax
title: '[i18n] AI Agent audit - Replace hardcoded text in [COMPONENT/DIRECTORY]'
labels: ['i18n', 'ai-agent', 'automation', 'audit']
assignees: ''
---

## 🎯 AI Agent Task

Systematically scan and replace all hardcoded text with i18n syntax in the specified component/directory.

## 📋 Scope

**Target:** <!-- e.g., app/components/ai-tool/, app/pages/auth/, entire codebase -->
**Priority:** <!-- High/Medium/Low -->

## 🔍 AI Agent Instructions

### 1. Scan for Hardcoded Text
Search for hardcoded strings in:
- Vue template literals: `"Text"`, `'Text'`
- Button labels, form labels, error messages
- Static text in components
- Alert/notification messages

### 2. Replacement Pattern
**Before:**
```vue
<UButton>Save Changes</UButton>
<p>Welcome to our platform</p>
```

**After:**
```vue
<UButton>{{ $t('actions.save') }}</UButton>
<p>{{ $t('welcome.message') }}</p>
```

### 3. Key Naming Convention
```
[section].[category].[specific]

Examples:
- actions.save, actions.cancel, actions.delete
- validation.required, validation.invalidEmail
- messages.success, messages.error
- labels.name, labels.email, labels.password
```

### 4. Update Locale Files
Add translations to all locale files:
- `i18n/locales/en.json` (reference)
- `i18n/locales/vi.json`
- `i18n/locales/zh.json`
- `i18n/locales/ja.json`

## 📝 AI Agent Checklist

### Phase 1: Detection
- [ ] Scan all `.vue` files in target scope
- [ ] Scan all `.ts` files in target scope
- [ ] Identify hardcoded text patterns
- [ ] Generate list of text to be replaced

### Phase 2: Key Generation
- [ ] Create logical key structure
- [ ] Ensure no duplicate keys
- [ ] Follow naming conventions
- [ ] Group related translations

### Phase 3: Component Updates
- [ ] Replace hardcoded text with `$t()` calls
- [ ] Add `useI18n()` where needed
- [ ] Test component functionality
- [ ] Verify no broken references

### Phase 4: Locale Updates
- [ ] Add English translations (reference)
- [ ] Add Vietnamese translations
- [ ] Add Chinese translations
- [ ] Add Japanese translations
- [ ] Validate JSON syntax

### Phase 5: Validation
- [ ] No console i18n warnings
- [ ] All text displays correctly
- [ ] Language switching works
- [ ] UI layout not broken

## 🛠️ AI Agent Commands

### Scan Command
```bash
# Find hardcoded text patterns
grep -r "\"[A-Z]" app/components/ --include="*.vue"
grep -r "'[A-Z]" app/components/ --include="*.vue"
```

### Validation Command
```bash
# Check for missing translations
node -e "
const en = require('./i18n/locales/en.json');
const vi = require('./i18n/locales/vi.json');
console.log('Keys check:', Object.keys(en).length === Object.keys(vi).length);
"
```

## 📋 Expected Output

### Summary Report
- Total hardcoded strings found: `[NUMBER]`
- Total keys created: `[NUMBER]`
- Files modified: `[LIST]`
- Locale files updated: `[LIST]`

### Translation Keys Added
```json
{
  "newSection": {
    "title": "Section Title",
    "actions": {
      "save": "Save",
      "cancel": "Cancel"
    }
  }
}
```

## ✅ Definition of Done

- [ ] All hardcoded text replaced with i18n syntax
- [ ] All locale files updated with translations
- [ ] No console warnings or errors
- [ ] UI functionality preserved
- [ ] Language switching works correctly
- [ ] Code follows project i18n conventions

## 🚀 AI Agent Notes

- Focus on user-facing text only
- Preserve technical strings (APIs, configs)
- Maintain existing key structure
- Test thoroughly after changes
- Use existing translation patterns where possible
