---
name: 🤖 Improve i18n Automation
about: Enhance internationalization automation tools and workflows
title: '[i18n] Improve automation - [AUTOMATION_TYPE]'
labels: ['i18n', 'automation', 'enhancement', 'tooling']
assignees: ''
---

## 📋 Automation Enhancement Information

**Automation Type:** <!-- e.g., Translation Validation, Key Generation, Missing Translation Detection -->
**Current State:** <!-- Describe current automation level -->
**Desired Outcome:** <!-- What should be automated or improved -->

## 🎯 Objective

Improve the internationalization workflow by enhancing automation tools to reduce manual work and prevent translation-related issues.

## 🔧 Current i18n Automation Status

### Existing Tools:
- [ ] `translate-locale.config.js` - Translation configuration
- [ ] Manual translation workflow
- [ ] Basic locale file structure

### Current Limitations:
- [ ] Manual detection of missing translations
- [ ] No automated translation validation
- [ ] No CI/CD integration for i18n checks
- [ ] Manual key generation and management
- [ ] No translation usage tracking

## 🚀 Proposed Automation Improvements

### 1. Missing Translation Detection
Create automated scripts to detect missing translations:

```javascript
// scripts/i18n-check.js
const fs = require('fs');
const path = require('path');

class I18nChecker {
  constructor(localesDir = './i18n/locales', referenceLocale = 'en.json') {
    this.localesDir = localesDir;
    this.referenceLocale = referenceLocale;
  }

  flattenObject(obj, prefix = '') {
    const flattened = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(flattened, this.flattenObject(obj[key], `${prefix}${key}.`));
      } else {
        flattened[`${prefix}${key}`] = obj[key];
      }
    }
    return flattened;
  }

  checkMissingTranslations() {
    const reference = JSON.parse(
      fs.readFileSync(path.join(this.localesDir, this.referenceLocale), 'utf8')
    );
    const referenceKeys = Object.keys(this.flattenObject(reference));
    
    const results = {};
    const localeFiles = fs.readdirSync(this.localesDir)
      .filter(file => file.endsWith('.json') && file !== this.referenceLocale);
    
    localeFiles.forEach(file => {
      const locale = JSON.parse(
        fs.readFileSync(path.join(this.localesDir, file), 'utf8')
      );
      const localeKeys = Object.keys(this.flattenObject(locale));
      const missingKeys = referenceKeys.filter(key => !localeKeys.includes(key));
      
      results[file] = {
        total: referenceKeys.length,
        missing: missingKeys.length,
        completion: ((referenceKeys.length - missingKeys.length) / referenceKeys.length * 100).toFixed(2),
        missingKeys
      };
    });
    
    return results;
  }

  generateReport() {
    const results = this.checkMissingTranslations();
    
    console.log('\n📊 i18n Translation Report\n');
    console.log('=' .repeat(50));
    
    Object.entries(results).forEach(([file, data]) => {
      console.log(`\n${file}:`);
      console.log(`  Completion: ${data.completion}% (${data.total - data.missing}/${data.total})`);
      console.log(`  Missing: ${data.missing} keys`);
      
      if (data.missing > 0) {
        console.log('  Missing keys:');
        data.missingKeys.slice(0, 10).forEach(key => {
          console.log(`    - ${key}`);
        });
        if (data.missingKeys.length > 10) {
          console.log(`    ... and ${data.missingKeys.length - 10} more`);
        }
      }
    });
  }
}

const checker = new I18nChecker();
checker.generateReport();
```

### 2. Translation Key Usage Tracking
Track which translation keys are actually used in the codebase:

