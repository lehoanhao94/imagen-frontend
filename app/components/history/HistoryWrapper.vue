<template>
  <div class="relative group">
    <div
      class="group-hover:hidden absolute top-2 right-2 flex flex-col items-end gap-1"
    >
      <span
        class="bg-gray-500/80 text-white text-[0.625rem] uppercase px-1.5 py-0.5 rounded z-10 text-xs font-semibold"
      >
        {{ type }}
      </span>
      <span
        v-if="style"
        class="bg-yellow-500/80 text-white text-[0.625rem] uppercase px-1.5 py-0.5 rounded z-10 text-xs font-semibold"
      >
        {{ style }}
      </span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    required: true
  },
  style: {
    type: String,
    default: ''
  }
})
</script>
