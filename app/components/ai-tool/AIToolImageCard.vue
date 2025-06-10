<script setup lang="ts">
import { ref, computed } from 'vue'
import BasePixelRevealImage from '~/components/base/BasePixelRevealImage.vue'

const props = defineProps({
  orientation: {
    type: String as () => 'horizontal' | 'vertical',
    default: 'horizontal'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  imageBase64: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  prompt: {
    type: String,
    default: ''
  },
  preset: {
    type: String,
    default: 'Unknown'
  },
  style: {
    type: String,
    default: 'Unknown'
  },
  resolution: {
    type: String,
    default: '1024x1024'
  }
})

const { models, model } = useImageGenModels()
const { style: currentStyle } = useStyles()
const { imageDimension } = useImageDimensions()
const textToImageStore = useTextToImageStore()

const isFullScreenOpen = ref(false)
const isImageRevealed = ref(false)

// Find the corresponding model label for the preset value
const presetLabel = computed(() => {
  const modelFound = models.find(m => m.value === props.preset)
  return modelFound ? modelFound.label : props.preset
})

const openFullScreen = () => {
  isFullScreenOpen.value = true
}

const onRevealComplete = (event: any) => {
  isImageRevealed.value = true
  console.log(event?.message || 'Image reveal complete')
}

const onImageLoaded = (event: any) => {
  console.log(event?.message || 'Image loaded')
}

const onImageProcessing = (event: any) => {
  console.log(event?.message || 'Processing image')
}

const onGenerateWithSettings = () => {
  // Copy the settings from this card to the current form state

  // Find and set the model
  const modelFound = models.find(m => m.value === props.preset)
  if (modelFound) {
    model.value = modelFound
  }

  // Set the style
  currentStyle.value = props.style

  // Convert resolution format (e.g., "1024x1024" to "1:1")
  const convertResolutionToAspectRatio = (resolution: string) => {
    const [width, height] = resolution.split('x').map(Number)
    if (width && height) {
      const gcd = (a: number, b: number): number =>
        b === 0 ? a : gcd(b, a % b)
      const divisor = gcd(width, height)
      return `${width / divisor}:${height / divisor}`
    }
    return '1:1' // fallback
  }

  // Set the resolution (convert format if needed)
  imageDimension.value = convertResolutionToAspectRatio(props.resolution)

  // Set the prompt in the store
  textToImageStore.prompt = props.prompt

  // Scroll to the top of the page and focus the prompt input
  nextTick(() => {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Try to focus the prompt input after scrolling
    setTimeout(() => {
      // Look for the prompt input (UChatPrompt component)
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
  <UPageCard
    :title="title"
    :orientation="orientation"
    spotlight
    spotlight-color="primary"
    :ui="{
      container: 'lg:items-start'
    }"
  >
    <BasePixelRevealImage
      :src="imageUrl"
      class="order-first lg:order-last w-full"
      custom-class="imagen"
      :pixel-size="4"
      :reveal-speed="50"
      reveal-pattern="random"
      :reveal-delay="500"
      @click="openFullScreen"
      @reveal-complete="onRevealComplete"
      @loaded="onImageLoaded"
      @processing="onImageProcessing"
    />
    <template #title>
      <div class="line-clamp-2">
        {{ title }}
      </div>
    </template>
    <template #description>
      <div class="text-xs mt-2">
        <div class="font-bold line-clamp-2">
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
            {{ presetLabel }}
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
        :label="$t('generateWithSettings')"
        class="cursor-pointer mt-4 w-full justify-center bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600"
        icon="mingcute:ai-fill"
        @click="onGenerateWithSettings"
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
          {{ $t("clickToClose") }}
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
