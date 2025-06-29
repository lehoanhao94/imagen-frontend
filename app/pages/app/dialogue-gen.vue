<script setup lang="ts">
const { model, models, speed, outputFormat, outputChannel }
  = useSpeechGenModels()
const { loadVoices } = useSpeechVoices()
const { selectedEmotion } = useSpeechEmotions()
const toast = useToast()

const textToSpeechStore = useTextToSpeechStore()
const { t } = useI18n()
const { prompt, selectedFiles, hasSelectedFiles, loadings }
  = storeToRefs(textToSpeechStore)

const dialogToSpeechStore = useDialogToSpeechStore()

const { dialogs, voice1, voice2, custom_prompt }
  = storeToRefs(dialogToSpeechStore)

const onGenerate = async () => {
  const result = await handleDialogToSpeech()

  if (result) {
    toast.add({
      id: 'success',
      title: 'Speech Generation',
      description: 'Your speech is being generated. Please check back later.',
      color: 'success'
    })
  }
}

const handleDialogToSpeech = async () => {
  return await dialogToSpeechStore.generateDialogSpeech({
    model: model.value.value,
    emotion: selectedEmotion.value?.emotion_key,
    speed: speed.value,
    output_format: outputFormat.value,
    output_channel: outputChannel.value,
    custom_prompt: custom_prompt.value
  })
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
        v-model="custom_prompt"
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
            <div class="flex flex-col gap-4">
              <BaseSpeakerGen
                v-for="(dialog, index) in dialogs"
                :key="index"
                :can-remove="index !== 0 || dialogs.length > 1"
                v-bind="dialog"
                @update:model-value="
                  dialogToSpeechStore.updateDialog(index, $event)
                "
                @remove="dialogToSpeechStore.removeDialog(index)"
              />
            </div>

            <UButton
              class="mt-4"
              color="neutral"
              variant="soft"
              icon="icons8:plus"
              :label="$t('Add dialog')"
              @click="dialogToSpeechStore.addDialog()"
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
          :label="$t('voice 1')"
        >
          <BaseSpeechVoiceSelectModal
            v-model="voice1"
            size="sm"
            @update:model-value="dialogToSpeechStore.setVoice1($event)"
          />
        </UFormField>

        <UFormField
          v-if="model?.options?.includes('voice')"
          :label="$t('voice 2')"
        >
          <BaseSpeechVoiceSelectModal
            v-model="voice2"
            size="sm"
            @update:model-value="dialogToSpeechStore.setVoice2($event)"
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
          v-if="
            model?.options?.some((option: string) =>
              ['speed', 'outputFormat', 'outputChannel'].includes(option)
            )
          "
          :label="$t('settings')"
        >
          <BaseSpeechSettingsModal />
        </UFormField>
      </div>
    </Motion>
  </UContainer>
</template>
