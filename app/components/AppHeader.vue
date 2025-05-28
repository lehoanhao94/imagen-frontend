<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>

<template>
  <div
    class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-40 bg-neutral-50 dark:bg-neutral-900 rounded-full"
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
    >
      <template #auth="{ item }">
        <AppUserMenu v-if="user" />
        <span v-else>
          <ULink
            to="/auth/login"
          >
            {{ item.label }}
          </ULink>
        </span>
      </template>
    </UNavigationMenu>
  </div>
</template>
