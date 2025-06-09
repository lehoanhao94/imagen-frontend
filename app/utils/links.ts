import type { NavigationMenuItem } from '@nuxt/ui'

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
