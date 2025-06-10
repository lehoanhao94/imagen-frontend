<template>
  <div class="flex items-center gap-2">
    <UButton
      variant="outline"
      color="neutral"
      size="sm"
      :label="`${displayValue}x`"
      trailing-icon="i-heroicons-chevron-down-20-solid"
      class="min-w-[80px]"
      @click="isModalOpen = true"
    />

    <!-- Speed Settings Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="$t('speed_settings')"
      :ui="{ content: 'max-w-md' }"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <!-- Input Number -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('speed_value') }}</label>
            <div class="flex items-center gap-2">
              <UInputNumber
                v-model="inputValue"
                :min="speedConfig.min"
                :max="speedConfig.max"
                :step="speedConfig.step"
                size="sm"
                class="flex-1"
                @input="onInputChange"
              />
            </div>
          </div>

          <!-- Slider -->
          <div class="flex flex-col gap-2">
            <label class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ $t('speed_slider') }}</label>
            <USlider
              v-model="localValue"
              :min="speedConfig.min"
              :max="speedConfig.max"
              :step="speedConfig.step"
              class="w-full"
            />
            <div class="flex justify-between text-xs text-gray-400">
              <span>{{ speedConfig.min }}x</span>
              <span>{{ speedConfig.max }}x</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            variant="outline"
            @click="isModalOpen = false"
          >
            {{ $t('cancel') }}
          </UButton>
          <UButton
            @click="isModalOpen = false"
          >
            {{ $t('apply') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { speedConfig, speed } = useSpeechGenModels()

const isModalOpen = ref(false)
const localValue = ref(speed.value)
const inputValue = ref(speed.value)
const displayValue = computed(() => localValue.value.toFixed(2))

// Handle input change
const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)

  if (!isNaN(value) && value >= speedConfig.min && value <= speedConfig.max) {
    localValue.value = value
  }
}

// Watch for changes and update the cookie
watch(localValue, (newValue) => {
  speed.value = Number(newValue)
  inputValue.value = newValue
}, { immediate: true })

// Watch for external changes to speed cookie
watch(speed, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue
    inputValue.value = newValue
  }
}, { immediate: true })

// Watch for input value changes to sync with slider
watch(inputValue, (newValue) => {
  const value = parseFloat(newValue)
  if (!isNaN(value) && value >= speedConfig.min && value <= speedConfig.max) {
    localValue.value = value
  }
})
</script>
