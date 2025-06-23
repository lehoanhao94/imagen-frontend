<template>
  <div>
    <!-- Button to open Modal -->
    <UButton
      :label="selectedEmotion ? selectedEmotion.emotion : placeholderText"
      :icon="selectedEmotion ? 'lucide:smile' : 'lucide:meh'"
      color="neutral"
      variant="outline"
      trailing-icon="lucide:chevron-down"
      class="justify-between"
      :size="props.size"
      v-bind="$attrs"
      @click="openModal"
    />

    <!-- Emotion Selection Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="$t('selectEmotion')"
      :ui="{ footer: 'justify-end', content: 'max-w-4xl', body: '!p-0' }"
      prevent-close
    >
      <template #content>
        <div class="flex flex-col h-[70vh]">
          <!-- Error State -->
          <div
            v-if="error"
            class="flex items-center justify-center py-12 text-red-500"
          >
            <div class="text-center">
              <UIcon
                name="i-lucide-alert-circle"
                class="w-8 h-8 mx-auto mb-2"
              />
              <p>{{ error }}</p>
              <UButton
                size="sm"
                variant="outline"
                class="mt-2"
                @click="loadEmotions"
              >
                {{ $t("retry") }}
              </UButton>
            </div>
          </div>

          <!-- Emotion List -->
          <UCommandPalette
            v-else
            :groups="groups"
            :loading="loading"
            class="flex-1 h-80"
            :placeholder="t('searchEmotions')"
            :fuse="{
              resultLimit: 1000
            }"
          >
            <template #emotions-leading="{ item }">
              <UAvatar
                :icon="
                  playingEmotions.has(item.emotion_key)
                    ? 'lucide:pause'
                    : 'lucide:play'
                "
                size="md"
                :ui="{
                  root: 'rounded-lg',
                  background: getEmotionColor(item.emotion_key)
                }"
                @click.stop="togglePlayPreview(item)"
              >
                <template #default>
                  <UIcon
                    :name="getEmotionIcon(item.emotion_key)"
                    class="w-4 h-4 text-white"
                  />
                </template>
              </UAvatar>
            </template>
            <template #emotions-trailing="{ item }">
              <div class="flex items-center gap-2">
                <UButton
                  :label="
                    tempSelectedEmotion?.emotion_key === item.emotion_key
                      ? $t('selected')
                      : $t('select')
                  "
                  variant="ghost"
                  :color="
                    tempSelectedEmotion?.emotion_key === item.emotion_key
                      ? 'primary'
                      : 'neutral'
                  "
                  :class="{
                    'flex': tempSelectedEmotion?.emotion_key === item.emotion_key,
                    'sm:hidden group-hover:flex':
                      tempSelectedEmotion?.emotion_key !== item.emotion_key
                  }"
                  :icon="
                    tempSelectedEmotion?.emotion_key === item.emotion_key
                      ? 'lets-icons:check-fill'
                      : 'ep:right'
                  "
                  @click.stop="onSelectEmotion(item)"
                />

                <UButton
                  v-if="item.sample_audio"
                  :icon="
                    playingEmotions.has(item.emotion_key)
                      ? 'lucide:square'
                      : 'lucide:play'
                  "
                  color="primary"
                  variant="ghost"
                  @click="togglePlayPreview(item)"
                />
                <UButton
                  v-else
                  icon="lucide:volume-x"
                  color="gray"
                  variant="ghost"
                  disabled
                  :title="$t('noAudioSample')"
                />
              </div>
            </template>
            <template #emotions-label="{ item }">
              <div
                class="flex flex-col items-start dark:text-gray-300"
                :class="{
                  'font-bold':
                    tempSelectedEmotion?.emotion_key === item.emotion_key
                }"
                @click="togglePlayPreview(item)"
              >
                {{ $t(item.label || "") }}
                <div
                  class="text-xs text-left text-gray-500 dark:text-gray-600 break-all whitespace-break-spaces"
                >
                  {{ $t(item.suffix || "") }}
                </div>
              </div>
            </template>
          </UCommandPalette>
        </div>
      </template>

      <template #footer>
        <UButton
          :label="$t('cancel')"
          color="neutral"
          variant="outline"
          @click="cancelSelection"
        />
        <UButton
          :label="$t('confirm')"
          color="primary"
          :disabled="!tempSelectedEmotion"
          @click="confirmSelection"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { SpeechEmotion } from '~/composables/useSpeechEmotions'

interface BaseSpeechEmotionSelectModalProps {
  modelValue?: SpeechEmotion | null
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<BaseSpeechEmotionSelectModalProps>(), {
  modelValue: null,
  placeholder: undefined,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: SpeechEmotion | null]
}>()

