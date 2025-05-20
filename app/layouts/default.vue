<script setup lang="ts">
// No need to import app store here as BaseLoadingOverlay handles the loading state
</script>

<template>
  <div class="">
    <div>
      <AppHeader :links="navLinks" />
      <slot />
      <AppFooter />
    </div>
    <LazyLayoutStarBg />
    <BaseLoadingOverlay />
  </div>
</template>
