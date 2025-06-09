<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium">{{ $t('voice') }}</span>
      <UButton
        v-if="!loading"
        size="xs"
        variant="ghost"
        icon="i-lucide-refresh-cw"
        @click="loadVoices"
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
      v-else-if="voices.length === 0"
      class="text-gray-500 text-sm"
    >
      {{ $t('noVoicesAvailable') }}
    </div>

    <USelect
      v-else
      v-model="selectedVoice"
      :options="voiceOptions"
      option-attribute="label"
      value-attribute="value"
      :placeholder="$t('selectVoice')"
    >
      <template #option="{ option }">
        <div class="flex items-center justify-between w-full">
          <div class="flex flex-col">
            <span class="font-medium">{{ option.speaker_name }}</span>
            <span class="text-xs text-gray-500">
              {{ option.gender }} • {{ option.age }} • {{ option.accent }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <UBadge
              v-if="option.premium"
              size="xs"
              color="amber"
              variant="subtle"
            >
              Premium
            </UBadge>
            <UButton
              v-if="option.sample_audio_path"
              size="xs"
              variant="ghost"
              icon="i-lucide-play"
              @click.stop="playPreview(option.sample_audio_path)"
            />
            <UButton
              size="xs"
              variant="ghost"
              :icon="option.is_favorite ? 'i-lucide-heart-filled' : 'i-lucide-heart'"
              :color="option.is_favorite ? 'red' : 'gray'"
              @click.stop="toggleFavorite(option.id)"
            />
          </div>
        </div>
      </template>
    </USelect>

    <div
      v-if="selectedVoice && selectedVoice.description"
      class="text-xs text-gray-600"
    >
      {{ selectedVoice.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  voices,
  selectedVoice,
  loading,
  error,
  loadVoices,
  toggleFavorite
} = useSpeechVoices()

// Load voices on component mount
onMounted(() => {
  if (voices.length === 0) {
    loadVoices()
  }
})

const voiceOptions = computed(() =>
  voices.map(voice => ({
    label: `${voice.speaker_name} (${voice.gender})`,
    value: voice,
    ...voice
  }))
)

const playPreview = (audioUrl: string) => {
  if (audioUrl) {
    const audio = new Audio(audioUrl)
    audio.play().catch((err) => {
      console.error('Failed to play audio preview:', err)
    })
  }
}
</script>
