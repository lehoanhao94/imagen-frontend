#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const localesDir = './i18n/locales'

function validateI18nStructure() {
  console.log('🧪 Running comprehensive i18n validation...\n')

  const referenceFile = 'en.json'
  const referenceLocale = JSON.parse(fs.readFileSync(path.join(localesDir, referenceFile), 'utf8'))

  const localeFiles = fs.readdirSync(localesDir).filter(file =>
    file.endsWith('.json')
  )

  let allValid = true

  // Test 1: JSON syntax validation
  console.log('📋 Test 1: JSON Syntax Validation')
  localeFiles.forEach((file) => {
    try {
      JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'))
      console.log(`   ✅ ${file}: Valid JSON`)
    } catch (error) {
      console.log(`   ❌ ${file}: Invalid JSON - ${error.message}`)
      allValid = false
    }
  })

  // Test 2: Structure consistency
  console.log('\n📋 Test 2: Structure Consistency')

  function getStructure(obj, prefix = '') {
    const structure = []
    for (const key in obj) {
      const keyPath = prefix ? `${prefix}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        structure.push(...getStructure(obj[key], keyPath))
      } else {
        structure.push(keyPath)
      }
    }
    return structure.sort()
  }

  const referenceStructure = getStructure(referenceLocale)

  localeFiles.forEach((file) => {
    if (file === referenceFile) {
      console.log(`   📖 ${file}: Reference (${referenceStructure.length} keys)`)
      return
    }

    const locale = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'))
    const localeStructure = getStructure(locale)

    const missingKeys = referenceStructure.filter(key => !localeStructure.includes(key))
    const extraKeys = localeStructure.filter(key => !referenceStructure.includes(key))

    if (missingKeys.length === 0 && extraKeys.length === 0) {
      console.log(`   ✅ ${file}: Structure matches (${localeStructure.length} keys)`)
    } else {
      console.log(`   ❌ ${file}: Structure mismatch`)
      if (missingKeys.length > 0) {
        console.log(`      Missing keys: ${missingKeys.join(', ')}`)
      }
      if (extraKeys.length > 0) {
        console.log(`      Extra keys: ${extraKeys.join(', ')}`)
      }
      allValid = false
    }
  })

  // Test 3: Key completeness
  console.log('\n📋 Test 3: Translation Completeness')

  localeFiles.forEach((file) => {
    if (file === referenceFile) return

    const locale = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'))
    const localeStructure = getStructure(locale)

    const completionRate = Math.round((localeStructure.length / referenceStructure.length) * 100)

    if (completionRate === 100) {
      console.log(`   ✅ ${file}: 100% complete (${localeStructure.length}/${referenceStructure.length} keys)`)
    } else {
      console.log(`   ⚠️  ${file}: ${completionRate}% complete (${localeStructure.length}/${referenceStructure.length} keys)`)
    }
  })

  // Test 4: Verify specific recent fix
  console.log('\n📋 Test 4: Verify Recent Fixes')

  const criticalKeys = ['buyCredits.orderDetail']

  criticalKeys.forEach((keyPath) => {
    console.log(`   Checking key: ${keyPath}`)

    localeFiles.forEach((file) => {
      const locale = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'))
      const keys = keyPath.split('.')
      let value = locale

      for (const key of keys) {
        value = value?.[key]
      }

      if (value) {
        console.log(`     ✅ ${file}: "${value}"`)
      } else {
        console.log(`     ❌ ${file}: Missing key`)
        allValid = false
      }
    })
  })

  console.log('\n🎯 Final Result:')
  if (allValid) {
    console.log('   ✅ All i18n validations passed!')
    console.log('   🌍 Translation coverage: 100% across all supported languages')
    console.log('   📚 Total languages supported: ' + localeFiles.length)
    process.exit(0)
  } else {
    console.log('   ❌ Some validations failed')
    process.exit(1)
  }
}

if (require.main === module) {
  validateI18nStructure()
}

module.exports = { validateI18nStructure }
