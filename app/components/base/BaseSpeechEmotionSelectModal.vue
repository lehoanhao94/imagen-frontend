<template>
  <div>
    <!-- Button to open Modal -->
    <UButton
      :label="selectedEmotion ? selectedEmotion.emotion : $t('selectEmotion')"
      :icon="selectedEmotion ? 'lucide:smile' : 'lucide:meh'"
      color="neutral"
      variant="outline"
      trailing-icon="lucide:chevron-down"
      class="justify-between"
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
      <template #body>
        <div class="flex flex-col h-[70vh]">
          <!-- Search Input -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <UInput
              v-model="searchQuery"
              :placeholder="$t('searchEmotions')"
              icon="lucide:search"
              class="w-full"
            />
          </div>

          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex items-center justify-center py-12"
          >
            <UIcon
              name="i-lucide-loader"
              class="animate-spin h-8 w-8 text-primary"
            />
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
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
                {{ $t('retry') }}
              </UButton>
            </div>
          </div>

          <!-- Emotion List -->
          <div
            v-else
            class="flex-1 overflow-y-auto p-4"
          >
            <div
              v-if="filteredEmotions.length === 0"
              class="flex items-center justify-center py-12 text-gray-500"
            >
              <div class="text-center">
                <UIcon
                  name="i-lucide-search-x"
                  class="w-8 h-8 mx-auto mb-2 opacity-50"
                />
                <p>{{ $t('noEmotionsFound') }}</p>
              </div>
            </div>

            <div
              v-else
              class="space-y-3"
            >
              <UCard
                v-for="emotion in filteredEmotions"
                :key="emotion.emotion_key"
                class="cursor-pointer transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                :class="{
                  'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950':
                    tempSelectedEmotion?.emotion_key === emotion.emotion_key,
                  'hover:bg-gray-50 dark:hover:bg-gray-800':
                    tempSelectedEmotion?.emotion_key !== emotion.emotion_key
                }"
                tabindex="0"
                @click="selectTempEmotion(emotion)"
                @keydown.enter="selectTempEmotion(emotion)"
                @keydown.space.prevent="selectTempEmotion(emotion)"
              >
                <div class="flex items-center gap-4">
                  <!-- Avatar/Icon -->
                  <UAvatar
                    :alt="emotion.emotion"
                    size="lg"
                    :ui="{ background: getEmotionColor(emotion.emotion_key) }"
                  >
                    <template #default>
                      <UIcon
                        :name="getEmotionIcon(emotion.emotion_key)"
                        class="w-6 h-6 text-white"
                      />
                    </template>
                  </UAvatar>

                  <!-- Emotion Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-semibold text-sm capitalize">
                        {{ emotion.emotion }}
                      </h3>
                    </div>
                    <div class="text-xs text-gray-500">
                      <div
                        v-if="emotion.emotion_long"
                        class="line-clamp-2"
                      >
                        {{ emotion.emotion_long }}
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <!-- Play Preview Button -->
                    <UButton
                      v-if="emotion.sample_audio"
                      size="sm"
                      variant="ghost"
                      :icon="playingEmotions.has(emotion.emotion_key) ? 'lucide:square' : 'lucide:play'"
                      color="primary"
                      @click.stop="togglePlayPreview(emotion)"
                    />
                    <UButton
                      v-else
                      size="sm"
                      variant="ghost"
                      icon="lucide:volume-x"
                      color="gray"
                      disabled
                      :title="$t('noAudioSample')"
                    />
                  </div>
                </div>
              </UCard>
            </div>
          </div>
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
  // No modelValue needed - we'll use composable state directly
}

const props = defineProps<BaseSpeechEmotionSelectModalProps>()

// No emit needed - using composable state directly

const { t } = useI18n()
const {
  emotions,
  selectedEmotion,
  loading,
  error,
  loadEmotions,
  enabledEmotions
} = useSpeechEmotions()

// Modal state
const isModalOpen = ref(false)
const tempSelectedEmotion = ref<SpeechEmotion | null>(null)
const searchQuery = ref('')
const playingEmotions = ref<Set<string>>(new Set())
const currentAudio = ref<HTMLAudioElement | null>(null)

// Filtered emotions based on search
const filteredEmotions = computed(() => {
  const emotionsToFilter = enabledEmotions.value
  
  if (!searchQuery.value) return emotionsToFilter

  const query = searchQuery.value.toLowerCase()
  return emotionsToFilter.filter(emotion =>
    emotion.emotion.toLowerCase().includes(query) ||
    emotion.emotion_long?.toLowerCase().includes(query)
  )
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
  searchQuery.value = ''
  
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
    // Update the composable state directly
    selectedEmotion.value = tempSelectedEmotion.value
  }
  isModalOpen.value = false
  stopAllAudio()
}

const selectTempEmotion = (emotion: SpeechEmotion) => {
  tempSelectedEmotion.value = emotion
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