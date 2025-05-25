<script setup lang="ts">
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
        label: 'Profile',
        icon: 'i-lucide-user'
      },
      {
        label: 'Buy Credits',
        icon: 'mynaui:cart-plus'
      },
      {
        label: 'Settings',
        icon: 'i-lucide-cog'
      }
    ],
    [
      {
        label: 'API',
        icon: 'i-lucide-cloud'
      }
    ],
    [
      {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        click: () => authStore.logout()
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
      :description="`Hi, ${user?.full_name}`"
      :avatar="{
        icon: 'solar:user-bold-duotone'
      }"
      size="xs"
    />
  </UDropdownMenu>
</template>
