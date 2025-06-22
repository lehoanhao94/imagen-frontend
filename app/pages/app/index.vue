<script setup lang="ts">
interface ImageFile {
  src: string
  alt: string
  file: File
}

const { model, models } = useImageGenModels()
const { style } = useStyles()
const { imageDimension } = useImageDimensions()

const appStore = useAppStore()
const toast = useToast()
const { loading } = storeToRefs(appStore)

const aiPhotos = [
  'https://cdn.leonardo.ai/users/c593f6db-e19b-43f4-b0ce-f5757ff82907/generations/27ceb2db-a6c1-4533-a1bc-35375113bf45/segments/5:8:1/Leonardo_Phoenix_10_A_Clean_Shaven_Strangely_Odd_Unorthodox_Av_0.jpg?w=512',
  'https://cdn.leonardo.ai/users/daeb794a-c999-4c7c-a7bd-1b22321efa4e/generations/1e0d2e32-d948-47c3-891a-7ea47ce900d8/Leonardo_Phoenix_10_HD_animestyle_couple_walking_along_a_narro_1.jpg?w=512',
  'https://cdn.leonardo.ai/users/dae3edd9-f7aa-4aef-adc1-63cb53d7d8b8/generations/d2236476-d02a-4d4c-8369-b1671b64ca6b/variations/alchemyrefiner_alchemymagic_3_d2236476-d02a-4d4c-8369-b1671b64ca6b_0.jpg?w=512',
  'https://cdn.leonardo.ai/users/818a38be-6136-4eba-9b0e-9ec156e41811/generations/b0ec8580-6a5a-4e6c-a203-cd7dfe27b9b1/Leonardo_Phoenix_10_A_large_reddishgolden_colored_cartoon_cat_3.jpg?w=512',
  'https://cdn.leonardo.ai/users/684d2cf2-484a-44d8-bf86-4fac5fe47a59/generations/78afd409-dccb-4508-b4bc-5c2b625171e9/Leonardo_Phoenix_10_A_pair_of_enchanting_fantasy_birds_perched_0.jpg?w=512'
]

const textToImageStore = useTextToImageStore()
const { textToImageResult, aiToolImageCardRef, prompt, loadings }
  = storeToRefs(textToImageStore)

// Local state for selected images
const selectedImages = ref<ImageFile[]>([])

// Local state for person generation and safety filter
const personGeneration = ref('DONT_ALLOW')
const safetyFilterLevel = ref('BLOCK_LOW_AND_ABOVE')

// Handle image selection
const handleImagesSelected = (images: ImageFile[]) => {
  selectedImages.value = images
  // Also update store for backward compatibility
  textToImageStore.selectedImages = images
}

const onGenerate = async () => {
  // Extract File objects from selected images
  const files = selectedImages.value.map(img => img.file).filter(Boolean)

  const result = await textToImageStore.textToImage({
    prompt: prompt.value,
    model: model.value?.value || 'gemini-2.0-flash-exp-image-generation',
    style: style.value || 'Portrait',
    aspect_ratio: imageDimension.value || '1:1',
    person_generation: personGeneration.value,
    safety_filter_level: safetyFilterLevel.value,
    files: files
  })

  if (result) {
    toast.add({
      id: 'success',
      title: 'Image Generation',
      description: 'Your image is being generated. Please check back later.',
      color: 'success'
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
      <UChatPrompt
        v-model="prompt"
        class="[view-transition-name:chat-prompt]"
        :placeholder="$t('Describe the image you want to generate...')"
        @submit="onGenerate"
      >
        <UChatPromptSubmit
          color="primary"
          :label="$t('generate')"
          class="bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600 cursor-pointer"
          icon="mingcute:ai-fill"
          :loading="loadings['textToImage']"
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
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <UFormField :label="$t('model')">
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
          <BaseImageStyleSelect
            v-model="style"
            class="w-full"
            size="sm"
          />
        </UFormField>
        <UFormField
          v-if="model?.options?.includes('imageDimensions')"
          :label="$t('aspectRatio')"
        >
          <BaseImageDimensionsSelect />
        </UFormField>
        <UFormField :label="$t('Person Generation')">
          <BasePersonGenerationSelect
            v-model="personGeneration"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="$t('Safety Filter')">
          <BaseSafetyFilterSelect
            v-model="safetyFilterLevel"
            class="w-full"
          />
        </UFormField>
        <div
          v-if="model?.options?.includes('yourImage')"
          class="flex flex-row gap-3 items-end"
        >
          <UFormField :label="$t('Image Reference')">
            <BaseImageSelect
              v-model="selectedImages"
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
    <Motion
      v-if="false"
      ref="aiToolImageCardRef"
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
      class="mt-10"
    >
      <AIToolImageCard
        v-bind="textToImageResult"
        :data="textToImageResult"
        :loading="loadings['textToImage']"
      />
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
        duration: 0.5,
        delay: 1
      }"
    >
      <UPageMarquee
        pause-on-hover
        class="py-2 -mx-4 sm:-mx-6 lg:-mx-8 [--duration:40s] mt-14"
      >
        <Motion
          v-for="(img, index) in aiPhotos"
          :key="index"
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
            delay: index * 0.1
          }"
        >
          <img
            width="234"
            height="234"
            class="rounded-lg"
            :class="index % 2 === 0 ? '-rotate-2' : 'rotate-2'"
            :src="img"
          >
        </Motion>
      </UPageMarquee>
    </Motion>
  </UContainer>
</template>
