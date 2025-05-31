#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { checkMissingTranslations, flattenObject, setNestedValue } = require('./check-missing-translations.js');

const localesDir = './i18n/locales';

// Translation mapping for missing keys
const translations = {
  'buyCredits.orderDetail': {
    'ja.json': '注文詳細',
    'zh.json': '订单详情'
  }
};

function fixMissingTranslations() {
  console.log('🔧 Starting translation fix process...\n');
  
  const { missingReport } = checkMissingTranslations();
  
  if (Object.keys(missingReport).length === 0) {
    console.log('✅ No missing translations found!');
    return;
  }
  
  // Fix missing translations
  Object.entries(missingReport).forEach(([filename, missingKeys]) => {
    const filePath = path.join(localesDir, filename);
    
    try {
      const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let modified = false;
      
      missingKeys.forEach(keyPath => {
        if (translations[keyPath] && translations[keyPath][filename]) {
          console.log(`📝 Adding ${keyPath} to ${filename}: "${translations[keyPath][filename]}"`);
          setNestedValue(locale, keyPath, translations[keyPath][filename]);
          modified = true;
        } else {
          console.log(`⚠️  No translation provided for ${keyPath} in ${filename}`);
        }
      });
      
      if (modified) {
        // Write back to file with proper formatting
        fs.writeFileSync(filePath, JSON.stringify(locale, null, 2) + '\n', 'utf8');
        console.log(`✅ Updated ${filename}\n`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${filename}:`, error.message);
    }
  });
  
  console.log('🎉 Translation fix process completed!\n');
  
  // Verify the fixes
  console.log('🔍 Verifying fixes...\n');
  checkMissingTranslations();
}

if (require.main === module) {
  fixMissingTranslations();
}