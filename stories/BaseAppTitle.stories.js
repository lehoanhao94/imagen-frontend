import BaseAppTitle from '../app/components/base/BaseAppTitle.vue'

const meta = {
  title: 'Base/BaseAppTitle',
  component: BaseAppTitle,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' }
      ]
    }
  },
  tags: ['autodocs'],
}

export default meta

export const Default = {
  render: () => ({
    components: { BaseAppTitle },
    // Mock the i18n $t function
    methods: {
      $t(key) {
        const translations = {
          appName: 'Imagen Pro'
        }
        return translations[key] || key
      }
    },
    template: `<BaseAppTitle />`
  }),
  parameters: {
    docs: {
      description: {
        story: 'The main application title with animated gradient glow effect. Features a beautiful text gradient animation that cycles through multiple colors.'
      }
    }
  }
}

export const CustomText = {
  render: () => ({
    components: { BaseAppTitle },
    methods: {
      $t(key) {
        const translations = {
          appName: 'Custom App Name'
        }
        return translations[key] || key
      }
    },
    template: `<BaseAppTitle />`
  }),
  parameters: {
    docs: {
      description: {
        story: 'Example with custom application name to show how the component adapts to different text lengths.'
      }
    }
  }
}

export const LongText = {
  render: () => ({
    components: { BaseAppTitle },
    methods: {
      $t(key) {
        const translations = {
          appName: 'Very Long Application Name'
        }
        return translations[key] || key
      }
    },
    template: `<BaseAppTitle />`
  }),
  parameters: {
    docs: {
      description: {
        story: 'Example with longer text to demonstrate responsive behavior and text wrapping.'
      }
    }
  }
}