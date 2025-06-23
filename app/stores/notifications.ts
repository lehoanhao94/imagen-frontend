import { defineStore } from 'pinia'
import type { RealtimeChannel } from '@supabase/supabase-js'
import md5 from 'crypto-js/md5'
import { aesDecrypt, parseJson } from '~/utils/crypto'

interface Notification {
  id: string
  user_uuid: string
  event_type: string
  status: number
  seen: boolean
  created_at: string
  data: string
  history_uuid?: string
  redirect_url?: string
  external_order_id?: string
  platform?: string
  [key: string]: any
}

interface NotificationsState {
  notifications: Notification[]
  loading: boolean
  error: any
  isFetching: boolean
  totalCount: number
  limit: number
  range: { from: number, to: number }
  realtimeChannel: RealtimeChannel | null
  openNotificationDrawer: boolean
  notificationHistoryUuid?: string
}

export const useNotificationsStore = defineStore('notificationsStore', {
  state: (): NotificationsState => ({
    notifications: [],
    loading: false,
    error: null,
    isFetching: false,
    totalCount: 0,
    limit: 50,
    range: { from: 0, to: 9 },
    realtimeChannel: null,
    openNotificationDrawer: false,
    notificationHistoryUuid: undefined
  }),

  getters: {
    hasUnreadNotifications: (state) => {
      return state.notifications.some(n => !n.seen)
    },

    showFetchNext: (state) => {
      return state.notifications.length < state.totalCount
    }
  },

  actions: {
    /**
     * Decrypt and parse notification data
     */
    parseNotificationData(notification: any, userEmail: string): Notification {
      const key = md5(userEmail)
      const decrypt = aesDecrypt(notification?.data, key.toString())
      console.log(
        '🚀 ~ parseNotificationData ~ decrypt:',
        parseJson(decrypt?.history)
      )

      return {
        ...notification,
        ...parseJson(decrypt?.history),
        ...parseJson(decrypt?.order_history),
        ...parseJson(decrypt?.block),
        redirect_url: decrypt?.redirect_url
      }
    },

    /**
     * Fetch notifications from Supabase
     */
    async fetchNotifications() {
      this.loading = true
      this.error = null

      try {
        const client = useSupabaseClient()
        const authStore = useAuthStore()
        const { user } = storeToRefs(authStore)
        const runtimeConfig = useRuntimeConfig()
        const notificationsTable = runtimeConfig.public.NUXT_NOTIFICATION_TABLE

        if (!user.value?.uuid || !user.value?.email) {
          throw new Error('User not authenticated')
        }

        // Reset range for fresh fetch
        this.range = { from: 0, to: this.limit - 1 }

        const { data } = await client
          .from(notificationsTable)
          .select('*')
          .eq('user_uuid', user.value.uuid)
          .gt('status', 1)
          .order('created_at', { ascending: false })
          .range(this.range.from, this.range.to)

        this.notifications
          = data?.map((n: any) =>
            this.parseNotificationData(n, user.value!.email)
          ) || []

        // Fetch total count
        const { count } = await client
          .from(notificationsTable)
          .select('id', { count: 'exact', head: true })
          .eq('user_uuid', user.value.uuid)
          .gt('status', 1)

        this.totalCount = count || 0
      } catch (error: any) {
        console.error('Failed to fetch notifications:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch more notifications (pagination)
     */
    async fetchMore() {
      if (this.isFetching || !this.showFetchNext) return

      this.isFetching = true

      try {
        const client = useSupabaseClient()
        const authStore = useAuthStore()
        const { user } = storeToRefs(authStore)
        const runtimeConfig = useRuntimeConfig()
        const notificationsTable = runtimeConfig.public.NUXT_NOTIFICATION_TABLE

        if (!user.value?.uuid || !user.value?.email) {
          throw new Error('User not authenticated')
        }

        this.range = {
          from: this.range.from + this.limit,
          to: this.range.to + this.limit
        }

        const { data } = await client
          .from(notificationsTable)
          .select('*')
          .eq('user_uuid', user.value.uuid)
          .gt('status', 1)
          .order('created_at', { ascending: false })
          .range(this.range.from, this.range.to)

        const parsedData
          = data?.map((n: any) =>
            this.parseNotificationData(n, user.value!.email)
          ) || []

        this.notifications = [...this.notifications, ...parsedData]
      } catch (error: any) {
        console.error('Failed to fetch more notifications:', error)
        this.error = error.message
      } finally {
        this.isFetching = false
      }
    },

    /**
     * Mark a specific notification as read
     */
    async markAsRead(notificationId: string) {
      try {
        // Update local state immediately
        this.notifications = this.notifications.map(n =>
          n.id === notificationId ? { ...n, seen: true } : n
        )

        // Update on server
        await useAPI().apiService.put(
          `/user/read-notification/${notificationId}`
        )
      } catch (error: any) {
        console.error('Failed to mark notification as read:', error)
        this.error = error.message
      }
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead() {
      try {
        // Update local state immediately
        this.notifications = this.notifications.map(n => ({
          ...n,
          seen: true
        }))

        // Update on server
        await useAPI().apiService.put('/user/read-all-notifications')
      } catch (error: any) {
        console.error('Failed to mark all notifications as read:', error)
        this.error = error.message
      }
    },

    /**
     * Setup real-time subscription for notifications
     */
    setupRealtimeSubscription() {
      const client = useSupabaseClient()
      const authStore = useAuthStore()
      const { user } = storeToRefs(authStore)
      const runtimeConfig = useRuntimeConfig()
      const notificationsTable = runtimeConfig.public.NUXT_NOTIFICATION_TABLE

      if (!user.value?.uuid) {
        console.warn(
          'Cannot setup realtime subscription: user not authenticated'
        )
        return
      }

      this.realtimeChannel = client.channel('changes').on(
        'postgres_changes',
        {
          event: 'INSERT',
          table: notificationsTable,
          schema: 'public',
          filter: `user_uuid=eq.${user.value.uuid}`
        },
        (payload: any) => {
          if (payload?.new && payload?.new?.user_uuid === user.value?.uuid) {
            const parsedNotification = this.parseNotificationData(
              payload.new,
              user.value!.email
            )

            // Check if notification already exists
            const existingIndex = this.notifications.findIndex(
              n => n.id === payload.new.id
            )

            if (existingIndex !== -1) {
              // Update existing notification
              this.notifications[existingIndex] = parsedNotification
            } else {
              // Add new notification to the top
              this.notifications.unshift(parsedNotification)
            }

            // Trigger other store updates based on notification status
            this.handleNotificationSideEffects(parsedNotification)
          }
        }
      )

      this.realtimeChannel.subscribe()
    },

    /**
     * Handle side effects when receiving notifications
     */
    handleNotificationSideEffects(notification: Notification) {
      console.log(
        '🚀 ~ handleNotificationSideEffects ~ notification:',
        notification
      )
      const router = useRouter()

      // Handle payment notifications
      if (
        ['2', '8'].includes(String(notification?.status))
        && notification?.platform === 'CRYPTOMUS'
      ) {
        router.push(
          `/profile/thank-you?payment=success&id=${notification?.external_order_id}`
        )
      }
      if (
        ['2'].includes(String(notification?.status))
        && notification?.type === 'video'
      ) {
        this.openNotificationDrawer = true
        this.notificationHistoryUuid = notification?.uuid
      }
      // For other side effects, emit events that components can listen to
      // This allows for loose coupling and prevents dependency on non-existent stores
    },

    /**
     * Handle notification click/detail view
     */
    async handleNotificationDetail(notification: Notification) {
      const historyStory = useHistoryStore()
      const { showDetailModal, historyDetailUuid } = storeToRefs(historyStory)
      const router = useRouter()
      const appStore = useAppStore()

      // Close notification slideover
      appStore.isNotificationsSlideoverOpen = false

      // Navigate based on notification type
      router.replace({
        query: { uuid: notification.history_uuid || notification.uuid }
      })
      historyDetailUuid.value = notification.history_uuid || notification.uuid
      showDetailModal.value = true

      // Mark as read
      await this.markAsRead(notification.id)
    },

    /**
     * Cleanup real-time subscription
     */
    cleanup() {
      if (this.realtimeChannel) {
        const client = useSupabaseClient()
        client.removeChannel(this.realtimeChannel)
        this.realtimeChannel = null
      }
    }
  }
})
