<template>
  <USelectMenu
    v-model="outputChannel"
    :items="outputChannels"
    :placeholder="$t('selectChannel')"
    :search-input="false"
  />
</template>

<script setup lang="ts">
const { outputChannels, outputChannel } = useSpeechGenModels()
</script>
