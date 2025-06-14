<template>
  <div class="relative group">
    <span
      class="group-hover:hidden absolute top-2 right-2 bg-gray-500/80 text-white text-[0.625rem] uppercase px-1.5 py-0.5 rounded z-10 text-xs font-semibold"
    >
      {{ type }}
    </span>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});
</script>
