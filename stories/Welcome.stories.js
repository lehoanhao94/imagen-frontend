const meta = {
  title: 'Welcome',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

export const Introduction = {
  render: () => ({
    template: `
      <div class="p-8 max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎨 Imagen Frontend Storybook
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Welcome to the component library for the Imagen Frontend project
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8 mb-8">
          <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 class="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
              📚 What is Storybook?
            </h2>
            <p class="text-blue-800 dark:text-blue-200">
              Storybook is a tool for developing UI components in isolation. 
              It helps you build components faster and test them visually.
            </p>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h2 class="text-xl font-semibold text-green-900 dark:text-green-100 mb-3">
              🧩 Component Library
            </h2>
            <p class="text-green-800 dark:text-green-200">
              Browse and interact with all components used in the Imagen Frontend, 
              including AI tools, layouts, and interactive elements.
            </p>
          </div>
        </div>
        
        <div class="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h2 class="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">
            🚀 Getting Started
          </h2>
          <ul class="text-purple-800 dark:text-purple-200 space-y-2">
            <li>• Explore components in the sidebar</li>
            <li>• Use the Controls panel to interact with component props</li>
            <li>• Check the Docs tab for component documentation</li>
            <li>• View different states and variations of each component</li>
          </ul>
        </div>
      </div>
    `
  })
}