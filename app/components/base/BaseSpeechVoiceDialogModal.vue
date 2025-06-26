<template>
  <div>
    <!-- Button to open Modal -->
    <UButton
      :label="buttonLabel"
      icon="fluent:person-voice-16-regular"
      color="neutral"
      variant="outline"
      trailing-icon="lucide:chevron-down"
      class="justify-between"
      :size="props.size"
      v-bind="$attrs"
      @click="openModal"
    />

    <!-- Voice Assignment Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="$t('assignVoicesToSpeakers')"
      :ui="{ footer: 'justify-end', content: 'max-w-5xl', body: '!p-0' }"
      prevent-close
    >
      <template #content>
        <div class="flex flex-col h-[70vh]">
          <!-- Speakers and Voice Assignment Section -->
          <div class="flex flex-col md:flex-row h-full">
            <!-- Speakers List -->
            <div class="w-full md:w-1/2 border-r border-gray-200 dark:border-gray-700">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold">
                  {{ $t('speakers') }}
                </h3>
                <UButton
                  size="sm"
                  icon="lucide:plus"
                  :label="$t('addSpeaker')"
                  class="mt-2"
                  @click="addNewSpeaker"
                />
              </div>
              <div
                class="p-4 space-y-3 overflow-y-auto"
                style="max-height: calc(70vh - 100px)"
              >
                <div
                  v-for="(speaker, index) in localSpeakers"
                  :key="index"
                  class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  :class="{
                    'ring-2 ring-primary-500': selectedSpeakerIndex === index
                  }"
                >
                  <div
                    class="flex-1 cursor-pointer"
                    @click="selectSpeaker(index)"
                  >
                    <div class="font-medium">
                      {{ speaker.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ speaker.voice.name || $t('noVoiceAssigned') }}
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <UButton
                      size="xs"
                      icon="lucide:edit"
                      variant="ghost"
                      @click="editSpeaker(index)"
                    />
                    <UButton
                      size="xs"
                      icon="lucide:trash"
                      variant="ghost"
                      color="red"
                      @click="removeSpeaker(index)"
                    />
                  </div>
                </div>
                <div
                  v-if="localSpeakers.length === 0"
                  class="text-center text-gray-500 dark:text-gray-400 py-8"
                >
                  {{ $t('noSpeakersAdded') }}
                </div>
              </div>
            </div>

            <!-- Voices List -->
            <div class="w-full md:w-1/2">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold">
                  {{ $t('voices') }}
                </h3>
                <div
                  v-if="selectedSpeakerIndex !== null"
                  class="text-sm text-gray-600 dark:text-gray-300 mt-1"
                >
                  {{ $t('assignVoiceToSpeaker', { speaker: localSpeakers[selectedSpeakerIndex]?.name }) }}
                </div>
              </div>

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
                class="flex-1"
                style="height: calc(70vh - 100px)"
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
                        isVoiceAssignedToSelectedSpeaker(item)
                          ? $t('assigned')
                          : $t('assign')
                      "
                      variant="ghost"
                      :color="
                        isVoiceAssignedToSelectedSpeaker(item) ? 'primary' : 'neutral'
                      "
                      :class="{
                        'flex': isVoiceAssignedToSelectedSpeaker(item),
                        'sm:hidden group-hover:flex':
                          !isVoiceAssignedToSelectedSpeaker(item)
                      }"
                      :icon="
                        isVoiceAssignedToSelectedSpeaker(item)
                          ? 'lets-icons:check-fill'
                          : 'ep:right'
                      "
                      :disabled="selectedSpeakerIndex === null"
                      @click.stop="assignVoiceToSpeaker(item)"
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
          @click="confirmSelection"
        />
      </template>
    </UModal>

    <!-- Speaker Name Edit Modal -->
    <UModal
      v-model:open="isEditSpeakerModalOpen"
      :title="$t('editSpeaker')"
      prevent-close
    >
      <template #content>
        <div class="p-4">
          <UFormField :label="$t('speakerName')">
            <UInput
              v-model="editingSpeakerName"
              :placeholder="$t('enterSpeakerName')"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <UButton
          :label="$t('cancel')"
          color="neutral"
          variant="outline"
          @click="cancelEditSpeaker"
        />
        <UButton
          :label="$t('save')"
          color="primary"
          :disabled="!editingSpeakerName.trim()"
          @click="saveEditSpeaker"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { SpeechVoice } from '~/composables/useSpeechVoices'

