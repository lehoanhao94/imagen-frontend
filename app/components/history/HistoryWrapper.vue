<template>
  <div class="relative">
    <span class="absolute top-2 left-2 bg-primary-500 text-white text-[0.625rem] uppercase px-2 py-0.5 rounded">
      {{ props.type === 'image' ? 'Image' : 'Video' }}
    </span>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
const props = defineProps({
  type: {
    type: String as PropType<'image' | 'video'>,
    required: true
  }
})
</script>
