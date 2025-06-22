<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const router = useRouter()

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
  // preset: {
  //   type: String,
  //   default: "Imagen 3",
  // },
  // style: {
  //   type: String,
  //   default: "Dynamic",
  // },
  // resolution: {
  //   type: String,
  //   default: "1024x1024",
  // },
  data: {
    type: Object,
    default: () => ({})
  }
})

const historyStore = useHistoryStore()
const { showDetailModal, historyDetail } = storeToRefs(historyStore)
const { getImageModelLabel } = useImageGenModels()
const { getPersonGenerationLabel } = usePersonGenerationOptions()
const { getSafetyFilterLabel } = useSafetyFilterOptions()

const isFullScreenOpen = ref(false)
const isHovered = ref(false)
const isTouchDevice = ref(false)

// Check if it's a touch device on component mount
onMounted(() => {
  isTouchDevice.value
    = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  if (route.query.uuid && route.query.uuid === props.data.uuid) {
    isFullScreenOpen.value = true
  }
})

const openFullScreen = () => {
  // On touch devices, first tap shows overlay, second tap opens fullscreen
  if (isTouchDevice.value && !isHovered.value) {
    isHovered.value = true
    return
  }
  historyDetail.value = props.data as any
  showDetailModal.value = true
  // Update the URL to include the ID for navigation
  if (props.data.uuid) {
    router.push({ query: { uuid: props.data.uuid } })
  }
  isHovered.value = false
}

const generateWithPrompt = () => {
  // Implement the generate functionality here
  console.log('Generating with prompt:', title.value)
}

const firstImage = computed(() => {
  return props.data?.generated_image?.[0] || {}
})

const thumbnailImage = computed(() => {
  return firstImage.value?.thumbnails?.find(
    (thumb: any) => thumb.size === 'medium'
  )
})

const title = computed(() => {
  return props.data?.input_text
})

const style = computed(() => {
  return firstImage.value?.style || props.data?.style || 'Unknown'
})

const onCloseFullScreen = () => {
  isFullScreenOpen.value = false
  isHovered.value = false
  // Clear the URL query parameter when closing
  router.push({ query: {} })
}
</script>

<template>
  <HistoryWrapper
    :type="data.type"
    :style="style"
  >
    <UPageCard
      :orientation="'vertical'"
      spotlight
      spotlight-color="primary"
      :ui="{
        container: 'lg:items-start sm:p-0',
        root: 'overflow-hidden relative group'
      }"
      @click="openFullScreen"
    >
      <div class="relative w-full h-full aspect-square sm:aspect-auto">
        <img
          v-if="thumbnailImage?.url || firstImage?.image_url"
          :src="thumbnailImage?.url || firstImage?.image_url"
          :alt="data.id"
          class="w-full h-full object-cover imagen cursor-pointer transition-opacity"
          @click="openFullScreen"
        >
        <div
          v-else
          class="w-full h-40 flex items-center justify-center"
        >
          <div
            class="text-gray-400 dark:text-gray-600 flex flex-col items-center"
          >
            <UIcon
              name="i-lucide-image-off"
              class="w-8 h-8 mb-2"
            />
            {{ $t("noImageAvailable") }}
          </div>
        </div>
        <!-- Hover Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4"
          :class="{ 'opacity-100': isHovered }"
        >
          <div class="flex justify-between items-start gap-2">
            <div
              class="dark:text-white text-gray-100 font-medium text-sm line-clamp-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer hover:underline hover:text-primary"
              :class="{ 'translate-y-0 opacity-100': isHovered }"
              @click.stop="openFullScreen"
            >
              {{ title }}
            </div>
            <div class="flex gap-2">
              <UButton
                icon="i-lucide-maximize"
                color="neutral"
                variant="ghost"
                size="xs"
                class="dark:text-white text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 hover:bg-white/10"
                :class="{ 'opacity-100': isHovered }"
                @click.stop="openFullScreen"
              />
            </div>
          </div>
          <div class="flex flex-row gap-2 w-full items-center mt-auto">
            <BaseDownloadButton
              :link="firstImage?.image_url"
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150"
              :class="{ 'opacity-100': isHovered }"
              :label="$t('downloadImage')"
              size="sm"
              block
              @click.stop="() => (isFullScreenOpen = false)"
            />
          </div>
        </div>
      </div>
    </UPageCard>
  </HistoryWrapper>
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
