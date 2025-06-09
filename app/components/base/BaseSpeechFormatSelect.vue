<template>
  <USelect
    v-model="outputFormat"
    :options="outputFormats"
    option-attribute="label"
    value-attribute="value"
    :placeholder="$t('selectFormat')"
  />
</template>

<script setup lang="ts">
const { outputFormats, outputFormat } = useSpeechGenModels()
</script>
