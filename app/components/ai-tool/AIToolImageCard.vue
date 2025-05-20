<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  orientation: {
    type: String as () => 'horizontal' | 'vertical',
    default: 'horizontal'
  },
  imageUrl: {
    type: String,
    default: 'https://cdn.leonardo.ai/users/07195385-0f39-42ad-876f-1b86c2b71b55/generations/3a3be14d-d7a8-495c-9550-c40ae490f3fe/Leonardo_Phoenix_10_a_warm_and_vibrant_image_of_a_happy_woman_1.jpg?w=512'
  },
  title: {
    type: String,
    default: 'A warm and vibrant image of a happy woman with a bright and radiant smile'
  },
  prompt: {
    type: String,
    default: 'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.'
  },
  preset: {
    type: String,
    default: 'Imagen 3'
  },
  style: {
    type: String,
    default: 'Dynamic'
  },
  resolution: {
    type: String,
    default: '1024x1024'
  }
})

const isFullScreenOpen = ref(false)

const openFullScreen = () => {
  isFullScreenOpen.value = true
}
</script>

<template>
  <UPageCard
    :title="title"
    :orientation="orientation"
    spotlight
    spotlight-color="primary"
    :ui="{
      container: 'lg:items-start'
    }"
  >
    <img
      :src="imageUrl"
      class="order-first lg:order-last w-full imagen cursor-pointer hover:opacity-90 transition-opacity"
      @click="openFullScreen"
    >

    <template #description>
      <div class="text-xs mt-2">
        <div class="font-bold">
          <div>{{ $t("promptDetails") }}</div>
        </div>
        <div class="font-light p-2 bg-muted mt-1 rounded-lg">
          {{ prompt }}
        </div>
      </div>

      <div class="mt-2 grid grid-cols-3">
        <div>
          <div class="text-[10px] font-light">
            {{ $t("preset") }}
          </div>
          <div class="text-xs">
            {{ preset }}
          </div>
        </div>
        <div>
          <div class="text-[10px] font-light">
            {{ $t("style") }}
          </div>
          <div class="text-xs">
            {{ style }}
          </div>
        </div>
        <div>
          <div class="text-[10px] font-light">
            {{ $t("resolution") }}
          </div>
          <div class="text-xs">
            {{ resolution }}
          </div>
        </div>
      </div>
      <UChatPromptSubmit
        color="primary"
        :label="$t('generateWithPrompt')"
        class="cursor-pointer mt-4 w-full justify-center bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600"
        icon="mingcute:ai-fill"
      />
    </template>
  </UPageCard>

  <!-- Full Screen Image Modal -->
  <UModal
    v-model:open="isFullScreenOpen"
    fullscreen
    :ui="{
      content: 'bg-black/90 backdrop-blur-xl'
    }"
    @keydown.esc="isFullScreenOpen = false"
  >
    <template #content>
      <div
        class="relative w-full h-full flex items-center justify-center"
        @click="isFullScreenOpen = false"
      >
        <!-- Prevent click propagation on the image itself to avoid closing when clicking on the image -->
        <img
          :src="imageUrl"
          :alt="title"
          class="max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out"
          @click.stop
        >
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="absolute top-4 right-4 text-white hover:bg-white/10"
          @click="isFullScreenOpen = false"
        />
        <div class="absolute bottom-4 text-white/70 text-sm">
          {{ $t('clickToClose') }}
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.imagen {
  transition: transform 0.2s ease;
}
.imagen:hover {
  transform: scale(1.02);
}
</style>
