<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { navLinks } from '~/utils/links'

const { t } = useI18n()

// Create a computed property for the translated navLinks
const translatedNavLinks = computed(() => {
  return navLinks.map(link => ({
    ...link,
    label: link.label
      ? t(`nav.${link.label.toLowerCase().replace(/\s+/g, '')}`)
      : ''
  }))
})
</script>

<template>
  <div class="">
    <div>
      <AppHeaderBanner />
      <AppHeader :links="translatedNavLinks" />
      <slot />
      <AppFooter />
    </div>
    <LazyLayoutStarBg />
    <LayoutWavesBg />
    <BaseLoadingOverlay />
  </div>
</template>
