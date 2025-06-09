<template>
  <USlideover
    v-model:open="isOpen"
    :title="$t('notifications.title')"
    :description="$t('notifications.description')"
  >
    <template #body>
      <div class="space-y-4 w-full">
        <!-- Header Actions -->
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{
              $t("notifications.totalCount", {
                count: notificationsStore.totalCount
              })
            }}
          </span>
          <UButton
            v-if="notificationsStore.hasUnreadNotifications"
            size="xs"
            variant="ghost"
            :label="$t('notifications.markAllRead')"
            @click="notificationsStore.markAllAsRead()"
          />
        </div>

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
          <div
            v-for="notification in notificationsStore.notifications"
            :key="notification.id"
            class="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            :class="{
              'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800':
                !notification.seen,
              'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700':
                notification.seen
            }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start space-x-3">
              <!-- Notification Icon -->
              <div class="flex-shrink-0 mt-1">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="getNotificationColors(notification.event_type, notification.status).bgColor"
                >
                  <UIcon
                    :name="getNotificationIcon(notification.event_type, notification.status)"
                    class="w-4 h-4"
                    :class="getNotificationColors(notification.event_type, notification.status).textColor"
                  />
                </div>
              </div>

              <!-- Notification Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
                  >
                    {{ getNotificationTitle(notification) }}
                  </p>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatNotificationDate(notification.created_at) }}
                    </span>
                    <div
                      v-if="!notification.seen"
                      class="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ getNotificationDescription(notification) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Load More Button -->
          <div
            v-if="notificationsStore.showFetchNext"
            class="pt-4"
          >
            <UButton
              :loading="notificationsStore.isFetching"
              :label="$t('notifications.loadMore')"
              variant="outline"
              block
              @click="notificationsStore.fetchMore()"
            />
          </div>
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

    <template #footer>
      <UButton
        :label="$t('notifications.close')"
        color="neutral"
        variant="outline"
        class="justify-center"
        block
        @click="isOpen = false"
      />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
// Composables and stores
const notificationsStore = useNotificationsStore()
const appStore = useAppStore()
const { t: $t } = useI18n()

// Use the new notifications composable
const {
  getNotificationIcon,
  getNotificationTitle,
  getNotificationDescription,
  getNotificationColors,
  formatNotificationDate
} = useNotifications()

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
  if (!value && notificationsStore.hasUnreadNotifications) {
    notificationsStore.markAllAsRead()
  }
  // reload data when slideover opens
  if (value) {
    notificationsStore.fetchNotifications()
  }
})
</script>
