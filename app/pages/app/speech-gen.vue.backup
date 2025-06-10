<script setup lang="ts">
const { model, models, speed, outputFormat, outputChannel } = useSpeechGenModels()
const { selectedVoice } = useSpeechVoices()
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
    prompt: prompt.value,
    model: model.value.value,
    voice_id: selectedVoice.value?.id,
    emotion: selectedEmotion.value?.emotion_key,
    speed: speed.value,
    output_format: outputFormat.value,
    output_channel: outputChannel.value
  })
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
      <div class="flex flex-col gap-4 mt-4">
        <!-- Model Selection Row -->
        <UFormField :label="$t('modelPreset')">
          <BaseModelSelect
            v-model="model"
            :models="models"
            class="w-full"
          />
        </UFormField>

        <!-- Voice and Emotion Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField
            v-if="model?.options?.includes('voice')"
            :label="$t('voice')"
          >
            <BaseSpeechVoiceSelect />
          </UFormField>

          <UFormField
            v-if="model?.options?.includes('emotion')"
            :label="$t('emotion')"
          >
            <BaseSpeechEmotionSelect />
          </UFormField>
        </div>

        <!-- Speed Control -->
        <UFormField
          v-if="model?.options?.includes('speed')"
          :label="$t('speed')"
        >
          <BaseSpeechSpeedSelect />
        </UFormField>

        <!-- Output Settings Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField
            v-if="model?.options?.includes('outputFormat')"
            :label="$t('outputFormat')"
          >
            <BaseSpeechFormatSelect />
          </UFormField>

          <UFormField
            v-if="model?.options?.includes('outputChannel')"
            :label="$t('outputChannel')"
          >
            <BaseSpeechChannelSelect />
          </UFormField>
        </div>
      </div>
    </Motion>
  </UContainer>
</template>
