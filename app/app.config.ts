export default defineAppConfig({
  global: {
    picture: {
      dark: 'https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      light:
        'https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'My profile picture'
    },
    meetingLink: 'https://cal.com/',
    email: 'ui-pro@nuxt.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'slate'
    }
  },
  uiPro: {
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description:
          'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    // Credits will be translated in the component using $t('copyright', { year: new Date().getFullYear() })
    credits: '',
    colorMode: false,
    links: [
      {
        'icon': 'mingcute:voice-line',
        'to': 'https://ttsopenai.com/',
        'target': '_blank',
        'aria-label': 'Text To Speech OpenAI'
      },
      {
        'icon': 'hugeicons:translate',
        'to': 'https://doctransgpt.com/',
        'target': '_blank',
        'aria-label': 'DoctransGPT'
      },
      {
        'icon': 'i-simple-icons-discord',
        'to': 'https://discord.com/invite/ps2h6QT',
        'target': '_blank',
        'aria-label': 'Nuxt UI on Discord'
      },
      {
        'icon': 'i-simple-icons-youtube',
        'to': 'https://github.com/nuxt/ui',
        'target': '_blank',
        'aria-label': 'Youtube'
      },
      {
        'label': 'Privacy',
        'to': '/privacy',
        'aria-label': 'Privacy Policy'
      },
      {
        'label': 'Terms',
        'to': '/terms',
        'aria-label': 'Terms of Service'
      }
    ]
  }
})
