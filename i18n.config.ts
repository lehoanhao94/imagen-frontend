import en from './i18n/locales/en.json'
import zh from './i18n/locales/zh.json'
import ja from './i18n/locales/ja.json'
import vi from './i18n/locales/vi.json'

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: window.localStorage.getItem('locale') || 'en',
  silentFallbackWarn: true,
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en,
    zh,
    ja,
    vi
  }
}))
