<script setup lang="ts">
const { model, models } = useVideoGenModels()

const appStore = useAppStore()

const { loading } = storeToRefs(appStore)

const textToImageStore = useTextToImageStore()
const { prompt } = storeToRefs(textToImageStore)

const onGenerate = () => {
  textToImageStore.textToImage({
    prompt: prompt.value,
    model: 'imagen-3'
  })
}

const onUsePrompt = (newPrompt: string) => {
  prompt.value = newPrompt
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
        :placeholder="$t('Describe the video you want to generate...')"
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
        <UFormField :label="$t('modelPreset')">
          <BaseModelSelect
            v-model="model"
            :models="models"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-if="model?.options?.includes('style')"
          :label="$t('style')"
        >
          <BaseStyleSelect class="w-full" />
        </UFormField>
        <UFormField
          v-if="model?.options?.includes('imageDimensions')"
          :label="$t('imageDimensions')"
        >
          <BaseImageDimensionsSelect />
        </UFormField>
        <div
          v-if="model?.options?.includes('yourImage')"
          class="flex flex-row gap-3 items-end"
        >
          <UFormField :label="$t('yourImage')">
            <BaseImageSelect />
          </UFormField>
          <BaseImageSelectedList />
        </div>
      </div>
    </Motion>

    <!-- Video Prompt Gallery -->
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
        delay: 0.7
      }"
    >
      <VideoPromptGallery @use-prompt="onUsePrompt" />
    </Motion>
  </UContainer>
</template>
