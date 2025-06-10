<template>
  <div class="flex items-center gap-2">
    <UButton
      variant="outline"
      color="neutral"
      size="sm"
      icon="i-heroicons-cog-6-tooth"
      @click="isModalOpen = true"
    />

    <!-- Speech Settings Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="$t('speech_settings')"
      :ui="{ content: 'max-w-lg' }"
    >
      <template #body>
        <div class="flex flex-col gap-6">
          <!-- Speed Settings -->
          <div class="flex flex-col gap-3">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ $t("speed") }}
            </h3>
            <div class="flex flex-col gap-3">
              <!-- Input Number -->
              <div class="flex flex-col gap-2">
                <label
                  class="text-xs font-medium text-gray-600 dark:text-gray-300"
                >{{ $t("speed_value") }}</label>
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
                <label
                  class="text-xs font-medium text-gray-600 dark:text-gray-300"
                >{{ $t("speed_slider") }}</label>
                <USlider
                  v-model="localSpeedValue"
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
          </div>

          <!-- Format Settings -->
          <div class="flex flex-col gap-3">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ $t("outputFormat") }}
            </h3>
            <USelectMenu
              v-model="outputFormat"
              :items="outputFormats"
              :placeholder="$t('selectFormat')"
              :search-input="false"
            />
          </div>

          <!-- Channel Settings -->
          <div class="flex flex-col gap-3">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ $t("outputChannel") }}
            </h3>
            <USelectMenu
              v-model="outputChannel"
              :items="outputChannels"
              :placeholder="$t('selectChannel')"
              :search-input="false"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            variant="outline"
            @click="resetToDefaults"
          >
            {{ $t("reset_defaults") }}
          </UButton>
          <UButton
            variant="outline"
            @click="isModalOpen = false"
          >
            {{ $t("cancel") }}
          </UButton>
          <UButton @click="applySettings">
            {{ $t("apply") }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const {
  speedConfig,
  speed,
  outputFormats,
  outputFormat,
  outputChannels,
  outputChannel
} = useSpeechGenModels()

const isModalOpen = ref(false)
const localSpeedValue = ref(speed.value)
const inputValue = ref(speed.value.toString())
const displayValue = computed(() => localSpeedValue.value.toFixed(2))

// Handle input change
const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = parseFloat(target.value)

  if (!isNaN(value) && value >= speedConfig.min && value <= speedConfig.max) {
    localSpeedValue.value = value
  }
}

// Reset to default values
const resetToDefaults = () => {
  localSpeedValue.value = speedConfig.default
  inputValue.value = speedConfig.default.toString()
  // Reset other settings to their defaults if needed
}

// Apply settings and close modal
const applySettings = () => {
  speed.value = Number(localSpeedValue.value)
  isModalOpen.value = false
}

// Watch for changes and sync values
watch(
  localSpeedValue,
  (newValue) => {
    inputValue.value = newValue.toString()
  },
  { immediate: true }
)

// Watch for external changes to speed cookie
watch(
  speed,
  (newValue) => {
    if (newValue !== localSpeedValue.value) {
      localSpeedValue.value = newValue
      inputValue.value = newValue.toString()
    }
  },
  { immediate: true }
)

// Watch for input value changes to sync with slider
watch(inputValue, (newValue) => {
  const value = parseFloat(newValue)
  if (!isNaN(value) && value >= speedConfig.min && value <= speedConfig.max) {
    localSpeedValue.value = value
  }
})
</script>