const { t } = useI18n()
const {
  emotions,
  loading,
  error,
  loadEmotions,
  enabledEmotions,
  selectEmotion,
  selectedEmotion: composableSelectedEmotion
} = useSpeechEmotions()

// Local state for selected emotion - fallback to composable state for backward compatibility
const selectedEmotion = computed(
  () => props.modelValue || composableSelectedEmotion.value
)
const placeholderText = computed(() => props.placeholder || t('selectEmotion'))

// Modal state
const isModalOpen = ref(false)
const tempSelectedEmotion = ref<SpeechEmotion | null>(null)
const playingEmotions = ref<Set<string>>(new Set())
const currentAudio = ref<HTMLAudioElement | null>(null)

// Groups for UCommandPalette
const groups = computed(() => {
  return [
    {
      id: 'emotions',
      label: 'Emotions',
      slot: 'emotions' as const,
      items: enabledEmotions.value.map(emotion => ({
        label: emotion.emotion,
        value: emotion,
        suffix: emotion.emotion_long,
        ...emotion
      }))
    }
  ]
})

// Emotion styling helpers
const getEmotionColor = (emotionKey: string): string => {
  const colorMap: Record<string, string> = {
    happy: 'bg-yellow-500',
    sad: 'bg-blue-500',
    angry: 'bg-red-500',
    excited: 'bg-orange-500',
    calm: 'bg-green-500',
    neutral: 'bg-gray-500',
    casual: 'bg-indigo-500',
    professional: 'bg-purple-500',
    energetic: 'bg-pink-500',
    gentle: 'bg-teal-500'
  }
  return colorMap[emotionKey] || 'bg-gray-500'
}

const getEmotionIcon = (emotionKey: string): string => {
  const iconMap: Record<string, string> = {
    happy: 'lucide:smile',
    sad: 'lucide:frown',
    angry: 'lucide:angry',
    excited: 'lucide:zap',
    calm: 'lucide:leaf',
    neutral: 'lucide:meh',
    casual: 'lucide:coffee',
    professional: 'lucide:briefcase',
    energetic: 'lucide:activity',
    gentle: 'lucide:heart'
  }
  return iconMap[emotionKey] || 'lucide:circle'
}

// Modal functions
const openModal = () => {
  tempSelectedEmotion.value = selectedEmotion.value
  isModalOpen.value = true

  // Load emotions if not loaded
  if (emotions.value.length === 0) {
    loadEmotions()
  }
}

const cancelSelection = () => {
  tempSelectedEmotion.value = selectedEmotion.value
  isModalOpen.value = false
  stopAllAudio()
}

const confirmSelection = () => {
  if (tempSelectedEmotion.value) {
    // Update composable state for backward compatibility
    selectEmotion(tempSelectedEmotion.value)
    // Emit the new value to parent
    emit('update:modelValue', tempSelectedEmotion.value)
  }
  isModalOpen.value = false
  stopAllAudio()
}

const selectTempEmotion = (emotion: SpeechEmotion) => {
  tempSelectedEmotion.value = emotion
}

const onSelectEmotion = (emotion: SpeechEmotion) => {
  selectTempEmotion(emotion)
  confirmSelection()
}

// Audio functions
const stopAllAudio = () => {
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value = null
  }
  playingEmotions.value.clear()
}

const togglePlayPreview = (emotion: SpeechEmotion) => {
  if (!emotion.sample_audio) return

  // If this emotion is currently playing, stop it
  if (playingEmotions.value.has(emotion.emotion_key)) {
    stopAllAudio()
    return
  }

  // Stop any currently playing audio
  stopAllAudio()

  try {
    const audio = new Audio(emotion.sample_audio)
    currentAudio.value = audio
    playingEmotions.value.add(emotion.emotion_key)

    audio.addEventListener('ended', () => {
      playingEmotions.value.delete(emotion.emotion_key)
      if (currentAudio.value === audio) {
        currentAudio.value = null
      }
    })

    audio.addEventListener('error', () => {
      playingEmotions.value.delete(emotion.emotion_key)
      if (currentAudio.value === audio) {
        currentAudio.value = null
      }
    })

    audio.play().catch((err) => {
      console.error('Failed to play audio preview:', err)
      playingEmotions.value.delete(emotion.emotion_key)
      if (currentAudio.value === audio) {
        currentAudio.value = null
      }
    })
  } catch (err) {
    console.error('Failed to create audio element:', err)
    playingEmotions.value.delete(emotion.emotion_key)
  }
}

// Cleanup on unmount
onUnmounted(() => {
  stopAllAudio()
})

// Stop audio when modal closes
watch(isModalOpen, (isOpen) => {
  if (!isOpen) {
    stopAllAudio()
  }
})
</script>
