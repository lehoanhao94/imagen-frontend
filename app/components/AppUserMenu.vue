<script setup lang="ts">
const { t } = useI18n()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const items = computed(() => {
  return [
    [
      {
        label: user.value?.full_name,
        avatar: {
          icon: 'solar:user-bold-duotone'
        },
        type: 'label'
      }
    ],
    [
      {
        label: t('userMenu.profile'),
        icon: 'i-lucide-user',
        to: '/profile'
      },
      {
        label: t('userMenu.buyCredits'),
        icon: 'mynaui:cart-plus',
        to: '/buy-credits'
      },
      {
        label: t('userMenu.settings'),
        icon: 'i-lucide-cog'
      }
    ],
    [
      {
        label: t('userMenu.api'),
        icon: 'i-lucide-cloud'
      }
    ],
    [
      {
        label: t('userMenu.logout'),
        icon: 'i-lucide-log-out',
        onSelect: () => authStore.logout()
      }
    ]
  ]
})
</script>

<template>
  <UDropdownMenu
    :items="items"
    :ui="{
      content: 'w-48'
    }"
  >
    <UUser
      :description="t('userMenu.greeting', { name: user?.full_name })"
      :avatar="{
        icon: 'solar:user-bold-duotone'
      }"
      size="xs"
    />
  </UDropdownMenu>
</template>
