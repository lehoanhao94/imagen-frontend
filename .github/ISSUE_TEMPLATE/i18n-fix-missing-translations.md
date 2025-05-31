---
name: 🔧 Fix Missing Translations
about: Fix missing or incomplete translations across languages
title: '[i18n] Fix missing translations - [AFFECTED_LANGUAGES]'
labels: ['i18n', 'bug', 'localization']
assignees: ''
---

## 📋 Issue Information

**Affected Languages:** <!-- e.g., Vietnamese, Japanese, Chinese -->
**Missing Translation Count:** <!-- Approximate number of missing keys -->
**Severity:** <!-- High/Medium/Low based on user impact -->

## 🎯 Objective

Identify and fix all missing translations to ensure complete internationalization coverage across all supported languages.

## 🔍 Missing Translations Analysis

### Detection Method:
- [ ] Manual review of locale files
- [ ] Console warnings during development
- [ ] User reports
- [ ] Automated translation key comparison

### Missing Translation Categories:
- [ ] Navigation elements
- [ ] Form labels and validation messages
- [ ] Button text and actions
- [ ] Error and success messages
- [ ] Help text and descriptions
- [ ] Modal and dialog content

## 📊 Translation Gap Analysis

### English (en.json) - Reference: ✅ Complete
**Total Keys:** [COUNT]

### Vietnamese (vi.json):
- **Missing Keys:** [COUNT]
- **Completion:** [PERCENTAGE]%

### Chinese (zh.json):
- **Missing Keys:** [COUNT] 
- **Completion:** [PERCENTAGE]%

### Japanese (ja.json):
- **Missing Keys:** [COUNT]
- **Completion:** [PERCENTAGE]%

## 🛠️ Implementation Steps

### Step 1: Generate Missing Keys Report

Create a script to compare locale files:

```javascript
// scripts/check-missing-translations.js
const fs = require('fs');
const path = require('path');

const localesDir = './i18n/locales';
const referenceLocale = 'en.json';

function flattenObject(obj, prefix = '') {
  const flattened = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key], `${prefix}${key}.`));
    } else {
      flattened[`${prefix}${key}`] = obj[key];
    }
  }
  return flattened;
}

function checkMissingTranslations() {
  const reference = JSON.parse(fs.readFileSync(path.join(localesDir, referenceLocale), 'utf8'));
  const referenceKeys = Object.keys(flattenObject(reference));
  
  const localeFiles = fs.readdirSync(localesDir).filter(file => 
    file.endsWith('.json') && file !== referenceLocale
  );
  
  localeFiles.forEach(file => {
    const locale = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
    const localeKeys = Object.keys(flattenObject(locale));
    const missingKeys = referenceKeys.filter(key => !localeKeys.includes(key));
    
    console.log(`\n${file}:`);
    console.log(`Missing ${missingKeys.length} keys:`);
    missingKeys.forEach(key => console.log(`  - ${key}`));
  });
}

checkMissingTranslations();
```

### Step 2: Identify Missing Keys

Run the analysis script:
```bash
node scripts/check-missing-translations.js
```

### Step 3: Add Missing Translations

For each missing key, add the appropriate translation:

**Example missing keys:**
```json
// Missing in vi.json
{
  "newFeature": {
    "title": "Tính năng mới",
    "description": "Mô tả tính năng mới"
  },
  "validation": {
    "required": "Trường này là bắt buộc"
  }
}

// Missing in zh.json  
{
  "newFeature": {
    "title": "新功能",
    "description": "新功能描述"
  },
  "validation": {
    "required": "此字段为必填项"
  }
}

// Missing in ja.json
{
  "newFeature": {
    "title": "新機能", 
    "description": "新機能の説明"
  },
  "validation": {
    "required": "この項目は必須です"
  }
}
```

### Step 4: Validate JSON Structure

Ensure all locale files maintain the same structure:

```bash
# Validate JSON syntax
for file in i18n/locales/*.json; do
  echo "Validating $file"
  node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" || echo "❌ Invalid JSON in $file"
done
```

## 🧪 Testing Checklist

### Automated Testing:
- [ ] All locale files have valid JSON syntax
- [ ] No missing translation keys in any language
- [ ] Key structure is consistent across all locales
- [ ] No console warnings about missing translations

### Manual Testing:
- [ ] Switch to each language and verify all text displays
- [ ] Check all major user flows in each language
- [ ] Verify form validation messages appear in correct language
- [ ] Test error scenarios in all languages
- [ ] Confirm navigation elements are translated

### Browser Testing:
- [ ] Test in Chrome
- [ ] Test in Firefox  
- [ ] Test in Safari
- [ ] Test on mobile devices

## 🔧 Quality Assurance

### Translation Quality Checks:
- [ ] Translations are contextually appropriate
- [ ] Consistent terminology across the application
- [ ] Proper grammar and spelling
- [ ] Cultural appropriateness
- [ ] Text length fits UI components

### Technical Validation:
```bash
# Check for duplicate keys
node -e "
const locale = require('./i18n/locales/vi.json');
const keys = JSON.stringify(locale, null, 2).match(/\"[^\"]+\":/g);
const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
console.log('Duplicate keys:', duplicates);
"
```

## 📋 Missing Keys Template

Use this template to track missing translations:

| Key Path | English Text | Vietnamese | Chinese | Japanese | Status |
|----------|-------------|------------|---------|----------|---------|
| `feature.title` | "Feature Title" | ❌ Missing | ❌ Missing | ❌ Missing | Pending |
| `button.save` | "Save" | ✅ "Lưu" | ❌ Missing | ❌ Missing | Partial |

## 🔗 Related Files

### Locale Files:
- `i18n/locales/en.json` (Reference)
- `i18n/locales/vi.json`
- `i18n/locales/zh.json` 
- `i18n/locales/ja.json`

### Configuration:
- `i18n.config.ts`
- `nuxt.config.ts`
- `translate-locale.config.js`

### Scripts:
- `scripts/check-missing-translations.js` (to be created)

## 📚 Translation Resources

### Translation Tools:
- [Google Translate](https://translate.google.com/)
- [DeepL](https://www.deepl.com/)
- [Microsoft Translator](https://www.bing.com/translator)

### Language-Specific Resources:
- **Vietnamese**: [Vietnamese Style Guide]
- **Chinese**: [Chinese Localization Guide]
- **Japanese**: [Japanese UI Translation Guide]

## 📋 Definition of Done

- [ ] All missing translation keys are identified
- [ ] Complete translations added for all supported languages
- [ ] JSON structure is consistent across all locale files
- [ ] No console errors or warnings about missing translations
- [ ] All UI text displays correctly in every language
- [ ] Translation quality review completed
- [ ] Automated tests pass
- [ ] Manual testing completed for all languages
- [ ] Code review completed

## 🚀 Additional Notes

### Priority Order:
1. Critical user-facing text (navigation, buttons, errors)
2. Form labels and validation messages
3. Help text and descriptions
4. Secondary content

### Automation Opportunities:
- Set up automated checks for missing translations in CI/CD
- Create scripts to validate translation completeness
- Implement translation key usage tracking

<!-- Add any specific context or requirements -->
