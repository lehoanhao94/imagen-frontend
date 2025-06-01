import type { StorybookConfig } from '@storybook/vue3-vite'
import { join, dirname } from 'path'
import vue from '@vitejs/plugin-vue'

const config: StorybookConfig = {
  stories: [
    '../app/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  typescript: {
    check: false
  },
  viteFinal: async (config) => {
    // Ensure Vue plugin is included
    config.plugins = config.plugins || []
    config.plugins.push(vue({
      script: {
        defineModel: true
      }
    }))
    
    // Ensure Storybook can resolve Vue components and composables
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '~': join(__dirname, '..', 'app'),
        '@': join(__dirname, '..', 'app'),
        '#app': join(__dirname, '..', 'app')
      }
    }
    
    // Disable TypeScript checking for Vue files in Storybook
    config.esbuild = {
      ...config.esbuild,
      target: 'esnext'
    }
    
    return config
  }
}

export default config