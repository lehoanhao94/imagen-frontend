<script setup lang="ts">
const { imageDimensions, imageDimension } = useImageDimensions()
</script>

<template>
  <URadioGroup
    v-model="imageDimension"
    indicator="hidden"
    variant="card"
    :items="imageDimensions"
    size="xs"
    :ui="{
      fieldset: 'flex flex-wrap gap-2 flex-row',
      item: 'flex py-1.5 items-center justify-center min-w-[40px] rounded-lg border border-muted/50 hover:bg-muted/50'
    }"
  />
</template>