interface SpeakerItem {
  name: string
  voice: {
    id: string
    name: string
  }
}

interface BaseSpeechVoiceDialogModalProps {
  modelValue?: SpeakerItem[]
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<BaseSpeechVoiceDialogModalProps>(), {
  modelValue: () => [],
  placeholder: undefined,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: SpeakerItem[]]
}>()

const { t } = useI18n()
const { voices, loading, error, loadVoices, toggleFavorite, updatings }
  = useSpeechVoices()

// Local state
const localSpeakers = ref<SpeakerItem[]>([...props.modelValue])
const selectedSpeakerIndex = ref<number | null>(null)
const isModalOpen = ref(false)
const isEditSpeakerModalOpen = ref(false)
const editingSpeakerIndex = ref<number | null>(null)
const editingSpeakerName = ref('')

// Audio state
const playingVoices = ref<Set<string>>(new Set())
const currentAudio = ref<HTMLAudioElement | null>(null)

// Computed
const buttonLabel = computed(() => {
  if (localSpeakers.value.length === 0) {
    return props.placeholder || t('assignVoices')
  }
  const assignedCount = localSpeakers.value.filter(s => s.voice.id).length
  return t('speakersWithVoices', { assigned: assignedCount, total: localSpeakers.value.length })
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

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  localSpeakers.value = [...newValue]
}, { deep: true })

// Modal functions
const openModal = () => {
  isModalOpen.value = true

  // Load voices if not loaded
  if (voices.value.length === 0) {
    loadVoices()
  }
}

const cancelSelection = () => {
  localSpeakers.value = [...props.modelValue]
  selectedSpeakerIndex.value = null
  isModalOpen.value = false
  stopAllAudio()
}

const confirmSelection = () => {
  emit('update:modelValue', [...localSpeakers.value])
  selectedSpeakerIndex.value = null
  isModalOpen.value = false
  stopAllAudio()
}

// Speaker management
const addNewSpeaker = () => {
  const newSpeaker: SpeakerItem = {
    name: `${t('speaker')} ${localSpeakers.value.length + 1}`,
    voice: { id: '', name: '' }
  }
  localSpeakers.value.push(newSpeaker)
  selectedSpeakerIndex.value = localSpeakers.value.length - 1
}

const selectSpeaker = (index: number) => {
  selectedSpeakerIndex.value = index
}

const removeSpeaker = (index: number) => {
  localSpeakers.value.splice(index, 1)
  if (selectedSpeakerIndex.value === index) {
    selectedSpeakerIndex.value = null
  } else if (selectedSpeakerIndex.value !== null && selectedSpeakerIndex.value > index) {
    selectedSpeakerIndex.value -= 1
  }
}

const editSpeaker = (index: number) => {
  editingSpeakerIndex.value = index
  editingSpeakerName.value = localSpeakers.value[index].name
  isEditSpeakerModalOpen.value = true
}

const cancelEditSpeaker = () => {
  editingSpeakerIndex.value = null
  editingSpeakerName.value = ''
  isEditSpeakerModalOpen.value = false
}

const saveEditSpeaker = () => {
  if (editingSpeakerIndex.value !== null && editingSpeakerName.value.trim()) {
    localSpeakers.value[editingSpeakerIndex.value].name = editingSpeakerName.value.trim()
    cancelEditSpeaker()
  }
}

// Voice assignment
const assignVoiceToSpeaker = (voice: SpeechVoice) => {
  if (selectedSpeakerIndex.value !== null) {
    localSpeakers.value[selectedSpeakerIndex.value].voice = {
      id: voice.id,
      name: voice.speaker_name
    }
  }
}

const isVoiceAssignedToSelectedSpeaker = (voice: SpeechVoice) => {
  if (selectedSpeakerIndex.value === null) return false
  return localSpeakers.value[selectedSpeakerIndex.value].voice.id === voice.id
}

// Audio functions (same as original modal)
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
