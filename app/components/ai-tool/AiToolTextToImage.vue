<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { model } = useLLM()

const { footer, global } = useAppConfig()

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
</script>

<template>
  <div class="flex flex-col justify-center pt-30">
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
        delay: 0.1
      }"
    >
      <BaseLogo loading />
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
        delay: 0.1
      }"
    >
      <BaseAppTitle />
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
        delay: 0.3
      }"
    >
      <UChatPrompt
        class="[view-transition-name:chat-prompt] mt-15"
        variant="subtle"
        :placeholder="$t('Describe the image you want to generate...')"
      >
        <UChatPromptSubmit
          color="primary"
          label="Generate"
          class="bg-gradient-to-r from-primary to-violet-400 max-h-10"
          icon="mingcute:ai-fill"
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
      <div class="flex items-center gap-3 mt-4">
        <UFormField :label="$t('Model/Preset')">
          <BaseModelSelect />
        </UFormField>
        <UFormField
          v-if="model.options.includes('style')"
          :label="$t('Style')"
        >
          <BaseStyleSelect />
        </UFormField>
        <UFormField
          v-if="model.options.includes('imageDimensions')"
          :label="$t('Image Dimensions')"
        >
          <BaseImageDimensionsSelect />
        </UFormField>
        <UFormField
          v-if="model.options.includes('yourImage')"
          :label="$t('Your Image')"
        >
          <BaseImageSelect />
        </UFormField>
      </div>
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
  </div>
</template>
