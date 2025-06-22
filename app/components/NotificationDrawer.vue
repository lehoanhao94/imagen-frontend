<template>
  <UDrawer
    v-model:open="openNotificationDrawer"
    :overlay="false"
  >
    <UButton
      label="Open"
      color="neutral"
      variant="subtle"
      trailing-icon="i-lucide-chevron-up"
    />
    <template #header>
      <h2 class="text-highlighted font-semibold">
        Your generated image is ready. Click to view details.
      </h2>

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        @click="openNotificationDrawer = false"
      />
    </template>
    <template #content>
      {{ notificationHistoryUuid }}
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
/**
 * Example component showing how to use the notifications store
 * This replaces the complex component logic from the original code
 */

const notificationsStore = useNotificationsStore()
const { openNotificationDrawer, notificationHistoryUuid } = storeToRefs(notificationsStore)
const appStore = useAppStore()
const { isNotificationsSlideoverOpen } = storeToRefs(appStore)

// Initialize notifications on component mount
onMounted(async () => {
  // Fetch initial notifications
  await notificationsStore.fetchNotifications()

  // Setup real-time subscription
  notificationsStore.setupRealtimeSubscription()
})

// Cleanup on unmount
onUnmounted(() => {
  notificationsStore.cleanup()
})

// Handle notification slideover
const onOpenNotificationSlideover = () => {
  isNotificationsSlideoverOpen.value = true
}

// Example usage (these would be used in a real implementation):
// - notificationsStore.handleNotificationDetail(notification)
// - notificationsStore.fetchMore()
</script>
