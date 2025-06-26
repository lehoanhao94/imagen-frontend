<script setup lang="ts">
const { model, models, speed, outputFormat, outputChannel }
  = useSpeechGenModels()
const { selectedVoice, loadVoices } = useSpeechVoices()
const { selectedEmotion } = useSpeechEmotions()
const toast = useToast()

const textToSpeechStore = useTextToSpeechStore()
const { t } = useI18n()
const {
  prompt,
  selectedFiles,
  supportFiles,
  hasSelectedFiles,
  uploadProgress,
  loadings
} = storeToRefs(textToSpeechStore)

const onGenerate = async () => {
  let result
  if (hasSelectedFiles.value) {
    result = await handleDocumentToSpeech()
  } else {
    result = await handleTextToSpeech()
  }

  if (result) {
    toast.add({
      id: 'success',
      title: 'Speech Generation',
      description: 'Your speech is being generated. Please check back later.',
      color: 'success'
    })
  }
}

const handleTextToSpeech = async () => {
  return await textToSpeechStore.textToSpeech({
    input: prompt.value,
    model: model.value.value,
    voices: [
      {
        name: selectedVoice.value?.speaker_name,
        voice: {
          id: selectedVoice.value?.id,
          name: selectedVoice.value?.speaker_name
        }
      }
    ],
    emotion: selectedEmotion.value?.emotion_key,
    speed: speed.value,
    output_format: outputFormat.value,
    output_channel: outputChannel.value
  })
}

const handleDocumentToSpeech = async () => {
  for (const file of selectedFiles.value) {
    return await textToSpeechStore.documentToSpeech(file, {
      input: prompt.value,
      model: model.value.value,
      emotion: selectedEmotion.value?.emotion_key,
      speed: speed.value,
      output_format: outputFormat.value,
      output_channel: outputChannel.value,
      voices: [
        {
          name: selectedVoice.value?.speaker_name,
          voice: {
            id: selectedVoice.value?.id,
            name: selectedVoice.value?.speaker_name
          }
        }
      ]
    })
  }
}

onMounted(() => {
  loadVoices()
})

const handleFilesSelected = (files: File[]) => {
  textToSpeechStore.selectedFiles = files
}

watch(
  () => hasSelectedFiles.value,
  (newValue) => {
    if (newValue) {
      prompt.value = t('Generate speech from selected file')
    } else {
      prompt.value = ''
      // focus to input
      nextTick(() => {
        const promptInput = document.querySelector(
          '[class*="chat-prompt"] textarea, [class*="chat-prompt"] input'
        )
        if (promptInput && promptInput instanceof HTMLElement) {
          promptInput.focus()
        }
      })
    }
  }
)
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
      <UChatPrompt
        v-model="prompt"
        class="[view-transition-name:chat-prompt]"
        :placeholder="
          $t(
            'Describe the style of your dialog, e.g. *Read this in a dramatic whisper*'
          )
        "
        :disabled="hasSelectedFiles"
        :maxrows="10"
        @submit="onGenerate"
      >
        <UChatPromptSubmit
          color="primary"
          :label="$t('Generate')"
          class="bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600 cursor-pointer"
          icon="mingcute:ai-fill"
          :loading="loadings['textToSpeech']"
        />

        <template #footer>
          <div class="mt-4 px-2 pb-3 w-full">
            <BaseSpeakerGen />

            <UButton
              class="mt-4"
              color="neutral"
              variant="soft"
              icon="icons8:plus"
              :label="$t('Add dialog')"
            />
          </div>
        </template>
      </UChatPrompt>
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
        <!-- Model Selection Row -->
        <UFormField :label="$t('modelPreset')">
          <BaseModelSelect
            v-model="model"
            :models="models"
            class="w-full"
          />
        </UFormField>

        <!-- Voice and Emotion Row -->
        <UFormField
          v-if="model?.options?.includes('voice')"
          :label="$t('voice')"
        >
          <BaseSpeechVoiceSelectModal
            v-model="selectedVoice"
            size="sm"
          />
        </UFormField>

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
    </Motion>
  </UContainer>
</template>
