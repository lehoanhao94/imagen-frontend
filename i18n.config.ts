import en from './i18n/locales/en.json'
import zh_cn from './i18n/locales/zh.json'
import ja from './i18n/locales/ja.json'
import vi from './i18n/locales/vi.json'
import es from './i18n/locales/es.json'
import fr from './i18n/locales/fr.json'
import de from './i18n/locales/de.json'
import pt from './i18n/locales/pt.json'

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: window.localStorage.getItem('locale') || 'en',
  silentFallbackWarn: true,
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en,
    zh_cn,
    ja,
    vi,
    es,
    fr,
    de,
    pt
  }
}))
