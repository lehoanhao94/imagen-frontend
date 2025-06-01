import BaseLogo from '../app/components/base/BaseLogo.vue'

const meta = {
  title: 'Base/BaseLogo',
  component: BaseLogo,
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
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Controls the loading animation state',
    },
  },
  args: {
    loading: false
  },
}

export default meta

export const Default = {
  args: {
    loading: false
  }
}

export const Loading = {
  args: {
    loading: true
  }
}

export const Interactive = {
  args: {
    loading: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the logo to toggle between states. The component features a beautiful crystal ball effect with animated waves, particles, and energy glow.'
      }
    }
  },
  render: (args) => ({
    components: { BaseLogo },
    data() {
      return {
        isLoading: args.loading
      }
    },
    template: `
      <div>
        <BaseLogo :loading="isLoading" @click="isLoading = !isLoading" style="cursor: pointer;" />
        <p style="margin-top: 20px; text-align: center; color: #666;">
          Click the logo to toggle loading state
        </p>
      </div>
    `
  })
}