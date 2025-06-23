<script setup lang="ts">
const { model, models, speed, outputFormat, outputChannel } = useSpeechGenModels()
const { selectedVoice, loadVoices } = useSpeechVoices()
const { selectedEmotion } = useSpeechEmotions()

definePageMeta({
  middleware: 'auth'
})

const appStore = useAppStore()
const textToSpeechStore = useTextToSpeechStore()

const { loading } = storeToRefs(appStore)
const { prompt } = storeToRefs(textToSpeechStore)

const onGenerate = () => {
  textToSpeechStore.textToSpeech({
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

onMounted(() => {
  loadVoices()
})
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
        :placeholder="$t('Describe the speech you want to generate...')"
        @submit="onGenerate"
      >
        <UChatPromptSubmit
          color="primary"
          :label="$t('generate')"
          class="bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600 cursor-pointer"
          icon="mingcute:ai-fill"
          :loading="loading"
        />

        <template #footer />
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
