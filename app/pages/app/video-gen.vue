<script setup lang="ts">
interface ImageFile {
  src: string
  alt: string
  file: File
}

const { model, models } = useVideoGenModels()
const { duration, personGeneration, personGenerationOptions, enhancePrompt }
  = useVideoGenOptions()

const { videoDimension } = useVideoDimensions()

const appStore = useAppStore()
const toast = useToast()
const { loading } = storeToRefs(appStore)

const textToVideoStore = useTextToVideoStore()
const {
  textToVideoResult: _textToVideoResult,
  aiToolImageCardRef: _aiToolImageCardRef,
  prompt,
  loadings
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
  // scroll to top and focus on prompt input
  nextTick(() => {
    // scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // try to focus the prompt input after scrolling
    setTimeout(() => {
      // look for the prompt input (UChatPrompt component)
      const promptInput = document.querySelector(
        '[class*="chat-prompt"] textarea, [class*="chat-prompt"] input'
      )
      if (promptInput && promptInput instanceof HTMLElement) {
        promptInput.focus()
      }
    }, 500)
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
        :placeholder="$t('Describe the video you want to generate...')"
        @submit="onGenerate"
      >
        <UChatPromptSubmit
          color="primary"
          :label="$t('generateVideo')"
          class="bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600 cursor-pointer"
          icon="mingcute:ai-fill"
          :loading="loadings['textToVideo']"
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
      <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <UFormField :label="$t('model')">
          <BaseModelSelect
            v-model="model"
            :models="models"
            class="w-full"
          />
        </UFormField>
        <!-- <UFormField :label="$t('videoTypeSelection')">
          <BaseVideoTypeSelect
            v-model="selectedVideoType"
            size="sm"
          />
        </UFormField> -->
        <UFormField :label="$t('Person Generation')">
          <BasePersonGenerationSelect
            v-model="personGeneration"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="$t('aspectRatio')">
          <BaseVideoDimensionsSelect />
        </UFormField>

        <UFormField :label="$t('enhancePrompt')">
          <template #hint>
            <UTooltip
              :delay-duration="0"
              :text="
                enhancePrompt
                  ? $t(
                    'Prompts will always be refined to improve output quality'
                  )
                  : $t('Prompts will not be refined')
              "
            >
              <UIcon name="material-symbols:help" />
            </UTooltip>
          </template>
          <USwitch
            v-model="enhancePrompt"
            unchecked-icon="i-lucide-x"
            checked-icon="i-lucide-check"
            :label="enhancePrompt ? $t('On') : $t('Off')"
          />
        </UFormField>

        <div
          v-if="model?.options?.includes('yourImage')"
          class="sm:col-span-4 flex flex-row gap-3 items-end"
        >
          <UFormField :label="$t('Image Reference')">
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
