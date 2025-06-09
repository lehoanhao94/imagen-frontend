<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium">{{ $t('speed') }}</span>
      <span class="text-sm text-gray-500">{{ displayValue }}x</span>
    </div>
    <URange
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
</template>

<script setup lang="ts">
const { speedConfig, speed } = useSpeechGenModels()

const localValue = ref(speed.value)
const displayValue = computed(() => localValue.value.toFixed(2))

// Watch for changes and update the cookie
watch(localValue, (newValue) => {
  speed.value = Number(newValue)
}, { immediate: true })

// Watch for external changes to speed cookie
watch(speed, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue
  }
}, { immediate: true })
</script>