```javascript
// scripts/i18n-usage.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

class I18nUsageTracker {
  constructor() {
    this.usedKeys = new Set();
    this.definedKeys = new Set();
  }

  scanFiles() {
    // Scan Vue files
    const vueFiles = glob.sync('app/**/*.vue');
    vueFiles.forEach(file => this.scanFile(file));
    
    // Scan TypeScript files
    const tsFiles = glob.sync('app/**/*.ts');
    tsFiles.forEach(file => this.scanFile(file));
  }

  scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find $t() calls
    const tCalls = content.match(/\$t\(['"`]([^'"`]+)['"`]\)/g) || [];
    tCalls.forEach(call => {
      const key = call.match(/\$t\(['"`]([^'"`]+)['"`]\)/)[1];
      this.usedKeys.add(key);
    });
    
    // Find t() calls
    const tFunctionCalls = content.match(/\bt\(['"`]([^'"`]+)['"`]\)/g) || [];
    tFunctionCalls.forEach(call => {
      const key = call.match(/\bt\(['"`]([^'"`]+)['"`]\)/)[1];
      this.usedKeys.add(key);
    });
  }

  loadDefinedKeys() {
    const enLocale = JSON.parse(fs.readFileSync('./i18n/locales/en.json', 'utf8'));
    const flatKeys = this.flattenObject(enLocale);
    Object.keys(flatKeys).forEach(key => this.definedKeys.add(key));
  }

  flattenObject(obj, prefix = '') {
    const flattened = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(flattened, this.flattenObject(obj[key], `${prefix}${key}.`));
      } else {
        flattened[`${prefix}${key}`] = obj[key];
      }
    }
    return flattened;
  }

  generateUsageReport() {
    this.scanFiles();
    this.loadDefinedKeys();
    
    const unusedKeys = [...this.definedKeys].filter(key => !this.usedKeys.has(key));
    const undefinedKeys = [...this.usedKeys].filter(key => !this.definedKeys.has(key));
    
    console.log('\n📈 i18n Usage Report\n');
    console.log('=' .repeat(50));
    console.log(`Total defined keys: ${this.definedKeys.size}`);
    console.log(`Total used keys: ${this.usedKeys.size}`);
    console.log(`Unused keys: ${unusedKeys.length}`);
    console.log(`Undefined keys: ${undefinedKeys.length}`);
    
    if (unusedKeys.length > 0) {
      console.log('\n🗑️  Unused Keys:');
      unusedKeys.forEach(key => console.log(`  - ${key}`));
    }
    
    if (undefinedKeys.length > 0) {
      console.log('\n❌ Undefined Keys:');
      undefinedKeys.forEach(key => console.log(`  - ${key}`));
    }
  }
}

const tracker = new I18nUsageTracker();
tracker.generateUsageReport();
```

### 3. GitHub Actions Integration
Create CI/CD workflow for i18n validation:

```yaml
# .github/workflows/i18n-check.yml
name: i18n Validation

on:
  pull_request:
    paths:
      - 'i18n/locales/**'
      - 'app/**/*.vue'
      - 'app/**/*.ts'

jobs:
  i18n-check:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate JSON syntax
        run: |
          for file in i18n/locales/*.json; do
            echo "Validating $file"
            node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" || exit 1
          done
      
      - name: Check missing translations
        run: node scripts/i18n-check.js
      
      - name: Check translation usage
        run: node scripts/i18n-usage.js
      
      - name: Lint translation keys
        run: node scripts/i18n-lint.js
```

### 4. Translation Key Linting
Create linting rules for translation keys:

```javascript
// scripts/i18n-lint.js
const fs = require('fs');

class I18nLinter {
  constructor() {
    this.rules = [
      this.checkKeyNaming,
      this.checkConsistentStructure,
      this.checkDuplicateValues,
      this.checkEmptyValues
    ];
  }

  lint() {
    const localeFiles = ['en.json', 'vi.json', 'zh.json', 'ja.json'];
    const issues = [];

    localeFiles.forEach(file => {
      const locale = JSON.parse(fs.readFileSync(`./i18n/locales/${file}`, 'utf8'));
      
      this.rules.forEach(rule => {
        const ruleIssues = rule.call(this, locale, file);
        issues.push(...ruleIssues);
      });
    });

    return issues;
  }

  checkKeyNaming(locale, file) {
    const issues = [];
    const flatKeys = this.flattenObject(locale);
    
    Object.keys(flatKeys).forEach(key => {
      // Check camelCase convention
      if (!/^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)*$/.test(key)) {
        issues.push({
          file,
          type: 'naming',
          key,
          message: 'Key should follow camelCase convention'
        });
      }
    });
    
    return issues;
  }

  checkConsistentStructure(locale, file) {
    // Implementation for structure consistency
    return [];
  }

  checkDuplicateValues(locale, file) {
    // Implementation for duplicate value detection
    return [];
  }

  checkEmptyValues(locale, file) {
    const issues = [];
    const flatKeys = this.flattenObject(locale);
    
    Object.entries(flatKeys).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        issues.push({
          file,
          type: 'empty',
          key,
          message: 'Translation value is empty'
        });
      }
    });
    
    return issues;
  }

  flattenObject(obj, prefix = '') {
    const flattened = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(flattened, this.flattenObject(obj[key], `${prefix}${key}.`));
      } else {
        flattened[`${prefix}${key}`] = obj[key];
      }
    }
    return flattened;
  }

  generateReport() {
    const issues = this.lint();
    
    if (issues.length === 0) {
      console.log('✅ No i18n linting issues found!');
      return;
    }
    
    console.log(`\n❌ Found ${issues.length} i18n issues:\n`);
    
    issues.forEach(issue => {
      console.log(`${issue.file}: ${issue.type} - ${issue.key}`);
      console.log(`  ${issue.message}\n`);
    });
  }
}

const linter = new I18nLinter();
linter.generateReport();
```

## 📋 Implementation Tasks

### Phase 1: Basic Automation
- [ ] Create missing translation detection script
- [ ] Create translation usage tracking script
- [ ] Create translation key linting script
- [ ] Add npm scripts for i18n tools

### Phase 2: CI/CD Integration
- [ ] Create GitHub Actions workflow for i18n validation
- [ ] Add PR checks for translation completeness
- [ ] Set up automated reporting

### Phase 3: Advanced Features
- [ ] Integrate with translation services APIs
- [ ] Create translation key auto-generation
- [ ] Add translation memory features
- [ ] Implement translation quality scoring

## 🧪 Testing Checklist

- [ ] All automation scripts run without errors
- [ ] Scripts correctly identify missing translations
- [ ] Linting rules catch common issues
- [ ] CI/CD workflow passes on valid changes
- [ ] CI/CD workflow fails on invalid changes
- [ ] Performance is acceptable for large codebases

## 📋 Definition of Done

- [ ] Automation scripts are implemented and tested
- [ ] CI/CD integration is working
- [ ] Documentation is updated
- [ ] Team is trained on new tools
- [ ] Automation reduces manual i18n work by 80%+
- [ ] Translation issues are caught automatically
- [ ] Code review completed

## 🚀 Additional Notes

### Benefits:
- Reduced manual work for translation management
- Early detection of translation issues
- Consistent translation quality
- Better developer experience

### Future Enhancements:
- Integration with professional translation services
- Automated translation suggestions
- Translation analytics and reporting
- Real-time translation validation in development
