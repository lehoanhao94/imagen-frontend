<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items = ref([
  {
    label: 'Image Generation',
    value: 'image-generation',
    icon: 'hugeicons:ai-image'
  },
  {
    label: 'Video Generation',
    value: 'video-generation',
    icon: 'hugeicons:ai-video'
  },
  {
    label: 'Speech Generation',
    value: 'image-to-video',
    icon: 'hugeicons:ai-voice'
  },
  {
    label: 'Music Generation',
    value: 'music-generation',
    icon: 'ri:music-ai-fill'
  }
] satisfies SelectMenuItem[])
const value = ref(items.value[0])
</script>

<template>
  <USelectMenu
    v-model="value"
    :icon="value?.icon"
    :items="items"
    class="w-52"
    :search-input="false"
  />
</template>
