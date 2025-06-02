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