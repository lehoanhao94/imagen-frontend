<template>
  <USelect
    v-model="outputChannel"
    :options="outputChannels"
    option-attribute="label"
    value-attribute="value"
    :placeholder="$t('selectChannel')"
  />
</template>

<script setup lang="ts">
const { outputChannels, outputChannel } = useSpeechGenModels()
</script>
