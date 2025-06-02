<script setup lang="ts">
// Fullscreen layout for immersive pages like video details
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Main content takes full screen -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Optional background effects but less prominent than default layout -->
    <LazyLayoutStarBg class="opacity-30" />
    <BaseLoadingOverlay />
  </div>
</template>

<style scoped>
/* Ensure fullscreen experience */
.min-h-screen {
  min-height: 100vh;
}
</style>
