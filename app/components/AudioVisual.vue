<template>
  <av-line
    :line-width="2"
    line-color="lime"
    :src="src"
  />
  {{ src }}
</template>

<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 80
  }
})
</script>
