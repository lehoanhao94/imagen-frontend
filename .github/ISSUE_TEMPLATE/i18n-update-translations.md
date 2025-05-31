---
name: 🔄 Update Existing Translations
about: Update or fix translations for existing languages
title: '[i18n] Update translations for [LANGUAGE_NAME] - [COMPONENT/FEATURE]'
labels: ['i18n', 'bug', 'enhancement', 'localization']
assignees: ''
---

## 📋 Translation Update Information

**Language(s) Affected:** <!-- e.g., Vietnamese (vi), Japanese (ja), Chinese (zh) -->
**Component/Feature:** <!-- e.g., Authentication, Buy Credits, Navigation -->
**Update Type:** <!-- Translation Fix, New Feature Translation, Content Update -->

## 🎯 Objective

Update translations for [LANGUAGE_NAME] to improve accuracy, add missing translations, or support new features.

## 📝 Current Issues

<!-- Describe the current translation issues -->
- [ ] Missing translations for new features
- [ ] Incorrect/outdated translations
- [ ] Inconsistent terminology
- [ ] UI text overflow issues
- [ ] Cultural adaptation needed

## 🔧 Translation Updates Needed

### Files to Update:
- [ ] `i18n/locales/[LANGUAGE_CODE].json`

### Specific Translations:

| Key | Current Translation | Proposed Translation | Reason |
|-----|-------------------|---------------------|---------|
| `example.key` | Current text | New text | Reason for change |
| | | | |
| | | | |

## 🛠️ Implementation Steps

### Step 1: Identify Translation Keys
```bash
# Find all translation keys in the codebase
grep -r "\$t(" app/ --include="*.vue" --include="*.ts" --include="*.js"
```

### Step 2: Update Locale Files
Update the relevant keys in `i18n/locales/[LANGUAGE_CODE].json`:

```json
{
  "section": {
    "key": "Updated translation",
    "anotherKey": "Another updated translation"
  }
}
```

### Step 3: Verify Consistency
Ensure consistent terminology across all translations:

```bash
# Check for consistency in key naming
node -e "
const en = require('./i18n/locales/en.json');
const target = require('./i18n/locales/[LANGUAGE_CODE].json');
console.log('Missing keys:', Object.keys(en).filter(k => !target[k]));
"
```

## 🧪 Testing Checklist

- [ ] All updated translations display correctly in UI
- [ ] Text fits properly in all UI components
- [ ] No missing translation warnings in console
- [ ] Terminology is consistent throughout the app
- [ ] Special characters render correctly
- [ ] Pluralization works correctly (if applicable)
- [ ] Date/time formatting is appropriate for locale
- [ ] Number formatting follows locale conventions

## 📋 Translation Guidelines

### 1. Consistency Rules
- Use the same translation for identical concepts
- Maintain consistent tone and style
- Follow established terminology conventions

### 2. UI Considerations
- Keep button text concise
- Consider text expansion in different languages
- Ensure readability on mobile devices

### 3. Cultural Adaptation
- Use appropriate formal/informal language levels
- Adapt content to cultural context
- Consider local conventions for dates, numbers, etc.

### 4. Technical Terms
- Maintain commonly accepted technical terms
- Provide explanations for complex concepts if needed
- Use standard industry terminology

## 🔍 Quality Assurance

### Before Submitting:
- [ ] Spell-check all translations
- [ ] Verify grammar and syntax
- [ ] Test on actual UI components
- [ ] Get native speaker review (if possible)
- [ ] Check for proper encoding of special characters

### Validation Commands:
```bash
# Validate JSON syntax
node -e "JSON.parse(require('fs').readFileSync('i18n/locales/[LANGUAGE_CODE].json', 'utf8'))"

# Check for missing keys compared to English
npm run i18n:check-missing # (if script exists)
```

## 🔗 Related Files

- `i18n/locales/[LANGUAGE_CODE].json` - Target locale file
- `i18n/locales/en.json` - Reference English translations
- Component files using the translations
- `translate-locale.config.js` - Translation automation config

## 📚 Reference Resources

### Translation Tools:
- [Google Translate](https://translate.google.com/) - For initial drafts
- [DeepL](https://www.deepl.com/) - For more accurate translations
- [Linguee](https://www.linguee.com/) - For context and examples

### Style Guides:
- [Language-specific style guides]
- [UI/UX translation best practices]
- [Cultural localization guidelines]

## 📋 Definition of Done

- [ ] All identified translation issues are resolved
- [ ] Updated translations are accurate and culturally appropriate
- [ ] UI displays correctly with updated translations
- [ ] No console errors or warnings
- [ ] Terminology is consistent across the application
- [ ] Native speaker review completed (if available)
- [ ] Testing completed on multiple devices
- [ ] Code review completed

## 🚀 Additional Context

<!-- Add any specific context, requirements, or notes for these translation updates -->

### Screenshots (if applicable):
<!-- Add screenshots showing current issues or expected results -->

### Related Issues:
<!-- Link to related issues or PRs -->
