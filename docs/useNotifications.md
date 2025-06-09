# useNotifications Composable

Composable để phân loại và quản lý các notification với format `type_status`.

## Cách sử dụng

### Import composable

```typescript
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
```

### Format notification types

Các notification types được định nghĩa theo format `{type}_{status}`:

- `video_1`: Video generation pending
- `video_2`: Video generation success  
- `video_3`: Video generation failed
- `image_1`: Image generation pending
- `image_2`: Image generation success
- `image_3`: Image generation failed
- `tts_history_1`: TTS pending
- `tts_history_2`: TTS success
- `tts_history_3`: TTS failed
- `voice_training_1`: Voice training pending
- `voice_training_2`: Voice training success
- `voice_training_3`: Voice training failed
- `music_1`: Music generation pending
- `music_2`: Music generation success
- `music_3`: Music generation failed

### Status codes

- `1`: Pending (đang chờ)
- `2`: Success (thành công)
- `3`: Failed (thất bại)

### Ví dụ sử dụng trong component

```vue
<template>
  <div class="notification-item">
    <!-- Icon với màu sắc theo status -->
    <div
      class="notification-icon"
      :class="getNotificationColors(notification.type, notification.status).bgColor"
    >
      <UIcon
        :name="getNotificationIcon(notification.type, notification.status)"
        :class="getNotificationColors(notification.type, notification.status).textColor"
      />
    </div>

    <!-- Nội dung notification -->
    <div class="notification-content">
      <h4>{{ getNotificationTitle(notification) }}</h4>
      <p>{{ getNotificationDescription(notification) }}</p>
      <span>{{ formatNotificationDate(notification.created_at) }}</span>
    </div>
  </div>
</template>

<script setup>
const {
  getNotificationIcon,
  getNotificationTitle,
  getNotificationDescription,
  getNotificationColors,
  formatNotificationDate
} = useNotifications()

// Notification data example với input_text
const notification = {
  id: '1',
  type: 'video',
  status: 2, // success
  seen: false,
  created_at: '2024-01-01T10:00:00Z',
  history_uuid: 'uuid-123',
  input_text: 'A beautiful sunset over the mountains with birds flying'
}
</script>
```

### Tính năng Input Text

Composable tự động hiển thị `input_text` hoặc `prompt` trong description:

```typescript
// Notification với input_text
const notification = {
  type: 'image',
  status: 2,
  input_text: 'A magical forest with glowing mushrooms and fairy lights'
}

// Description sẽ là: "Image has been generated successfully - "A magical forest with...""
const description = getNotificationDescription(notification)
```

**Quy tắc cắt ngắn text:**
- Text được cắt ngắn ở 20 ký tự
- Thêm "..." ở cuối nếu text dài hơn 20 ký tự
- Ưu tiên `input_text` trước, sau đó `prompt`

### Kiểm tra trạng thái notification

```typescript
// Kiểm tra notification có lỗi không
if (isNotificationError(notification)) {
  // Xử lý notification lỗi
}

// Kiểm tra notification thành công
if (isNotificationSuccess(notification)) {
  // Xử lý notification thành công
}

// Kiểm tra notification đang chờ
if (isNotificationPending(notification)) {
  // Xử lý notification đang chờ
}
```

### Sắp xếp notifications theo priority

```typescript
const sortedNotifications = sortNotificationsByPriority(notifications)
// Priority: 1 = cao nhất (failed), 2 = success, 3 = thấp nhất (pending)
```

### Thêm notification type mới

1. Thêm vào `notificationTypes` trong composable:

```typescript
// Thêm speech generation
speech_1: {
  icon: 'i-fa-clock',
  title: t('notifications.types.speech_1.title'),
  description: t('notifications.types.speech_1.description'),
  color: 'gray',
  bgColor: 'bg-gray-100 dark:bg-gray-800',
  textColor: 'text-gray-600 dark:text-gray-400'
},
speech_2: {
  icon: 'i-fa-check-circle',
  title: t('notifications.types.speech_2.title'),
  description: t('notifications.types.speech_2.description'),
  color: 'teal',
  bgColor: 'bg-teal-100 dark:bg-teal-900',
  textColor: 'text-teal-600 dark:text-teal-400'
},
speech_3: {
  icon: 'i-fa-times-circle',
  title: t('notifications.types.speech_3.title'),
  description: t('notifications.types.speech_3.description'),
  color: 'red',
  bgColor: 'bg-red-100 dark:bg-red-900',
  textColor: 'text-red-600 dark:text-red-400'
}
```

2. Thêm translations vào `i18n/locales/en.json` và `vi.json`:

```json
"speech_1": {
  "title": "Speech Generation Pending",
  "description": "Your speech generation request is waiting to be processed"
},
"speech_2": {
  "title": "Speech Generation Complete", 
  "description": "Your speech has been generated successfully"
},
"speech_3": {
  "title": "Speech Generation Failed",
  "description": "Your speech generation failed. Please try again"
}
```

## API Reference

### Functions

- `getNotificationIcon(eventType, status?)`: Lấy icon cho notification
- `getNotificationTitle(notification)`: Lấy title cho notification
- `getNotificationDescription(notification)`: Lấy description cho notification (bao gồm input_text)
- `getNotificationColors(eventType, status?)`: Lấy color scheme cho notification
- `formatNotificationDate(dateString)`: Format ngày tháng thành dạng relative time
- `getNotificationPriority(notification)`: Lấy priority của notification (1-3)
- `truncateText(text, maxLength?)`: Cắt ngắn text với độ dài tối đa (mặc định 20 ký tự)
- `isNotificationError(notification)`: Kiểm tra notification có lỗi không
- `isNotificationSuccess(notification)`: Kiểm tra notification thành công không
- `isNotificationPending(notification)`: Kiểm tra notification đang chờ không
- `sortNotificationsByPriority(notifications)`: Sắp xếp notifications theo priority

### Types

```typescript
interface NotificationData {
  id: string
  type: string
  event_type?: string
  status: number
  seen: boolean
  created_at: string
  history_uuid?: string
  redirect_url?: string
  input_text?: string
  prompt?: string
  [key: string]: any
}

interface NotificationTypeConfig {
  icon: string
  title: string
  description: string
  color: string
  bgColor: string
  textColor: string
}
```
