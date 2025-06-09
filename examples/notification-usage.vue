<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-bold">Notification Examples</h2>

    <!-- Example notifications -->
    <div class="space-y-2">
      <div
        v-for="notification in exampleNotifications"
        :key="notification.id"
        class="flex items-center space-x-3 p-3 border rounded-lg"
      >
        <!-- Icon -->
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center"
          :class="getNotificationColors(notification.type, notification.status).bgColor"
        >
          <UIcon
            :name="getNotificationIcon(notification.type, notification.status)"
            class="w-4 h-4"
            :class="getNotificationColors(notification.type, notification.status).textColor"
          />
        </div>

        <!-- Content -->
        <div class="flex-1">
          <h3 class="font-medium">{{ getNotificationTitle(notification) }}</h3>
          <p class="text-sm text-gray-600">{{ getNotificationDescription(notification) }}</p>
          <span class="text-xs text-gray-500">{{ formatNotificationDate(notification.created_at) }}</span>
        </div>

        <!-- Status badge -->
        <span class="text-xs px-2 py-1 rounded-full"
              :class="getNotificationColors(notification.type, notification.status).bgColor">
          {{ notification.type }}_{{ notification.status }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import composable
const {
  getNotificationIcon,
  getNotificationTitle,
  getNotificationDescription,
  getNotificationColors,
  formatNotificationDate
} = useNotifications()

// Example notification data with input_text
const exampleNotifications = [
  {
    id: '1',
    type: 'video',
    status: 2, // success
    seen: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    input_text: 'A beautiful sunset over the mountains with birds flying'
  },
  {
    id: '2',
    type: 'video',
    status: 3, // failed
    seen: false,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    prompt: 'Create a video of dancing robots in space'
  },
  {
    id: '3',
    type: 'image',
    status: 1, // pending
    seen: false,
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
    input_text: 'A magical forest with glowing mushrooms and fairy lights'
  },
  {
    id: '4',
    type: 'tts_history',
    status: 2, // success
    seen: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    input_text: 'Hello world, this is a test of text to speech functionality'
  },
  {
    id: '5',
    type: 'voice_training',
    status: 3, // failed
    seen: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    input_text: 'Training voice model with custom audio samples'
  },
  {
    id: '6',
    type: 'music',
    status: 2, // success
    seen: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    prompt: 'Generate upbeat electronic music for a party'
  }
]
</script>
