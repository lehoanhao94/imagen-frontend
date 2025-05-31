#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const localesDir = './i18n/locales';
const referenceLocale = 'en.json';

function flattenObject(obj, prefix = '') {
  const flattened = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], `${prefix}${key}.`));
    } else {
      flattened[`${prefix}${key}`] = obj[key];
    }
  }
  return flattened;
}

function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((current, key) => current && current[key], obj);
}

function setNestedValue(obj, keyPath, value) {
  const keys = keyPath.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
}

function checkMissingTranslations() {
  try {
    const referencePath = path.join(localesDir, referenceLocale);
    const reference = JSON.parse(fs.readFileSync(referencePath, 'utf8'));
    const referenceFlat = flattenObject(reference);
    const referenceKeys = Object.keys(referenceFlat);
    
    console.log(`📊 Reference locale (${referenceLocale}): ${referenceKeys.length} keys\n`);
    
    const localeFiles = fs.readdirSync(localesDir).filter(file => 
      file.endsWith('.json') && file !== referenceLocale
    );
    
    let totalMissing = 0;
    const missingReport = {};
    
    localeFiles.forEach(file => {
      try {
        const locale = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
        const localeFlat = flattenObject(locale);
        const localeKeys = Object.keys(localeFlat);
        const missingKeys = referenceKeys.filter(key => !localeKeys.includes(key));
        
        const completionRate = Math.round(((referenceKeys.length - missingKeys.length) / referenceKeys.length) * 100);
        
        console.log(`🌍 ${file}:`);
        console.log(`   Total keys: ${localeKeys.length}`);
        console.log(`   Missing keys: ${missingKeys.length}`);
        console.log(`   Completion: ${completionRate}%`);
        
        if (missingKeys.length > 0) {
          console.log(`   Missing keys:`);
          missingKeys.forEach(key => console.log(`     - ${key}`));
          missingReport[file] = missingKeys;
          totalMissing += missingKeys.length;
        } else {
          console.log(`   ✅ Complete!`);
        }
        console.log('');
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    });
    
    console.log(`📈 Summary:`);
    console.log(`   Total missing translations: ${totalMissing}`);
    console.log(`   Files with missing translations: ${Object.keys(missingReport).length}`);
    
    return { referenceFlat, missingReport };
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  checkMissingTranslations();
}

module.exports = { checkMissingTranslations, flattenObject, getNestedValue, setNestedValue };