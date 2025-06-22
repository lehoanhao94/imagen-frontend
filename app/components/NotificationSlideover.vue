<template>
  <USlideover
    v-model:open="isOpen"
    :title="$t('notifications.title')"
    :description="$t('notifications.description')"
  >
    <template #body>
      <div class="space-y-4 w-full">
        <!-- Loading State -->
        <div
          v-if="notificationsStore.loading"
          class="space-y-3"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="animate-pulse"
          >
            <div class="flex space-x-3">
              <div
                class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"
              />
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div
          v-else-if="notificationsStore.notifications.length > 0"
          ref="notificationsList"
          class="space-y-2 max-h-96 overflow-y-auto"
        >
          <NuxtLink
            v-for="notification in notificationsStore.notifications"
            :key="notification.id"
            class="px-3 py-2.5 rounded-md hover:bg-elevated/50 flex items-center gap-3 relative -mx-3 first:-mt-3 last:-mb-3"
            @click="handleNotificationClick(notification)"
          >
            <UChip
              color="success"
              :show="!notification.seen"
              inset
            >
              <UAvatar
                :icon="
                  getNotificationIcon(notification.event_type, notification.status)
                "
                size="md"
              />
            </UChip>

            <div class="text-sm flex-1">
              <p class="flex items-center justify-between">
                <span class="text-highlighted font-medium">{{
                  getNotificationTitle({ ...notification, type: notification.event_type })
                }}</span>

                <time
                  :datetime="notification.date"
                  class="text-muted text-[10px]"
                  v-text="dayjs.utc(notification.created_at).fromNow()"
                />
              </p>

              <p class="text-dimmed">
                {{ getNotificationDescription({ ...notification, type: notification.event_type }) }}
              </p>
            </div>
          </NuxtLink>

          <!-- Loading indicator for infinite scroll -->
          <div
            v-if="notificationsStore.isFetching"
            class="flex justify-center py-4"
          >
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100" />
          </div>

          <!-- Trigger element for intersection observer -->
          <div
            v-if="notificationsStore.showFetchNext && !notificationsStore.isFetching"
            ref="loadMoreTrigger"
            class="h-1 w-full"
            aria-hidden="true"
          />
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="text-center py-8"
        >
          <UIcon
            name="i-fa-bell-slash"
            class="w-12 h-12 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            {{ $t("notifications.empty.title") }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t("notifications.empty.description") }}
          </p>
        </div>

        <!-- Error State -->
        <div
          v-if="notificationsStore.error"
          class="p-4 bg-red-50 dark:bg-red-950 rounded-lg"
        >
          <div class="flex">
            <UIcon
              name="i-fa-exclamation-triangle"
              class="w-5 h-5 text-red-400"
            />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                {{ $t("notifications.error.title") }}
              </h3>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                {{ notificationsStore.error }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(utc)
dayjs.extend(relativeTime)

// Composables and stores
const notificationsStore = useNotificationsStore()
const appStore = useAppStore()
const { t: $t } = useI18n()

// Reactive slideover state
const isOpen = computed({
  get: () => appStore.isNotificationsSlideoverOpen,
  set: (value) => {
    appStore.isNotificationsSlideoverOpen = value
  }
})

// Refs for scroll functionality
const notificationsList = ref<HTMLElement>()
const loadMoreTrigger = ref<HTMLElement>()
let observer: IntersectionObserver | null = null

// Handle notification click
const handleNotificationClick = async (notification: any) => {
  await notificationsStore.handleNotificationDetail(notification)
}

// Setup intersection observer for infinite scroll
const setupInfiniteScroll = () => {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting && !notificationsStore.isFetching && notificationsStore.showFetchNext) {
        notificationsStore.fetchMore()
      }
    },
    {
      threshold: 0.1,
      rootMargin: '50px'
    }
  )

  nextTick(() => {
    if (loadMoreTrigger.value && observer) {
      observer.observe(loadMoreTrigger.value)
    }
  })
}

// Watch for changes in notifications to update observer
watch(() => notificationsStore.notifications.length, () => {
  if (notificationsStore.showFetchNext && !notificationsStore.isFetching) {
    nextTick(() => {
      setupInfiniteScroll()
    })
  }
})

// Mark all notifications as read when slideover closes
watch(isOpen, (value) => {
  if (!value) {
    // Clean up observer when closing
    if (observer) {
      observer.disconnect()
      observer = null
    }
    notificationsStore.markAllAsRead()
  }
  // reload data when slideover opens
  if (value) {
    notificationsStore.fetchNotifications()
    nextTick(() => {
      setupInfiniteScroll()
    })
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

const {
  getNotificationIcon,
  getNotificationTitle,
  getNotificationDescription
} = useNotifications()
</script>
