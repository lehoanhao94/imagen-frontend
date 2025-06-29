// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui-pro',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-vue3-google-signin',
    '@nuxtjs/supabase',
    '@nuxt/content'
  ],
  plugins: [{ src: '~/plugins/vue-number-animation', ssr: false }],
  ssr: false,
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  devtools: {
    enabled: true
  },
  app: {
    rootAttrs: {
      'data-vaul-drawer-wrapper': ''
    }
  },

  css: ['~/assets/css/main.css', 'animate.css/animate.min.css'],

  // Color mode configuration for proper theme persistence with SSR disabled
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if no system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    disableTransition: false // enable transition when switching themes
  },
  content: {
    experimental: { nativeSqlite: true }
  },

  runtimeConfig: {
    public: {
      api: {
        imagenproService:
          process.env.IMAGENPRO_SERVICE_BASE_URL
          || 'https://api-dev.geminigen.ai/api/v1'
      },
      NUXT_GOOGLE_CLIENT_ID:
        process.env.NUXT_GOOGLE_CLIENT_ID
        || '309877442422-22t81sfdbm47ah0fi8e9ggedh0ih2jc8.apps.googleusercontent.com',
      NUXT_PUBLIC_SUPABASE_URL:
        process.env.NUXT_PUBLIC_SUPABASE_URL
        || 'https://realtime-dev.ttsopenai.com',
      NUXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
        || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzI0MDAwNDAwLAogICJleHAiOiA0MDkwODMyNDQzCn0.2jwTXghgcYZRJz38_dDpIPIhRfHq1ZtgRHAHkxHpBcg',
      NUXT_NOTIFICATION_TABLE:
        process.env.NUXT_NOTIFICATION_TABLE || 'notifications_geminigen_dev',
      features: {
        paymentWithCrypto: process.env.FEATURE_PAYMENT_WITH_CRYPTO === 'true'
      }
    }
  },
  routeRules: {
    '/': {
      redirect: '/app'
    }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  googleSignIn: {
    clientId:
      '309877442422-22t81sfdbm47ah0fi8e9ggedh0ih2jc8.apps.googleusercontent.com'
  },
  i18n: {
    defaultLocale: 'vi',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' },
      { code: 'zh_cn', name: '简体中文', file: 'zh.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'pt', name: 'Português', file: 'pt.json' }
    ],
    strategy: 'no_prefix'
  },
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL || 'https://realtime-dev.ttsopenai.com',
    key:
      process.env.SUPABASE_KEY
      || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzI0MDAwNDAwLAogICJleHAiOiA0MDkwODMyNDQzCn0.2jwTXghgcYZRJz38_dDpIPIhRfHq1ZtgRHAHkxHpBcg'
  }
})
