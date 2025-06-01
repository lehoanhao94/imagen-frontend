# 📚 Storybook Setup Guide

This guide explains how to use and develop with Storybook in the Imagen Frontend project.

## 🚀 Quick Start

### Development
Start Storybook in development mode:
```bash
npm run storybook
```
This will start Storybook on [http://localhost:6006](http://localhost:6006)

### Build for Production
Build Storybook for production:
```bash
npm run build-storybook
```
This creates a static build in the `storybook-static` directory.

## 🏗️ Architecture

### Configuration Files
- `.storybook/main.ts` - Main Storybook configuration
- `.storybook/preview.ts` - Global decorators and parameters
- `.storybook/tsconfig.json` - TypeScript configuration for Storybook
- `scripts/build-storybook.sh` - Build script that handles tsconfig conflicts

### Story Organization
- `stories/` - Global stories (Welcome, documentation)
- `app/components/**/*.stories.js` - Component-specific stories

## ✍️ Writing Stories

### Basic Story Structure
```javascript
import MyComponent from '../app/components/MyComponent.vue'

const meta = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    prop1: {
      control: 'boolean',
      description: 'Description of prop1',
    },
  },
  args: {
    prop1: false
  },
}

export default meta

export const Default = {
  args: {
    prop1: false
  }
}

export const WithProp = {
  args: {
    prop1: true
  }
}
```

### Interactive Stories
```javascript
export const Interactive = {
  render: (args) => ({
    components: { MyComponent },
    data() {
      return {
        localState: args.initialValue
      }
    },
    template: `
      <MyComponent 
        :prop="localState" 
        @change="localState = $event" 
      />
    `
  })
}
```

## 🎨 Component Categories

### Current Categories
- **Welcome** - Introduction and getting started
- **Components** - Basic UI components (PolaroidItem)
- **Base** - Foundation components (BaseLogo)

### Adding New Categories
Simply use the appropriate title prefix in your story:
```javascript
const meta = {
  title: 'CategoryName/ComponentName',
  // ...
}
```

## 🔧 Technical Notes

### TypeScript Configuration
The project uses a custom build script (`scripts/build-storybook.sh`) to handle TypeScript configuration conflicts between Nuxt and Storybook. This script:
1. Backs up the original `tsconfig.json`
2. Creates a temporary Storybook-compatible configuration
3. Builds Storybook
4. Restores the original configuration

### Vue 3 Setup
- Uses `@storybook/vue3-vite` framework
- Includes Vue 3 plugin for proper `.vue` file handling
- Configured with path aliases matching the main project

### Styling
- Stories inherit the project's CSS
- Dark/light mode support through Storybook's theme addon
- Custom backgrounds can be configured per story

## 🚀 Deployment

### Automatic Deployment
Storybook is automatically deployed to GitHub Pages when:
- Pushing to `main` or `develop` branches
- Creating pull requests

### Manual Deployment
1. Build Storybook: `npm run build-storybook`
2. Deploy the `storybook-static` directory to your hosting platform

### GitHub Pages URL
The deployed Storybook will be available at:
`https://[username].github.io/imagen-frontend/`

## 🛠️ Development Tips

### Adding New Components
1. Create your Vue component in `app/components/`
2. Create a corresponding `.stories.js` file
3. Export multiple stories to show different states
4. Use controls to make props interactive
5. Add documentation with JSDoc comments

### Best Practices
- **Start Simple**: Begin with basic Default and Loading states
- **Use Controls**: Make props interactive for better testing
- **Document Variants**: Show different use cases and states
- **Test Edge Cases**: Include stories for error states, empty data, etc.
- **Mobile Responsive**: Test components at different viewport sizes

### Debugging
- Check browser console for Vue/Storybook errors
- Use Storybook's Actions addon to debug events
- Verify component imports and paths

## 📖 Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Vue 3 + Storybook Guide](https://storybook.js.org/docs/vue/get-started)
- [Storybook Addons](https://storybook.js.org/addons)

## 🤝 Contributing

When adding new components:
1. Include comprehensive stories covering all major use cases
2. Add proper TypeScript types and JSDoc comments
3. Test stories in both light and dark modes
4. Ensure responsive design works across viewports
5. Update this documentation if adding new patterns