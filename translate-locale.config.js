module.exports = {
  languages: [
    { code: 'en', name: 'english' },
    { code: 'ja', name: 'japanese' },
    { code: 'vi', name: 'vietnamese' },
    { code: 'zh', name: 'chinese (simplified)' },
    { code: 'es', name: 'spanish' },
    { code: 'fr', name: 'french' },
    { code: 'de', name: 'german' },
    { code: 'pt', name: 'portuguese' }
  ],
  localePath: './i18n/locales',
  delayTime: 1000,
  aiModel: 'gpt-4o',
  localeKeyFile: './i18n/locales/en.json'
}
