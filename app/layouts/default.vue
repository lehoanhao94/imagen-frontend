<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNavLinks } from '~/utils/links'

const { _t } = useI18n()

// Use the new i18n-aware nav links composable
const translatedNavLinks = useNavLinks()
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
