import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [
  {
    label: 'AI Tool',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Library',
    icon: 'i-lucide-folder',
    to: '/projects'
  },
  {
    label: 'API',
    icon: 'i-lucide-file-text',
    to: '/blog'
  }
]
