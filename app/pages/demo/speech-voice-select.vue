<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Speech Voice Select Demo - Imagen',
  description: 'Demo page for BaseSpeechVoiceSelectModal component with modelValue props'
})
</script>

<template>
  <UPage>
    <UPageHero
      title="Speech Voice Select Demo"
      description="Demonstrating the reusable BaseSpeechVoiceSelectModal component with modelValue props"
    />
    <UPageSection>
      <SpeechVoiceDemo />
    </UPageSection>
  </UPage>
</template>
