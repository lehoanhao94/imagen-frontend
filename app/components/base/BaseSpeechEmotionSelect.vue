<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium">{{ $t('emotion') }}</span>
      <UButton
        v-if="!loading"
        size="xs"
        variant="ghost"
        icon="i-lucide-refresh-cw"
        @click="loadEmotions"
      />
    </div>

    <div
      v-if="loading"
      class="flex items-center justify-center py-4"
    >
      <UIcon
        name="i-lucide-loader"
        class="animate-spin h-5 w-5"
      />
    </div>

    <div
      v-else-if="error"
      class="text-red-500 text-sm"
    >
      {{ error }}
    </div>

    <div
      v-else-if="enabledEmotions.length === 0"
      class="text-gray-500 text-sm"
    >
      {{ $t('noEmotionsAvailable') }}
    </div>

    <USelect
      v-else
      v-model="selectedEmotion"
      :options="emotionOptions"
      option-attribute="label"
      value-attribute="value"
      :placeholder="$t('selectEmotion')"
    >
      <template #option="{ option }">
        <div class="flex items-center justify-between w-full">
          <div class="flex flex-col">
            <span class="font-medium capitalize">{{ option.emotion }}</span>
            <span class="text-xs text-gray-500">{{ option.emotion_long }}</span>
          </div>
          <UButton
            v-if="option.sample_audio"
            size="xs"
            variant="ghost"
            icon="i-lucide-play"
            @click.stop="playPreview(option.sample_audio)"
          />
        </div>
      </template>
    </USelect>

    <div
      v-if="selectedEmotion && selectedEmotion.emotion_long"
      class="text-xs text-gray-600"
    >
      {{ selectedEmotion.emotion_long }}
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  emotions,
  selectedEmotion,
  loading,
  error,
  loadEmotions,
  enabledEmotions
} = useSpeechEmotions()

// Load emotions on component mount
onMounted(() => {
  if (emotions.length === 0) {
    loadEmotions()
  }
})

const emotionOptions = computed(() =>
  enabledEmotions.map(emotion => ({
    label: emotion.emotion.charAt(0).toUpperCase() + emotion.emotion.slice(1),
    value: emotion,
    ...emotion
  }))
)

const playPreview = (audioUrl: string) => {
  if (audioUrl) {
    const audio = new Audio(audioUrl)
    audio.play().catch((err) => {
      console.error('Failed to play emotion preview:', err)
    })
  }
}
</script>
