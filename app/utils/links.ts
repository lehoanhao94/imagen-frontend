import type { NavigationMenuItem } from '@nuxt/ui'

export const useNavLinks = () => {
  const { t } = useI18n()

  return computed<NavigationMenuItem[]>(() => [
    {
      label: t('nav.aitool'),
      icon: 'i-lucide-home',
      to: '/app'
    },
    {
      label: t('nav.history'),
      icon: 'i-lucide-folder',
      to: '/history'
    },
    {
      label: t('nav.api'),
      icon: 'i-lucide-file-text',
      to: '/api-docs'
    },
    {
      label: t('nav.login'),
      icon: 'i-lucide-file-text',
      slot: 'auth' as const
    }
  ])
}

// Keep the original export for backward compatibility, but it will use hardcoded values
export const navLinks: NavigationMenuItem[] = [
  {
    label: 'AI Tool',
    icon: 'i-lucide-home',
    to: '/app'
  },
  {
    label: 'History',
    icon: 'i-lucide-folder',
    to: '/history'
  },
  {
    label: 'API',
    icon: 'i-lucide-file-text',
    to: '/api-docs'
  },
  {
    label: 'Login',
    icon: 'i-lucide-file-text',
    slot: 'auth' as const
  }
]
