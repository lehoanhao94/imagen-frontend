<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()
</script>

<template>
  <div
    class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10"
  >
    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="rounded-full px-2 sm:px-4"
      :ui="{
        link: 'px-2 py-1',
        linkLeadingIcon: 'hidden'
      }"
    />
  </div>
</template>
