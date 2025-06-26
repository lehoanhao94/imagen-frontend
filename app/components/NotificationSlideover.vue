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
          class="space-y-2"
        >
          <NuxtLink
            v-for="notification in notificationsStore.notifications"
            :key="notification.id"
            class="px-3 py-2.5 rounded-md hover:bg-elevated/50 flex items-center gap-3 relative -mx-3 first:-mt-3 last:-mb-3 cursor-pointer"
            @click="handleNotificationClick(notification)"
          >
            <UChip
              color="success"
              :show="!notification.seen"
              inset
            >
              <UAvatar
                :icon="
                  getNotificationIcon(notification.type, notification.status)
                "
                size="md"
              />
            </UChip>

            <div class="text-sm flex-1">
              <p class="flex items-center justify-between">
                <span class="text-highlighted font-medium">{{
                  getNotificationTitle(notification)
                }}</span>

                <time
                  :datetime="notification.date"
                  class="text-muted text-[10px]"
                  v-text="dayjs.utc(notification.created_at).fromNow()"
                />
              </p>

              <p class="text-dimmed">
                {{ getNotificationDescription(notification) }}
              </p>
            </div>
          </NuxtLink>
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
import { formatTimeAgo } from '@vueuse/core'
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

// Handle notification click
const handleNotificationClick = async (notification: any) => {
  await notificationsStore.handleNotificationDetail(notification)
}

// Mark all notifications as read when slideover closes
watch(isOpen, (value) => {
  if (!value) {
    notificationsStore.markAllAsRead()
  }
  // reload data when slideover opens
  if (value) {
    notificationsStore.fetchNotifications()
  }
})

const {
  notificationTypes,
  getNotificationIcon,
  getNotificationTitle,
  getNotificationDescription,
  getNotificationColors,
  formatNotificationDate,
  getNotificationPriority,
  isNotificationError,
  isNotificationSuccess,
  isNotificationPending
} = useNotifications()
</script>
