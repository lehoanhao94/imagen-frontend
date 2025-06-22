<template>
  <UDrawer
    v-model:open="openNotificationDrawer"
    :overlay="true"
    :dismissible="false"
    :ui="{ header: 'flex items-center justify-between' }"
    inset
    :handle="false"
    should-scale-background
  >
    <template #content>
      <div class="p-4 space-y-4">
        <UAlert
          :title="$t('Your generation is ready')"
          :description="
            $t(
              'Your AI generation is ready to view. Click to open the details.'
            )
          "
          color="neutral"
          variant="outline"
          orientation="horizontal"
          :actions="[
            {
              label: 'View Details',
              trailingIcon: 'icons8:right-round',
              onClick: () => {
                router.replace({
                  query: {
                    uuid: notificationHistoryUuid
                  }
                });
                openNotificationDrawer = false;
                isNotificationsSlideoverOpen = false;
                showDetailModal = true;
              }
            },
            {
              label: 'See later',
              color: 'neutral',
              variant: 'subtle',
              trailingIcon: 'ion:play-skip-forward-circle-outline',
              onClick: () => {
                openNotificationDrawer = false;
                isNotificationsSlideoverOpen = false;
              }
            }
          ]"
          :avatar="{
            icon: 'line-md:circle-filled-to-confirm-circle-filled-transition'
          }"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
/**
 * Example component showing how to use the notifications store
 * This replaces the complex component logic from the original code
 */

const notificationsStore = useNotificationsStore()
const { openNotificationDrawer, notificationHistoryUuid }
  = storeToRefs(notificationsStore)
const appStore = useAppStore()
const { isNotificationsSlideoverOpen } = storeToRefs(appStore)

const historyStore = useHistoryStore()
const { showDetailModal } = storeToRefs(historyStore)

const router = useRouter()
</script>
