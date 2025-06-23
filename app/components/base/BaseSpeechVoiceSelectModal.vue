<template>
  <div>
    <!-- Button to open Modal -->
    <UButton
      :label="selectedVoice ? selectedVoice.speaker_name : placeholderText"
      :icon="selectedVoice ? 'fluent:person-voice-16-regular' : 'lucide:users'"
      color="neutral"
      variant="outline"
      trailing-icon="lucide:chevron-down"
      class="justify-between"
      :size="props.size"
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
                @click="loadVoices"
              >
                {{ $t("retry") }}
              </UButton>
            </div>
          </div>

          <!-- Voice List -->
          <UCommandPalette
            v-else
            :groups="groups"
            :loading="loading"
            class="flex-1 h-80"
            :placeholder="t('searchVoices')"
            :fuse="{
              resultLimit: 1000
            }"
          >
            <template #voices-leading="{ item }">
              <UAvatar
                :icon="
                  playingVoices.has(item.id) ? 'lucide:pause' : 'lucide:play'
                "
                size="md"
                :ui="{
                  root: 'rounded-lg'
                }"
                @click.stop="togglePlayPreview(item)"
              />
            </template>
            <template #voices-trailing="{ item }">
              <div class="flex items-center gap-2">
                <UButton
                  :label="
                    tempSelectedVoice?.id === item.id
                      ? $t('selected')
                      : $t('select')
                  "
                  variant="ghost"
                  :color="
                    tempSelectedVoice?.id === item.id ? 'primary' : 'neutral'
                  "
                  :class="{
                    'flex': tempSelectedVoice?.id === item.id,
                    'sm:hidden group-hover:flex':
                      tempSelectedVoice?.id !== item.id
                  }"
                  :icon="
                    tempSelectedVoice?.id === item.id
                      ? 'lets-icons:check-fill'
                      : 'ep:right'
                  "
                  @click.stop="onSelectVoice(item)"
                />

                <UButton
                  :icon="
                    updatings?.[item.id]
                      ? 'eos-icons:loading'
                      : item.is_favorite
                        ? 'uis:favorite'
                        : 'uit:favorite'
                  "
                  :color="item.is_favorite ? 'primary' : 'neutral'"
                  variant="ghost"
                  @click="toggleFavorite(item.id, !item.is_favorite)"
                />
              </div>
            </template>
            <template #voices-label="{ item }">
              <div
                class="flex flex-col items-start dark:text-gray-300"
                :class="{
                  'font-bold': tempSelectedVoice?.id === item.id
                }"
                @click="togglePlayPreview(item)"
              >
                {{ item.label }}
                <div
                  class="text-xs text-left text-gray-500 dark:text-gray-600 break-all whitespace-break-spaces"
                >
                  {{ item.suffix }}
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
  modelValue?: SpeechVoice | null
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<BaseSpeechVoiceSelectModalProps>(), {
  modelValue: null,
  placeholder: undefined,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: SpeechVoice | null]
}>()

const { t } = useI18n()
const { voices, loading, error, loadVoices, toggleFavorite, updatings }
  = useSpeechVoices()

// Local state for selected voice
const selectedVoice = computed(() => props.modelValue)
const placeholderText = computed(() => props.placeholder || t('selectVoice'))

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
  return voices.value.filter(
    voice =>
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
    // Emit the new value to parent
    emit('update:modelValue', tempSelectedVoice.value)
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

const groups = computed(() => {
  return [
    {
      id: 'voices',
      label: 'Voices',
      slot: 'voices' as const,
      items: voices.value.map(voice => ({
        label: voice.speaker_name,
        value: voice,
        suffix: voice.description,
        ...voice
      }))
    }
  ]
})

const onSelectVoice = (voice: SpeechVoice) => {
  selectTempVoice(voice)
  confirmSelection()
}
</script>
