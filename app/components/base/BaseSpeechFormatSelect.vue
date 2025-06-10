<template>
  <USelectMenu
    v-model="outputFormat"
    :items="outputFormats"
    :placeholder="$t('selectFormat')"
  />
</template>

<script setup lang="ts">
const { outputFormats, outputFormat } = useSpeechGenModels()
</script>
