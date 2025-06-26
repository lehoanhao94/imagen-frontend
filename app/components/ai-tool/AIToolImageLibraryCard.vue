<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  orientation: {
    type: String,
    default: 'horizontal'
  },
  imageUrl: {
    type: String,
    default:
      'https://cdn.leonardo.ai/users/07195385-0f39-42ad-876f-1b86c2b71b55/generations/3a3be14d-d7a8-495c-9550-c40ae490f3fe/Leonardo_Phoenix_10_a_warm_and_vibrant_image_of_a_happy_woman_1.jpg?w=512'
  },
  title: {
    type: String,
    default:
      'A warm and vibrant image of a happy woman with a bright and radiant smile'
  },
  prompt: {
    type: String,
    default:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.'
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
const isHovered = ref(false)
const isTouchDevice = ref(false)

// Check if it's a touch device on component mount
onMounted(() => {
  isTouchDevice.value
    = 'ontouchstart' in window || navigator.maxTouchPoints > 0
})

const openFullScreen = () => {
  // On touch devices, first tap shows overlay, second tap opens fullscreen
  if (isTouchDevice.value && !isHovered.value) {
    isHovered.value = true
    return
  }

  isFullScreenOpen.value = true
}

const generateWithPrompt = () => {
  // Implement the generate functionality here
  console.log('Generating with prompt:', props.prompt)
}
</script>

<template>
  <UPageCard
    :orientation="orientation === 'horizontal' ? 'horizontal' : 'vertical'"
    spotlight
    spotlight-color="primary"
    :ui="{
      container: 'lg:items-start sm:p-0',
      root: 'overflow-hidden relative group'
    }"
  >
    <div class="relative w-full h-full aspect-square sm:aspect-auto">
      <img
        :src="imageUrl"
        :alt="title"
        class="w-full h-full object-cover imagen cursor-pointer transition-opacity"
        @click="openFullScreen"
      >
      <!-- Hover Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4"
        :class="{ 'opacity-100': isHovered }"
      >
        <div class="flex justify-between items-start gap-2">
          <div
            class="text-white font-medium text-sm line-clamp-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer hover:underline hover:text-primary"
            :class="{ 'translate-y-0 opacity-100': isHovered }"
            @click.stop="openFullScreen"
          >
            {{ title }}
          </div>
          <UButton
            icon="i-lucide-maximize"
            color="neutral"
            variant="ghost"
            size="xs"
            class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 hover:bg-white/10 cursor-pointer"
            :class="{ 'opacity-100': isHovered }"
            @click.stop="openFullScreen"
          />
        </div>
        <UChatPromptSubmit
          color="primary"
          :label="$t('generateWithPrompt')"
          class="cursor-pointer w-full justify-center bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600 mt-auto transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-200"
          :class="{ 'translate-y-0 opacity-100': isHovered }"
          icon="mingcute:ai-fill"
          @click.stop="generateWithPrompt"
        />
      </div>
    </div>
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
        class="relative w-full h-full flex flex-col md:flex-row"
        @click="isFullScreenOpen = false"
      >
        <!-- Close button -->
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
          @click="isFullScreenOpen = false"
        />

        <!-- Left side: Image -->
        <div
          class="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full flex items-center justify-center animate-fadeIn p-4"
        >
          <!-- Prevent click propagation on the image itself to avoid closing when clicking on the image -->
          <img
            :src="imageUrl"
            :alt="title"
            class="max-h-full max-w-full object-contain cursor-zoom-out animate-scaleIn shadow-2xl border border-white/10 rounded"
            @click.stop
          >
        </div>

        <!-- Right side: Image information and Generate button -->
        <div
          class="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full bg-black/50 backdrop-blur-md p-4 md:p-6 lg:p-8 flex flex-col overflow-y-auto animate-slideInRight"
          @click.stop
        >
          <h2 class="text-white text-xl md:text-2xl font-medium mb-4 md:mb-6">
            {{ title }}
          </h2>

          <div class="text-white/80 mb-4 md:mb-6">
            <h3 class="text-white text-base md:text-lg font-medium mb-2">
              {{ $t("promptDetails") }}
            </h3>
            <p class="text-xs md:text-sm mb-4 md:mb-6 overflow-y-auto bg-muted p-2 rounded-lg">
              {{ prompt }}
            </p>

            <div class="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
              <div>
                <h4 class="text-white/60 text-xs uppercase mb-1">
                  {{ $t("preset") }}
                </h4>
                <p class="text-xs md:text-sm">
                  {{ preset }}
                </p>
              </div>
              <div>
                <h4 class="text-white/60 text-xs uppercase mb-1">
                  {{ $t("style") }}
                </h4>
                <p class="text-xs md:text-sm">
                  {{ props.style }}
                </p>
              </div>
              <div>
                <h4 class="text-white/60 text-xs uppercase mb-1">
                  {{ $t("resolution") }}
                </h4>
                <p class="text-xs md:text-sm">
                  {{ resolution }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-auto pt-2">
            <UChatPromptSubmit
              color="primary"
              :label="$t('generateWithPrompt')"
              class="cursor-pointer w-full justify-center bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600"
              icon="mingcute:ai-fill"
              @click="generateWithPrompt"
            />
          </div>
        </div>

        <div
          class="absolute bottom-4 left-4 text-white/70 text-xs md:text-sm hidden md:block"
        >
          {{ $t("clickToClose") }}
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.imagen {
  transition: transform 0.3s ease;
}

/* Apply scale effect to the image when the card is hovered */
:deep(.group:hover) .imagen {
  transform: scale(1.05);
}

/* For touch devices */
@media (hover: none) {
  :deep(.group:active) .imagen {
    transform: scale(1.05);
  }
}

/* Add line-clamp utility if not available in your Tailwind config */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation for modal content */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-scaleIn {
  animation: scaleIn 0.5s ease-out;
}

.animate-slideInRight {
  animation: slideInRight 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
