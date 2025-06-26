<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'HistoryWrapper Status Badge Demo - Imagen',
  description: 'Demo page for HistoryWrapper component with status prop and error badge functionality'
})
</script>

<template>
  <UPage>
    <UPageHero
      title="HistoryWrapper Status Badge Demo"
      description="Demonstrating the HistoryWrapper component with status prop and error badge for failed generations"
    />
    <UPageSection>
      <HistoryWrapperDemo />
    </UPageSection>
  </UPage>
</template>
