<template>
  <div class="container mx-auto p-8">
    <h1 class="text-2xl font-bold mb-4">Test BaseImageStyleSelect Component</h1>
    <div class="max-w-md space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Selected Style: {{ selectedStyle || 'None' }}</label>
        <BaseImageStyleSelect v-model="selectedStyle" />
      </div>
      
      <div v-if="selectedStyle" class="p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <p>You selected: <strong>{{ selectedStyle }}</strong></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedStyle = ref<string | null>(null)

definePageMeta({
  layout: false
})
</script>