<template>
  <UModal v-model="isOpenLocal">
    <UCard>
      <template #header>
        <div class="flex items-center space-x-2">
          <UIcon
            v-if="options?.icon"
            :name="options.icon"
            class="text-warning"
          />
          <h3 class="text-lg font-semibold">
            {{ options?.title }}
          </h3>
        </div>
      </template>

      <p v-if="options?.description" class="mb-4">
        {{ options.description }}
      </p>

      <template #footer>
        <div class="flex justify-between">
          <UButton
            color="gray"
            variant="soft"
            @click="handleCancel"
          >
            {{ options?.cancelText || t('cancel') || 'Cancel' }}
          </UButton>

          <UButton
            color="primary"
            @click="handleConfirm"
          >
            {{ options?.confirmText || t('confirm') || 'Confirm' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { isOpen, options, handleConfirm, handleCancel } = useConfirm()

const isOpenLocal = computed({
  get: () => isOpen.value,
  set: (value: boolean) => {
    if (!value) {
      handleCancel()
    }
  }
})
</script>