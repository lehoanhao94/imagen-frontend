<script setup lang="ts">
// TODO: Add authentication check here
// const { $auth } = useNuxtApp()
// if (!$auth.user) {
//   throw createError({
//     statusCode: 401,
//     statusMessage: 'Unauthorized'
//   })
// }

useSeoMeta({
  title: 'Profile - Imagen',
  description: 'Manage your account settings and preferences',
  ogTitle: 'Profile - Imagen',
  ogDescription: 'Manage your account settings and preferences'
})
</script>

<template>
  <UPage>
    <UPageHero
      title="Profile"
      description="Manage your account settings and preferences"
    />
    <UPageSection>
      <div class="max-w-2xl mx-auto">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Account Information</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input 
                type="text" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your full name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input 
                type="email" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your email"
              >
            </div>
            <div>
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update Profile
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
          <h2 class="text-xl font-semibold mb-4">Preferences</h2>
          <div class="space-y-4">
            <div class="flex items-center">
              <input type="checkbox" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Email notifications
              </label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Marketing emails
              </label>
            </div>
          </div>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>