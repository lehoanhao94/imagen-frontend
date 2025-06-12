#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { checkMissingTranslations, flattenObject, setNestedValue } = require('./check-missing-translations.js')

const localesDir = './i18n/locales'

// Translation mapping for missing keys
const translations = {
  'buyCredits.orderDetail': {
    'ja.json': '注文詳細',
    'zh.json': '订单详情'
  },
  'settings': {
    'de.json': 'Einstellungen',
    'es.json': 'Configuración',
    'fr.json': 'Paramètres',
    'ja.json': '設定',
    'pt.json': 'Configurações',
    'zh.json': '设置'
  },
  'userMenu.profile': {
    'de.json': 'Profil',
    'es.json': 'Perfil',
    'fr.json': 'Profil',
    'ja.json': 'プロフィール',
    'pt.json': 'Perfil',
    'zh.json': '个人资料'
  },
  'userMenu.buyCredits': {
    'de.json': 'Credits kaufen',
    'es.json': 'Comprar créditos',
    'fr.json': 'Acheter des crédits',
    'ja.json': 'クレジット購入',
    'pt.json': 'Comprar créditos',
    'zh.json': '购买积分'
  },
  'userMenu.settings': {
    'de.json': 'Einstellungen',
    'es.json': 'Configuración',
    'fr.json': 'Paramètres',
    'ja.json': '設定',
    'pt.json': 'Configurações',
    'zh.json': '设置'
  },
  'userMenu.api': {
    'de.json': 'API',
    'es.json': 'API',
    'fr.json': 'API',
    'ja.json': 'API',
    'pt.json': 'API',
    'zh.json': 'API'
  },
  'userMenu.logout': {
    'de.json': 'Abmelden',
    'es.json': 'Cerrar sesión',
    'fr.json': 'Déconnexion',
    'ja.json': 'ログアウト',
    'pt.json': 'Sair',
    'zh.json': '退出登录'
  },
  'userMenu.greeting': {
    'de.json': 'Hallo, {name}',
    'es.json': 'Hola, {name}',
    'fr.json': 'Salut, {name}',
    'ja.json': 'こんにちは、{name}',
    'pt.json': 'Olá, {name}',
    'zh.json': '你好，{name}'
  },
  'formats.mp3': {
    'de.json': 'MP3',
    'es.json': 'MP3',
    'fr.json': 'MP3',
    'ja.json': 'MP3',
    'pt.json': 'MP3',
    'zh.json': 'MP3'
  },
  'formats.wav': {
    'de.json': 'WAV',
    'es.json': 'WAV',
    'fr.json': 'WAV',
    'ja.json': 'WAV',
    'pt.json': 'WAV',
    'zh.json': 'WAV'
  },
  'channels.mono': {
    'de.json': 'Mono',
    'es.json': 'Mono',
    'fr.json': 'Mono',
    'ja.json': 'モノラル',
    'pt.json': 'Mono',
    'zh.json': '单声道'
  },
  'channels.stereo': {
    'de.json': 'Stereo',
    'es.json': 'Estéreo',
    'fr.json': 'Stéréo',
    'ja.json': 'ステレオ',
    'pt.json': 'Estéreo',
    'zh.json': '立体声'
  },
  'options.allow': {
    'de.json': 'Erlauben',
    'es.json': 'Permitir',
    'fr.json': 'Autoriser',
    'ja.json': '許可',
    'pt.json': 'Permitir',
    'zh.json': '允许'
  },
  'options.dontAllow': {
    'de.json': 'Nicht erlauben',
    'es.json': 'No permitir',
    'fr.json': 'Ne pas autoriser',
    'ja.json': '許可しない',
    'pt.json': 'Não permitir',
    'zh.json': '不允许'
  },
  'options.voices': {
    'de.json': 'Stimmen',
    'es.json': 'Voces',
    'fr.json': 'Voix',
    'ja.json': '音声',
    'pt.json': 'Vozes',
    'zh.json': '语音'
  },
  'options.pickVoice': {
    'de.json': 'Stimme auswählen',
    'es.json': 'Elegir voz',
    'fr.json': 'Choisir une voix',
    'ja.json': '音声を選択',
    'pt.json': 'Escolher voz',
    'zh.json': '选择语音'
  }
}

function fixMissingTranslations() {
  console.log('🔧 Starting translation fix process...\n')

  const { missingReport } = checkMissingTranslations()

  if (Object.keys(missingReport).length === 0) {
    console.log('✅ No missing translations found!')
    return
  }

  // Fix missing translations
  Object.entries(missingReport).forEach(([filename, missingKeys]) => {
    const filePath = path.join(localesDir, filename)

    try {
      const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      let modified = false

      missingKeys.forEach((keyPath) => {
        if (translations[keyPath] && translations[keyPath][filename]) {
          console.log(`📝 Adding ${keyPath} to ${filename}: "${translations[keyPath][filename]}"`)
          setNestedValue(locale, keyPath, translations[keyPath][filename])
          modified = true
        } else {
          console.log(`⚠️  No translation provided for ${keyPath} in ${filename}`)
        }
      })

      if (modified) {
        // Write back to file with proper formatting
        fs.writeFileSync(filePath, JSON.stringify(locale, null, 2) + '\n', 'utf8')
        console.log(`✅ Updated ${filename}\n`)
      }
    } catch (error) {
      console.error(`❌ Error updating ${filename}:`, error.message)
    }
  })

  console.log('🎉 Translation fix process completed!\n')

  // Verify the fixes
  console.log('🔍 Verifying fixes...\n')
  checkMissingTranslations()
}

if (require.main === module) {
  fixMissingTranslations()
}
