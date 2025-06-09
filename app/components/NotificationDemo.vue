<template>
  <div class="p-6 space-y-6">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Notification Types Demo
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Examples of different notification types with various status states
      </p>
    </div>

    <!-- Notification Types Demo -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="demo in demoNotifications"
        :key="demo.id"
        class="p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        :class="{
          'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800': !demo.seen,
          'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700': demo.seen
        }"
      >
        <div class="flex items-start space-x-3">
          <!-- Notification Icon -->
          <div class="flex-shrink-0 mt-1">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="getNotificationColors(demo.event_type, demo.status).bgColor"
            >
              <UIcon
                :name="getNotificationIcon(demo.event_type, demo.status)"
                class="w-4 h-4"
                :class="getNotificationColors(demo.event_type, demo.status).textColor"
              />
            </div>
          </div>

          <!-- Notification Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {{ getNotificationTitle(demo) }}
              </p>
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatNotificationDate(demo.created_at) }}
                </span>
                <div
                  v-if="!demo.seen"
                  class="w-2 h-2 bg-blue-500 rounded-full"
                />
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ getNotificationDescription(demo) }}
            </p>
            <div class="mt-2 flex items-center space-x-2">
              <span class="text-xs px-2 py-1 rounded-full"
                    :class="getNotificationColors(demo.event_type, demo.status).bgColor">
                {{ demo.event_type }}_{{ demo.status }}
              </span>
              <span class="text-xs text-gray-500">
                Priority: {{ getNotificationPriority(demo) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Types -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Available Notification Types
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="(config, key) in notificationTypes"
          :key="key"
          class="flex items-center space-x-2 p-2 rounded-lg border"
          :class="config.bgColor"
        >
          <UIcon
            :name="config.icon"
            class="w-4 h-4"
            :class="config.textColor"
          />
          <span class="text-xs font-medium" :class="config.textColor">
            {{ key }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use the notifications composable
const {
  notificationTypes,
  getNotificationIcon,
  getNotificationTitle,
  getNotificationDescription,
  getNotificationColors,
  formatNotificationDate,
  getNotificationPriority,
  sortNotificationsByPriority
} = useNotifications()

// Demo notification data
const demoNotifications = ref([
  {
    id: '1',
    event_type: 'video',
    status: 2, // success
    seen: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    history_uuid: 'demo-1'
  },
  {
    id: '2',
    event_type: 'video',
    status: 3, // failed
    seen: false,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    history_uuid: 'demo-2'
  },
  {
    id: '3',
    event_type: 'image',
    status: 2, // success
    seen: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    history_uuid: 'demo-3'
  },
  {
    id: '4',
    event_type: 'image',
    status: 1, // pending
    seen: false,
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
    history_uuid: 'demo-4'
  },
  {
    id: '5',
    event_type: 'voice_training',
    status: 1, // pending
    seen: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    history_uuid: 'demo-5'
  },
  {
    id: '6',
    event_type: 'music',
    status: 3, // failed
    seen: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    history_uuid: 'demo-6'
  }
])

// Sort notifications by priority
const sortedNotifications = computed(() => {
  return sortNotificationsByPriority(demoNotifications.value)
})

// Use sorted notifications for display
demoNotifications.value = sortedNotifications.value
</script>
