<template>
  <div>
    <!-- Button to open Modal -->
    <UButton
      :label="selectedVoice ? selectedVoice.speaker_name : $t('selectVoice')"
      :icon="selectedVoice ? 'fluent:person-voice-16-regular' : 'lucide:users'"
      color="neutral"
      variant="outline"
      trailing-icon="lucide:chevron-down"
      class="justify-between"
      v-bind="$attrs"
      @click="openModal"
    />

    <!-- Voice Selection Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="$t('selectVoice')"
      :ui="{ footer: 'justify-end', content: 'max-w-4xl', body: '!p-0' }"
      prevent-close
    >
      <template #body>
        <div class="flex flex-col h-[70vh]">
          <!-- Search Input -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <UInput
              v-model="searchQuery"
              :placeholder="$t('searchVoices')"
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
                @click="loadVoices"
              >
                {{ $t('retry') }}
              </UButton>
            </div>
          </div>

          <!-- Voice List -->
          <div
            v-else
            class="flex-1 overflow-y-auto p-4"
          >
            <div
              v-if="filteredVoices.length === 0"
              class="flex items-center justify-center py-12 text-gray-500"
            >
              <div class="text-center">
                <UIcon
                  name="i-lucide-search-x"
                  class="w-8 h-8 mx-auto mb-2 opacity-50"
                />
                <p>{{ $t('noVoicesFound') }}</p>
              </div>
            </div>

            <div
              v-else
              class="space-y-3"
            >
              <UCard
                v-for="voice in filteredVoices"
                :key="voice.id"
                class="cursor-pointer transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
                :class="{
                  'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950':
                    tempSelectedVoice?.id === voice.id,
                  'hover:bg-gray-50 dark:hover:bg-gray-800':
                    tempSelectedVoice?.id !== voice.id
                }"
                tabindex="0"
                @click="selectTempVoice(voice)"
                @keydown.enter="selectTempVoice(voice)"
                @keydown.space.prevent="selectTempVoice(voice)"
              >
                <div class="flex items-center gap-4">
                  <!-- Avatar -->
                  <UAvatar
                    :alt="voice.speaker_name"
                    size="lg"
                    :ui="{ background: voice.gender === 'male' ? 'bg-blue-500' : voice.gender === 'female' ? 'bg-pink-500' : 'bg-gray-500' }"
                  >
                    <template #default>
                      <UIcon
                        :name="voice.gender === 'male' ? 'lucide:user' : voice.gender === 'female' ? 'lucide:user-heart' : 'lucide:user'"
                        class="w-6 h-6 text-white"
                      />
                    </template>
                  </UAvatar>

                  <!-- Voice Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-semibold text-sm truncate">
                        {{ voice.speaker_name }}
                      </h3>
                      <UBadge
                        v-if="voice.premium"
                        size="xs"
                        color="amber"
                        variant="subtle"
                      >
                        Premium
                      </UBadge>
                    </div>
                    <div class="text-xs text-gray-500 space-y-1">
                      <div>{{ voice.gender }} • {{ voice.age }} • {{ voice.accent }}</div>
                      <div
                        v-if="voice.description"
                        class="truncate"
                      >
                        {{ voice.description }}
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <!-- Favorite Button -->
                    <UButton
                      size="sm"
                      variant="ghost"
                      :icon="voice.is_favorite ? 'lucide:heart' : 'lucide:heart'"
                      :color="voice.is_favorite ? 'red' : 'gray'"
                      :class="{ 'text-red-500': voice.is_favorite }"
                      @click.stop="toggleFavorite(voice.id)"
                    />

                    <!-- Play Preview Button -->
                    <UButton
                      v-if="voice.sample_audio_path"
                      size="sm"
                      variant="ghost"
                      :icon="playingVoices.has(voice.id) ? 'lucide:square' : 'lucide:play'"
                      color="primary"
                      :disabled="!voice.sample_audio_path"
                      @click.stop="togglePlayPreview(voice)"
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
          :disabled="!tempSelectedVoice"
          @click="confirmSelection"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { SpeechVoice } from '~/composables/useSpeechVoices'

interface BaseSpeechVoiceSelectModalProps {
  // No modelValue needed - we'll use composable state directly
}

const props = defineProps<BaseSpeechVoiceSelectModalProps>()

// No emit needed - using composable state directly

const { t } = useI18n()
const {
  voices,
  selectedVoice,
  loading,
  error,
  loadVoices,
  toggleFavorite
} = useSpeechVoices()

// Modal state
const isModalOpen = ref(false)
const tempSelectedVoice = ref<SpeechVoice | null>(null)
const searchQuery = ref('')
const playingVoices = ref<Set<string>>(new Set())
const currentAudio = ref<HTMLAudioElement | null>(null)

// Filtered voices based on search
const filteredVoices = computed(() => {
  if (!searchQuery.value) return voices.value

  const query = searchQuery.value.toLowerCase()
  return voices.value.filter(voice =>
    voice.speaker_name.toLowerCase().includes(query)
    || voice.gender.toLowerCase().includes(query)
    || voice.accent.toLowerCase().includes(query)
    || voice.description?.toLowerCase().includes(query)
  )
})

// Modal functions
const openModal = () => {
  tempSelectedVoice.value = selectedVoice.value
  isModalOpen.value = true
  searchQuery.value = ''

  // Load voices if not loaded
  if (voices.value.length === 0) {
    loadVoices()
  }
}

const cancelSelection = () => {
  tempSelectedVoice.value = selectedVoice.value
  isModalOpen.value = false
  stopAllAudio()
}

const confirmSelection = () => {
  if (tempSelectedVoice.value) {
    // Update the composable state directly
    selectedVoice.value = tempSelectedVoice.value
  }
  isModalOpen.value = false
  stopAllAudio()
}

const selectTempVoice = (voice: SpeechVoice) => {
  tempSelectedVoice.value = voice
}

// Audio functions
const stopAllAudio = () => {
  if (currentAudio.value) {
    currentAudio.value.pause()
    currentAudio.value = null
  }
  playingVoices.value.clear()
}

const togglePlayPreview = (voice: SpeechVoice) => {
  if (!voice.sample_audio_path) return

  // If this voice is currently playing, stop it
  if (playingVoices.value.has(voice.id)) {
    stopAllAudio()
    return
  }

  // Stop any currently playing audio
  stopAllAudio()

  try {
    const audio = new Audio(voice.sample_audio_path)
    currentAudio.value = audio
    playingVoices.value.add(voice.id)

    audio.addEventListener('ended', () => {
      playingVoices.value.delete(voice.id)
      if (currentAudio.value === audio) {
        currentAudio.value = null
      }
    })

    audio.addEventListener('error', () => {
      playingVoices.value.delete(voice.id)
      if (currentAudio.value === audio) {
        currentAudio.value = null
      }
    })

    audio.play().catch((err) => {
      console.error('Failed to play audio preview:', err)
      playingVoices.value.delete(voice.id)
      if (currentAudio.value === audio) {
        currentAudio.value = null
      }
    })
  } catch (err) {
    console.error('Failed to create audio element:', err)
    playingVoices.value.delete(voice.id)
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
