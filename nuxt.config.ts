// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-vue3-google-signin'
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

  runtimeConfig: {
    public: {
      api: {
        imagenproService:
          process.env.IMAGENPRO_SERVICE_BASE_URL
          || 'https://api-dev.geminigen.ai/api/v1'
      },
      NUXT_GOOGLE_CLIENT_ID:
        process.env.NUXT_GOOGLE_CLIENT_ID
        || '309877442422-22t81sfdbm47ah0fi8e9ggedh0ih2jc8.apps.googleusercontent.com'
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
      { code: 'ja', name: '日本語', file: 'ja.json' }
    ],
    strategy: 'no_prefix'
  }
})
