<script setup lang="ts">
const { model, models } = useSpeechGenModels()
definePageMeta({
  middleware: 'auth'
})

const appStore = useAppStore()

const { loading } = storeToRefs(appStore)

const aiPhotos = [
  'https://cdn.leonardo.ai/users/c593f6db-e19b-43f4-b0ce-f5757ff82907/generations/27ceb2db-a6c1-4533-a1bc-35375113bf45/segments/5:8:1/Leonardo_Phoenix_10_A_Clean_Shaven_Strangely_Odd_Unorthodox_Av_0.jpg?w=512',
  'https://cdn.leonardo.ai/users/daeb794a-c999-4c7c-a7bd-1b22321efa4e/generations/1e0d2e32-d948-47c3-891a-7ea47ce900d8/Leonardo_Phoenix_10_HD_animestyle_couple_walking_along_a_narro_1.jpg?w=512',
  'https://cdn.leonardo.ai/users/dae3edd9-f7aa-4aef-adc1-63cb53d7d8b8/generations/d2236476-d02a-4d4c-8369-b1671b64ca6b/variations/alchemyrefiner_alchemymagic_3_d2236476-d02a-4d4c-8369-b1671b64ca6b_0.jpg?w=512',
  'https://cdn.leonardo.ai/users/818a38be-6136-4eba-9b0e-9ec156e41811/generations/b0ec8580-6a5a-4e6c-a203-cd7dfe27b9b1/Leonardo_Phoenix_10_A_large_reddishgolden_colored_cartoon_cat_3.jpg?w=512',
  'https://cdn.leonardo.ai/users/684d2cf2-484a-44d8-bf86-4fac5fe47a59/generations/78afd409-dccb-4508-b4bc-5c2b625171e9/Leonardo_Phoenix_10_A_pair_of_enchanting_fantasy_birds_perched_0.jpg?w=512'
]

const textToImageStore = useTextToImageStore()
const { textToImageResult, aiToolImageCardRef, prompt }
  = storeToRefs(textToImageStore)

const onGenerate = () => {
  textToImageStore.textToImage({
    prompt: prompt.value,
    model: 'imagen-3'
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
  </UContainer>
</template>
