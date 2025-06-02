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
    class="w-full sm:w-fit fixed border-b border-neutral-200 dark:border-neutral-800 top-0 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-40 bg-neutral-50 dark:bg-neutral-900 sm:rounded-full"
  >
    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="rounded-full px-2 sm:px-4 w-full justify-center"
      :ui="{
        link: 'px-2 py-1',
        linkLeadingIcon: 'hidden'
      }"
    >
      <template #auth="{ item }">
        <div class="flex flex-row gap-2 items-center">
          <AppUserMenu v-if="user" />
          <span v-else>
            <ULink to="/auth/login">
              {{ item.label }}
            </ULink>
          </span>
          <NotificationBell v-if="user" />
        </div>
      </template>
    </UNavigationMenu>
  </div>
</template>
