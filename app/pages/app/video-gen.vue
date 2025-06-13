<script setup lang="ts">
interface ImageFile {
  src: string
  alt: string
  file: File
}

const { model, models } = useVideoGenModels()
const {
  duration,
  personGeneration,
  personGenerationOptions,
  enhancePrompt
} = useVideoGenOptions()

const { videoDimension } = useVideoDimensions()

const appStore = useAppStore()
const toast = useToast()
const { loading } = storeToRefs(appStore)

const textToVideoStore = useTextToVideoStore()
const {
  textToVideoResult: _textToVideoResult,
  aiToolImageCardRef: _aiToolImageCardRef,
  prompt
} = storeToRefs(textToVideoStore)

// Video type selection
const selectedVideoType = ref(null)

// Local state for selected images
const selectedImages = ref<ImageFile[]>([])

// Handle image selection
const handleImagesSelected = (images: ImageFile[]) => {
  selectedImages.value = images
  // Also update store for backward compatibility
  textToVideoStore.selectedImages = images
}

const onGenerate = async () => {
  // Extract File objects from selectedImages
  const files = selectedImages.value.map(img => img.file)

  const result = await textToVideoStore.textToVideo({
    prompt: prompt.value,
    model: model.value?.value,
    aspect_ratio: videoDimension.value,
    person_generation: personGeneration.value,
    enhance_prompt: enhancePrompt.value,
    duration: duration.value,
    files: files
  })

  if (result) {
    const generationType
      = selectedImages.value.length > 0 ? 'Image-to-Video' : 'Text-to-Video'
    toast.add({
      id: 'success',
      title: `${generationType} Generated`,
      description: 'Your video is being generated. Please check back later.',
      color: 'success'
    })
  }
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
          :label="$t('generateVideo')"
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
        <UFormField :label="$t('videoTypeSelection')">
          <BaseVideoTypeSelect
            v-model="selectedVideoType"
            size="sm"
          />
        </UFormField>
        <UFormField :label="$t('videoDimensions')">
          <BaseVideoDimensionsSelect />
        </UFormField>
        <UFormField :label="$t('personGeneration')">
          <USelectMenu
            v-model="personGeneration"
            :options="personGenerationOptions"
            option-attribute="label"
            value-attribute="value"
            class="w-full"
          />
        </UFormField>
        <div class="flex flex-row gap-3 items-end">
          <UFormField :label="$t('yourImage')">
            <BaseImageSelect
              v-model="selectedImages"
              :multiple="true"
              @update:model-value="handleImagesSelected"
            />
          </UFormField>
          <BaseImageSelectedList
            v-model="selectedImages"
            @update:model-value="handleImagesSelected"
          />
        </div>
        <UFormField :label="$t('enhancePrompt')">
          <UToggle
            v-model="enhancePrompt"
            :label="enhancePrompt ? $t('enabled') : $t('disabled')"
          />
        </UFormField>
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
      <VideoPromptGallery
        class="mt-8"
        @use-prompt="onUsePrompt"
      />
    </Motion>
  </UContainer>
</template>
