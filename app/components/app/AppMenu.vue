<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()

const items = [
  {
    label: t('profileMenu.guide'),
    icon: 'i-lucide-book-open'
  },
  {
    label: t('profileMenu.logo'),
    slot: 'logo' as const
  },
  {
    label: t('profileMenu.components'),
    icon: 'i-lucide-box',
    slot: 'components' as const
  }
] satisfies NavigationMenuItem[]
</script>

<template>
  <UNavigationMenu
    :items="items"
    class="px-10 rounded-full w-fit justify-center bg-gray-50 dark:bg-neutral-900/80 shadow-xs shadow-primary-500"
    color="neutral"
    variant="link"
    :ui="{
      item: 'min-w-30',
      link: 'flex-row'
    }"
  >
    <template #logo>
      <div
        class="w-20 mx-auto animate__animated animate__zoomInDown relative"
      >
        <BaseLogo
          id="main-logo"
          :loading="false"
          :class="{ 'logo-loading animate__pulse': false }"
          class="absolute !-top-13"
        />
      </div>
    </template>
  </UNavigationMenu>
</template>
