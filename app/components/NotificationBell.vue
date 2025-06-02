<template>
  <UChip
    inset
    :show="hasUnreadNotifications"
  >
    <UButton
      icon="i-fa-bell"
      size="sm"
      color="neutral"
      square
      variant="soft"
      class="rounded-full"
      @click="onOpenNotificationSlideover"
    />
  </UChip>

  <!-- Notification Slideover -->
  <NotificationSlideover />
</template>

<script setup lang="ts">
/**
 * Example component showing how to use the notifications store
 * This replaces the complex component logic from the original code
 */

const notificationsStore = useNotificationsStore()
const { hasUnreadNotifications } = storeToRefs(notificationsStore)
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
