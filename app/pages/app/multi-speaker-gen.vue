<script setup lang="ts">
const { model, models, speed, outputFormat, outputChannel }
  = useSpeechGenModels()
const { selectedEmotion } = useSpeechEmotions()
const toast = useToast()

<<<<<<< copilot/fix-109
definePageMeta({
  middleware: 'auth'
})

const dialogToSpeechStore = useDialogToSpeechStore()
=======
>>>>>>> develop
const textToSpeechStore = useTextToSpeechStore()
const { t } = useI18n()
const {
  dialogs,
  speakers
} = storeToRefs(dialogToSpeechStore)

const {
  loadings
} = storeToRefs(textToSpeechStore)

// Local reactive variables for UI
const currentDialogText = ref('')
const selectedSpeakers = ref([])

// Watch for changes in selectedSpeakers and sync with store
watch(selectedSpeakers, (newSpeakers) => {
  // Clear existing speakers and add new ones
  dialogToSpeechStore.clearSpeakers()
  newSpeakers.forEach((speaker) => {
    dialogToSpeechStore.addSpeaker(speaker)
  })
}, { deep: true })

const onGenerate = async () => {
  if (!dialogToSpeechStore.hasDialogs || !dialogToSpeechStore.hasSpeakers) {
    toast.add({
      id: 'error',
      title: 'Validation Error',
      description: 'Please add at least one speaker and one dialog before generating.',
      color: 'error'
    })
    return
  }

  const speechData = await dialogToSpeechStore.generateDialogSpeech({
    model: model.value.value,
    emotion: selectedEmotion.value?.emotion_key,
    speed: speed.value,
    output_format: outputFormat.value,
    output_channel: outputChannel.value
  })

  if (speechData) {
    // Use the text-to-speech store to make the actual API call
    const textToSpeechStore = useTextToSpeechStore()
    const result = await textToSpeechStore.textToSpeech(speechData)

    if (result) {
      toast.add({
        id: 'success',
        title: 'Dialog Speech Generation',
        description: 'Your multi-speaker dialog is being generated. Please check back later.',
        color: 'success'
      })
    }
  }
}

const addDialog = () => {
  if (!currentDialogText.value.trim()) {
    toast.add({
      id: 'error',
      title: 'Validation Error',
      description: 'Please enter dialog text before adding.',
      color: 'error'
    })
    return
  }

  if (speakers.value.length === 0) {
    toast.add({
      id: 'error',
      title: 'Validation Error',
      description: 'Please add at least one speaker before adding dialogs.',
      color: 'error'
    })
    return
  }

  dialogToSpeechStore.addDialog({
    speakerIndex: 0, // Default to first speaker
    input: currentDialogText.value.trim()
  })

  currentDialogText.value = ''
}

const removeDialog = (index: number) => {
  dialogToSpeechStore.removeDialog(index)
}

const updateDialogSpeaker = (dialogIndex: number, speakerIndex: number) => {
  const dialog = dialogs.value[dialogIndex]
  if (dialog) {
    dialogToSpeechStore.updateDialog(dialogIndex, {
      ...dialog,
      speakerIndex
    })
  }
}

const updateDialogText = (dialogIndex: number, text: string) => {
  const dialog = dialogs.value[dialogIndex]
  if (dialog) {
    dialogToSpeechStore.updateDialog(dialogIndex, {
      ...dialog,
      input: text
    })
  }
}
</script>

<template>
  <UContainer class="mt-0">
    <Motion
      :initial="{
        scale: 1.1,
        opacity: 0,
        filter: 'blur(20px)'
      }"
      :animate="{
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)'
      }"
      :transition="{
        duration: 0.6,
        delay: 0.3
      }"
    >
      <!-- Speakers Configuration -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4">
          {{ $t('speakers') }}
        </h2>
        <BaseSpeechVoiceDialogModal
          v-model="selectedSpeakers"
          size="md"
          :placeholder="$t('assignVoices')"
        />
      </div>

      <!-- Dialogs Input -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4">
          {{ $t('dialogs') }}
        </h2>

        <!-- Current Dialogs List -->
        <div
          v-if="dialogs.length > 0"
          class="space-y-3 mb-4"
        >
          <div
            v-for="(dialog, index) in dialogs"
            :key="index"
            class="flex gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <USelect
                  :model-value="dialog.speakerIndex"
                  :options="speakers.map((speaker, idx) => ({ label: speaker.name, value: idx }))"
                  :placeholder="$t('selectSpeaker')"
                  size="sm"
                  @update:model-value="updateDialogSpeaker(index, $event)"
                />
                <UButton
                  size="xs"
                  icon="lucide:trash"
                  variant="ghost"
                  color="red"
                  @click="removeDialog(index)"
                />
              </div>
              <UTextarea
                :model-value="dialog.input"
                :placeholder="$t('enterDialogText')"
                @update:model-value="updateDialogText(index, $event)"
              />
            </div>
          </div>
        </div>

        <!-- Add New Dialog -->
        <UChatPrompt
          v-model="currentDialogText"
          :placeholder="$t('enterDialogText')"
          :maxrows="3"
          @submit="addDialog"
        >
          <UChatPromptSubmit
            color="primary"
            :label="$t('addDialog')"
            class="bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600 cursor-pointer"
            icon="icons8:plus"
          />
        </UChatPrompt>
      </div>
    </Motion>

    <Motion
      :initial="{
        scale: 1.1,
        opacity: 0,
        filter: 'blur(20px)'
      }"
      :animate="{
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)'
      }"
      :transition="{
        duration: 0.6,
        delay: 0.5
      }"
    >
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
        <!-- Model Selection -->
        <UFormField :label="$t('modelPreset')">
          <BaseModelSelect
            v-model="model"
            :models="models"
            class="w-full"
          />
        </UFormField>

        <!-- Emotion Selection -->
        <UFormField
          v-if="model?.options?.includes('emotion')"
          :label="$t('emotion')"
        >
          <BaseSpeechEmotionSelectModal
            v-model="selectedEmotion"
            size="sm"
          />
        </UFormField>

        <!-- Speech Settings -->
        <UFormField
          v-if="model?.options?.some((option: string) => ['speed', 'outputFormat', 'outputChannel'].includes(option))"
          :label="$t('settings')"
        >
          <BaseSpeechSettingsModal />
        </UFormField>
      </div>

      <!-- Generate Button -->
      <div class="flex justify-center mt-6">
        <UButton
          :label="$t('generateDialogSpeech')"
          color="primary"
          size="lg"
          icon="mingcute:ai-fill"
          :loading="loadings.textToSpeech"
          :disabled="!dialogs.length || !speakers.length"
          @click="onGenerate"
        />
      </div>
    </Motion>
  </UContainer>
</template>
