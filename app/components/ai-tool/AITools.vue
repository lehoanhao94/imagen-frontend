<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { model, models } = useImageGenModels()

const { footer, global } = useAppConfig()

const appStore = useAppStore()

const { loading } = storeToRefs(appStore)

defineProps<{
  page: IndexCollectionItem
}>()

const aiPhotos = [
  'https://cdn.leonardo.ai/users/c593f6db-e19b-43f4-b0ce-f5757ff82907/generations/27ceb2db-a6c1-4533-a1bc-35375113bf45/segments/5:8:1/Leonardo_Phoenix_10_A_Clean_Shaven_Strangely_Odd_Unorthodox_Av_0.jpg?w=512',
  'https://cdn.leonardo.ai/users/daeb794a-c999-4c7c-a7bd-1b22321efa4e/generations/1e0d2e32-d948-47c3-891a-7ea47ce900d8/Leonardo_Phoenix_10_HD_animestyle_couple_walking_along_a_narro_1.jpg?w=512',
  'https://cdn.leonardo.ai/users/dae3edd9-f7aa-4aef-adc1-63cb53d7d8b8/generations/d2236476-d02a-4d4c-8369-b1671b64ca6b/variations/alchemyrefiner_alchemymagic_3_d2236476-d02a-4d4c-8369-b1671b64ca6b_0.jpg?w=512',
  'https://cdn.leonardo.ai/users/818a38be-6136-4eba-9b0e-9ec156e41811/generations/b0ec8580-6a5a-4e6c-a203-cd7dfe27b9b1/Leonardo_Phoenix_10_A_large_reddishgolden_colored_cartoon_cat_3.jpg?w=512',
  'https://cdn.leonardo.ai/users/684d2cf2-484a-44d8-bf86-4fac5fe47a59/generations/78afd409-dccb-4508-b4bc-5c2b625171e9/Leonardo_Phoenix_10_A_pair_of_enchanting_fantasy_birds_perched_0.jpg?w=512'
]

const textToImageStore = useTextToImageStore()
const { textToImageResult, aiToolImageCardRef } = storeToRefs(textToImageStore)

const onGenerate = () => {
  textToImageStore.textToImage()
}
</script>

<template>
  <div class="flex flex-col justify-center pt-30">
    <div class="logo-container w-20 h-20 mx-auto">
      <BaseLogo
        id="main-logo"
        :loading="loading"
        :class="{
          'logo-loading animate__pulse animate__infinite': loading
        }"
        class="animate__animated"
      />
    </div>
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
      <BaseAppTitle
        class="justify-center text-center flex mx-auto text-6xl lg:w-[400px]"
      />
    </Motion>
    <UContainer class="mt-10">
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
        <div
          class="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4"
        >
          <AIToolMenu />
        </div>
        <UChatPrompt
          class="[view-transition-name:chat-prompt]"
          variant="subtle"
          :placeholder="$t('Describe the image you want to generate...')"
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
      <Motion
        v-if="textToImageResult"
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
        <AIToolImageCard v-bind="textToImageResult" />
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
  </div>
</template>

<style scoped>
.logo-container {
  position: relative;
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  background: transparent; /* Đảm bảo nền trong suốt */
}

#main-logo {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 30;
  transform-origin: center center;
  will-change: transform, top, left, position;
  background: transparent; /* Đảm bảo nền trong suốt */
}

#main-logo.logo-loading {
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%) scale(1.05);
  z-index: 10000;
  animation: pulse 2s infinite ease-in-out;
  /* Ensure logo is visible */
  opacity: 1 !important;
  visibility: visible !important;
  /* Add shadow for better visibility */
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
  /* Đảm bảo không có ô vuông màu đen kỳ lạ phía sau */
  background: transparent !important;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1.05);
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
    background: transparent;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.3));
    background: transparent;
  }
}
</style>
