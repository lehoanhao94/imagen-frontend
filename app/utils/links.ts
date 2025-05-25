import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [
  {
    label: 'AI Tool',
    icon: 'i-lucide-home',
    to: '/app'
  },
  {
    label: 'Library',
    icon: 'i-lucide-folder',
    to: '/library'
  },
  {
    label: 'API',
    icon: 'i-lucide-file-text',
    to: '/api-docs'
  },
  {
    label: 'Login',
    icon: 'i-lucide-file-text',
    to: '/auth/login'
  }
]
