#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { checkMissingTranslations, flattenObject, setNestedValue } = require('./check-missing-translations.js')

const localesDir = './i18n/locales'
const referenceLocale = 'en.json'

function addMissingKeys() {
  console.log('🔧 Starting process to add missing locale keys...\n')

  try {
    // Get reference locale data
    const referencePath = path.join(localesDir, referenceLocale)
    const reference = JSON.parse(fs.readFileSync(referencePath, 'utf8'))
    const referenceFlat = flattenObject(reference)

    // Check for missing translations
    const { missingReport } = checkMissingTranslations()

    if (Object.keys(missingReport).length === 0) {
      console.log('✅ No missing keys found! All locale files are up to date.')
      return
    }

    console.log('📝 Adding missing keys with English values as placeholders...\n')

    let totalKeysAdded = 0

    // Process each locale file with missing keys
    Object.entries(missingReport).forEach(([filename, missingKeys]) => {
      const filePath = path.join(localesDir, filename)

      try {
        const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        let keysAdded = 0

        console.log(`🌍 Processing ${filename}:`)

        missingKeys.forEach((keyPath) => {
          const englishValue = referenceFlat[keyPath]
          if (englishValue !== undefined) {
            console.log(`   + Adding "${keyPath}": "${englishValue}"`)
            setNestedValue(locale, keyPath, englishValue)
            keysAdded++
          } else {
            console.log(`   ⚠️  Warning: Key "${keyPath}" not found in reference locale`)
          }
        })

        if (keysAdded > 0) {
          // Write back to file with proper formatting
          fs.writeFileSync(filePath, JSON.stringify(locale, null, 2) + '\n', 'utf8')
          console.log(`   ✅ Added ${keysAdded} keys to ${filename}`)
          totalKeysAdded += keysAdded
        }
        console.log('')
      } catch (error) {
        console.error(`   ❌ Error processing ${filename}:`, error.message)
      }
    })

    console.log(`🎉 Process completed!`)
    console.log(`📊 Summary: Added ${totalKeysAdded} total keys across ${Object.keys(missingReport).length} files\n`)

    // Verify the results
    console.log('🔍 Verifying results...\n')
    checkMissingTranslations()

    console.log('\n💡 Note: Missing keys have been added using English values as placeholders.')
    console.log('   Please review and translate these keys to the appropriate languages.')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  addMissingKeys()
}

module.exports = { addMissingKeys }
