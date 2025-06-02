# Notifications Store Documentation

This documentation explains how to use the Supabase notifications store that was implemented to replace the complex component logic.

## Overview

The notifications store provides a centralized way to manage notifications from Supabase with the following features:

- Real-time notification subscriptions
- Pagination support
- Mark as read functionality
- Encrypted data decryption
- Notification navigation handling

## Usage

### 1. Basic Setup

```vue
<script setup lang="ts">
const notificationsStore = useNotificationsStore()

// Initialize notifications
onMounted(async () => {
  await notificationsStore.fetchNotifications()
  notificationsStore.setupRealtimeSubscription()
})

// Cleanup on unmount
onUnmounted(() => {
  notificationsStore.cleanup()
})
</script>
```

### 2. Display Notifications

#### Using NotificationBell Component (Recommended)

```vue
<template>
  <!-- Complete notification system with bell and slideover -->
  <NotificationBell />
</template>
```

#### Using NotificationSlideover Directly

```vue
<template>
  <!-- Manual slideover integration -->
  <UButton @click="appStore.isNotificationsSlideoverOpen = true">
    Show Notifications
  </UButton>
  
  <NotificationSlideover />
</template>

<script setup lang="ts">
const appStore = useAppStore()
</script>
```

#### Custom Implementation

```vue
<template>
  <!-- Show notification bell with unread indicator -->
  <UChip :show="notificationsStore.hasUnreadNotifications">
    <UButton icon="i-fa-bell" @click="openNotifications" />
  </UChip>

  <!-- Display notifications list -->
  <div v-for="notification in notificationsStore.notifications" :key="notification.id">
    <div @click="notificationsStore.handleNotificationDetail(notification)">
      {{ notification.event_type }} - {{ notification.created_at }}
    </div>
  </div>
</template>
```

### 3. Pagination

```vue
<template>
  <UButton 
    v-if="notificationsStore.showFetchNext" 
    :loading="notificationsStore.isFetching"
    @click="notificationsStore.fetchMore()"
  >
    Load More
  </UButton>
</template>
```

### 4. Mark as Read

```vue
<script setup lang="ts">
const notificationsStore = useNotificationsStore()

// Mark single notification as read
const markAsRead = (notificationId: string) => {
  notificationsStore.markAsRead(notificationId)
}

// Mark all notifications as read
const markAllAsRead = () => {
  notificationsStore.markAllAsRead()
}
</script>
```

## Store API

### State

- `notifications: Notification[]` - Array of notifications
- `loading: boolean` - Loading state for initial fetch
- `isFetching: boolean` - Loading state for pagination
- `totalCount: number` - Total number of notifications
- `hasUnreadNotifications: boolean` - Computed getter for unread status
- `showFetchNext: boolean` - Computed getter for pagination

### Actions

- `fetchNotifications()` - Fetch initial notifications
- `fetchMore()` - Load more notifications (pagination)
- `markAsRead(id)` - Mark specific notification as read
- `markAllAsRead()` - Mark all notifications as read
- `setupRealtimeSubscription()` - Setup real-time listening
- `handleNotificationDetail(notification)` - Handle notification click
- `cleanup()` - Cleanup subscriptions

## Environment Setup

Make sure to set the following environment variables:

```env
NUXT_PUBLIC_SUPABASE_URL=your_supabase_url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NUXT_NOTIFICATION_TABLE=your_notifications_table_name
```

## Migration from Original Code

The original complex component logic has been moved into this store. Here's how the migration works:

### Before (Original Component)
```vue
<script setup lang="ts">
// Complex logic with useAsyncData, realtime channels, etc.
const { data: allNotifications, refresh: fetchAllNotifications } = await useAsyncData(...)
let realtimeChannel: RealtimeChannel
// ... lots of complex logic
</script>
```

### After (Using Store)
```vue
<script setup lang="ts">
const notificationsStore = useNotificationsStore()

onMounted(() => {
  notificationsStore.fetchNotifications()
  notificationsStore.setupRealtimeSubscription()
})
</script>
```

## Features

1. **Encryption Support**: Automatically decrypts notification data using AES
2. **Real-time Updates**: Live updates via Supabase subscriptions
3. **Pagination**: Efficient loading of large notification lists
4. **Navigation**: Automatic routing based on notification types
5. **State Management**: Centralized state with Pinia
6. **Type Safety**: Full TypeScript support

## Components

### NotificationBell

A complete notification bell component that includes:
- Unread notification indicator
- Click handler to open slideover
- Automatic initialization and cleanup
- Real-time subscription management

```vue
<template>
  <NotificationBell />
</template>
```

### NotificationSlideover

A comprehensive slideover component that displays:
- Notification list with proper formatting
- Loading states and empty states
- Mark as read functionality
- Pagination support
- Error handling
- Internationalization support

Features:
- Auto-closes and marks all as read when closed
- Click on notifications to navigate and mark as read
- Responsive design with proper icons and styling
- Real-time updates

```vue
<template>
  <NotificationSlideover />
</template>
```

## Internationalization

The components include full i18n support for multiple languages. Translation keys:

```json
{
  "notifications": {
    "title": "Notifications",
    "description": "Your recent notifications and updates",
    "totalCount": "{count} notifications",
    "markAllRead": "Mark all as read",
    "loadMore": "Load more",
    "close": "Close",
    "empty": {
      "title": "No notifications",
      "description": "You're all caught up! No new notifications to show."
    },
    "error": {
      "title": "Error loading notifications"
    },
    "types": {
      "ttsHistory": {
        "title": "Audio Generation Complete",
        "description": "Your text-to-speech audio has been generated successfully"
      },
      "voiceTraining": {
        "title": "Voice Training Complete", 
        "description": "Your custom voice model training has finished"
      },
      "default": {
        "title": "Notification",
        "description": "You have a new notification"
      }
    }
  }
}
```