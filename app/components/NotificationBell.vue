<template>
  <UChip
    inset
    :show="notificationsStore.hasUnreadNotifications"
  >
    <UButton
      icon="i-fa-bell"
      size="lg"
      color="gray"
      square
      variant="ghost"
      @click="onOpenNotificationSlideover"
    />
  </UChip>

  <!-- Example slideover component would go here -->
  <!-- <NotificationsSlideover ... /> -->
</template>

<script setup lang="ts">
/**
 * Example component showing how to use the notifications store
 * This replaces the complex component logic from the original code
 */

const notificationsStore = useNotificationsStore()
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

// Watch for slideover close to mark all as read
watch(isNotificationsSlideoverOpen, (value) => {
  if (!value) {
    notificationsStore.markAllAsRead()
  }
})

// Example usage (these would be used in a real implementation):
// - notificationsStore.handleNotificationDetail(notification)
// - notificationsStore.fetchMore()
</script>
