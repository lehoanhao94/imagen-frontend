<script setup lang="ts">
</script>

<template>
  <div>
    <UContainer class="">
      <AppHeader :links="navLinks" />
      <slot />
      <AppFooter />
    </UContainer>
  </div>
</template>
