export interface NotificationTypeConfig {
  icon: string
  title: string
  description: string
  color: string
  bgColor: string
  textColor: string
}

export interface NotificationData {
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

export const useNotifications = () => {
  const { t } = useI18n()

  // Notification type configurations with combined type_status format
  const notificationTypes: Record<string, NotificationTypeConfig> = {
    // Video Generation - Status 1 (Pending)
    video_1: {
      icon: 'i-fa-clock',
      title: t('notifications.types.video_1.title'),
      description: t('notifications.types.video_1.description'),
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400'
    },

    // Video Generation - Status 2 (Success)
    video_2: {
      icon: 'hugeicons:ai-video',
      title: t('notifications.types.video_2.title'),
      description: t('notifications.types.video_2.description'),
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-400'
    },

    // Video Generation - Status 3 (Failed)
    video_3: {
      icon: 'ooui:error',
      title: t('notifications.types.video_3.title'),
      description: t('notifications.types.video_3.description'),
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-600 dark:text-red-400'
    },

    // Image Generation - Status 1 (Pending)
    image_1: {
      icon: 'i-fa-clock',
      title: t('notifications.types.image_1.title'),
      description: t('notifications.types.image_1.description'),
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400'
    },

    // Image Generation - Status 2 (Success)
    image_2: {
      icon: 'hugeicons:ai-image',
      title: t('notifications.types.image_2.title'),
      description: t('notifications.types.image_2.description'),
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      textColor: 'text-purple-600 dark:text-purple-400'
    },

    // Image Generation - Status 3 (Failed)
    image_3: {
      icon: 'ooui:error',
      title: t('notifications.types.image_3.title'),
      description: t('notifications.types.image_3.description'),
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-600 dark:text-red-400'
    },

    // TTS History - Status 1 (Pending)
    tts_history_1: {
      icon: 'i-fa-clock',
      title: t('notifications.types.tts_history_1.title'),
      description: t('notifications.types.tts_history_1.description'),
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400'
    },

    // TTS History - Status 2 (Success)
    tts_history_2: {
      icon: 'i-fa-check-circle',
      title: t('notifications.types.tts_history_2.title'),
      description: t('notifications.types.tts_history_2.description'),
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-600 dark:text-blue-400'
    },

    // TTS History - Status 3 (Failed)
    tts_history_3: {
      icon: 'ooui:error',
      title: t('notifications.types.tts_history_3.title'),
      description: t('notifications.types.tts_history_3.description'),
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-600 dark:text-red-400'
    },

    // Voice Training - Status 1 (Pending)
    voice_training_1: {
      icon: 'i-fa-clock',
      title: t('notifications.types.voice_training_1.title'),
      description: t('notifications.types.voice_training_1.description'),
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400'
    },

    // Voice Training - Status 2 (Success)
    voice_training_2: {
      icon: 'i-fa-check-circle',
      title: t('notifications.types.voice_training_2.title'),
      description: t('notifications.types.voice_training_2.description'),
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-400'
    },

    // Voice Training - Status 3 (Failed)
    voice_training_3: {
      icon: 'ooui:error',
      title: t('notifications.types.voice_training_3.title'),
      description: t('notifications.types.voice_training_3.description'),
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-600 dark:text-red-400'
    },

    // Music Generation - Status 1 (Pending)
    music_1: {
      icon: 'i-fa-clock',
      title: t('notifications.types.music_1.title'),
      description: t('notifications.types.music_1.description'),
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400'
    },

    // Music Generation - Status 2 (Success)
    music_2: {
      icon: 'i-fa-check-circle',
      title: t('notifications.types.music_2.title'),
      description: t('notifications.types.music_2.description'),
      color: 'indigo',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },

    // Music Generation - Status 3 (Failed)
    music_3: {
      icon: 'ooui:error',
      title: t('notifications.types.music_3.title'),
      description: t('notifications.types.music_3.description'),
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-600 dark:text-red-400'
    },

    // Speech Generation - Status 1 (Pending)
    speech_1: {
      icon: 'i-fa-clock',
      title: t('notifications.types.speech_1.title'),
      description: t('notifications.types.speech_1.description'),
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400'
    },

    // Speech Generation - Status 2 (Success)
    speech_2: {
      icon: 'i-fa-check-circle',
      title: t('notifications.types.speech_2.title'),
      description: t('notifications.types.speech_2.description'),
      color: 'teal',
      bgColor: 'bg-teal-100 dark:bg-teal-900',
      textColor: 'text-teal-600 dark:text-teal-400'
    },

    // Speech Generation - Status 3 (Failed)
    speech_3: {
      icon: 'ooui:error',
      title: t('notifications.types.speech_3.title'),
      description: t('notifications.types.speech_3.description'),
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-600 dark:text-red-400'
    },

    // Default fallback
    default: {
      icon: 'i-fa-bell',
      title: t('notifications.types.default.title'),
      description: t('notifications.types.default.description'),
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400'
    }
  }

  /**
   * Get notification key by combining event type and status
   */
  const getNotificationKey = (eventType: string, status: number): string => {
    return `${eventType}_${status}`
  }

  /**
   * Get notification configuration by event type and status
   */
  const getNotificationConfig = (eventType: string, status?: number): NotificationTypeConfig => {
    if (status !== undefined) {
      const key = getNotificationKey(eventType, status)
      return notificationTypes[key] || notificationTypes.default || {
        icon: 'i-fa-bell',
        title: 'Notification',
        description: 'You have a new notification',
        color: 'gray',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-600 dark:text-gray-400'
      }
    }
    return notificationTypes[eventType] || notificationTypes.default || {
      icon: 'i-fa-bell',
      title: 'Notification',
      description: 'You have a new notification',
      color: 'gray',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-600 dark:text-gray-400'
    }
  }

  /**
   * Get notification icon by event type and status
   */
  const getNotificationIcon = (eventType: string, status?: number): string => {
    return getNotificationConfig(eventType, status).icon
  }

  /**
   * Get notification title by event type and status
   */
  const getNotificationTitle = (notification: NotificationData): string => {
    return getNotificationConfig(notification.type, notification.status).title
  }

  /**
   * Get notification description by event type and status
   */
  const getNotificationDescription = (notification: NotificationData): string => {
    const baseDescription = getNotificationConfig(notification.type, notification.status).description

    // Get input text from notification data
    const inputText = notification.input_text || notification.prompt || ''

    if (inputText) {
      const truncatedText = truncateText(inputText, 20)
      return `${baseDescription} - "${truncatedText}"`
    }

    return baseDescription
  }

  /**
   * Get notification color scheme by event type and status
   */
  const getNotificationColors = (eventType: string, status?: number) => {
    const config = getNotificationConfig(eventType, status)
    return {
      color: config.color,
      bgColor: config.bgColor,
      textColor: config.textColor
    }
  }

  /**
   * Truncate text to specified length with ellipsis
   */
  const truncateText = (text: string, maxLength: number = 20): string => {
    if (!text || text.length <= maxLength) {
      return text || ''
    }
    return text.substring(0, maxLength) + '...'
  }

  /**
   * Format notification date to human readable format
   */
  const formatNotificationDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return diffInMinutes <= 1 ? t('notifications.time.justNow') : t('notifications.time.minutesAgo', { minutes: diffInMinutes })
    } else if (diffInHours < 24) {
      return t('notifications.time.hoursAgo', { hours: Math.floor(diffInHours) })
    } else if (diffInHours < 48) {
      return t('notifications.time.yesterday')
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  /**
   * Get notification priority based on status
   */
  const getNotificationPriority = (notification: NotificationData): number => {
    const priorityMap: Record<number, number> = {
      3: 1, // failed - highest priority
      2: 2, // success
      1: 3 // pending - lowest priority
    }
    return priorityMap[notification.status] || 3
  }

  /**
   * Check if notification is in error state
   */
  const isNotificationError = (notification: NotificationData): boolean => {
    return notification.status === 3 // failed status
  }

  /**
   * Check if notification is in success state
   */
  const isNotificationSuccess = (notification: NotificationData): boolean => {
    return notification.status === 2 // success status
  }

  /**
   * Check if notification is in pending state
   */
  const isNotificationPending = (notification: NotificationData): boolean => {
    return notification.status === 1 // pending status
  }

  /**
   * Check if notification type is supported
   */
  const isNotificationTypeSupported = (eventType: string, status?: number): boolean => {
    if (status !== undefined) {
      const key = getNotificationKey(eventType, status)
      return key in notificationTypes
    }
    return eventType in notificationTypes
  }

  /**
   * Get all available notification types
   */
  const getAllNotificationTypes = (): string[] => {
    return Object.keys(notificationTypes).filter(type => type !== 'default')
  }

  /**
   * Sort notifications by priority and date
   */
  const sortNotificationsByPriority = (notifications: NotificationData[]): NotificationData[] => {
    return [...notifications].sort((a, b) => {
      const priorityA = getNotificationPriority(a)
      const priorityB = getNotificationPriority(b)

      if (priorityA !== priorityB) {
        return priorityA - priorityB // Lower number = higher priority
      }

      // If same priority, sort by date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }

  return {
    // Type configurations
    notificationTypes,

    // Basic getters
    getNotificationConfig,
    getNotificationKey,

    // Display functions
    getNotificationIcon,
    getNotificationTitle,
    getNotificationDescription,
    getNotificationColors,

    // Utility functions
    isNotificationTypeSupported,
    getAllNotificationTypes,
    formatNotificationDate,
    getNotificationPriority,
    truncateText,

    // State checkers
    isNotificationError,
    isNotificationSuccess,
    isNotificationPending,

    // Sorting
    sortNotificationsByPriority
  }
}
