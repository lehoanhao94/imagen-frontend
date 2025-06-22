<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const router = useRouter()

const { getImageModelLabel } = useImageGenModels()
const { getPersonGenerationLabel } = usePersonGenerationOptions()
const { getSafetyFilterLabel } = useSafetyFilterOptions()
const historyStore = useHistoryStore()
const { showDetailModal, historyDetail, loadings, historyDetailUuid } = storeToRefs(historyStore)

const isHovered = ref(false)
const isTouchDevice = ref(false)

// Check if it's a touch device on component mount
onMounted(() => {
  isTouchDevice.value
    = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  if (!historyDetail.value) {
    historyStore.fetchHistoryDetail(historyDetailUuid.value || route.query.uuid as string)
  }
})

watch(
  () => showDetailModal.value,
  (newValue) => {
    nextTick(() => {
      if (newValue) {
        nextTick(() => {
          historyStore.fetchHistoryDetail(route.query.uuid as string)
        })
      } else {
        historyDetail.value = null
      }
    })
  }
)

onUnmounted(() => {
  // Cleanup if needed
  historyDetail.value = null
})

const generateWithPrompt = () => {
  // Implement the generate functionality here
  historyStore.cloneGeneration(historyDetail.value)
}

const firstImage = computed(() => {
  return historyDetail.value?.generated_image?.[0] || {}
})

const thumbnailImage = computed(() => {
  return firstImage.value?.thumbnails?.find(
    (thumb: any) => thumb.size === 'medium'
  )
})

const title = computed(() => {
  return historyDetail.value?.input_text
})

const style = computed(() => {
  return firstImage.value?.style || historyDetail.value?.style || 'Unknown'
})

const onCloseFullScreen = () => {
  showDetailModal.value = false
  isHovered.value = false
  // Clear the URL query parameter when closing
  router.push({ query: {} })
}
</script>

<template>
  <UModal
    v-model:open="showDetailModal"
    fullscreen
    :ui="{
      content: 'dark:bg-black/90 backdrop-blur-xl'
    }"
    @keydown.esc="showDetailModal = false"
  >
    <template #content>
      <div
        class="relative w-full h-full flex flex-col md:flex-row"
        @click="showDetailModal = false"
      >
        <!-- Close button -->
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="absolute top-4 right-4 dark:text-white hover:bg-white/10 z-10"
          @click="onCloseFullScreen"
        />

        <!-- Left side: Image -->
        <div
          class="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full flex items-center justify-center animate-fadeIn p-4"
        >
          <div
            v-if="loadings['fetchHistoryDetail']"
            class="w-full h-40 flex items-center justify-center"
          >
            <div
              class="text-gray-400 dark:text-gray-600 flex flex-col items-center"
            >
              <UIcon
                name="eos-icons:loading"
                class="w-8 h-8 mb-2"
              />
              {{ $t("Please wait a moment...") }}
            </div>
          </div>
          <!-- Prevent click propagation on the image itself to avoid closing when clicking on the image -->
          <img
            v-else-if="firstImage?.image_url"
            :src="firstImage?.image_url"
            :alt="title"
            class="max-h-full max-w-full object-contain cursor-zoom-out animate-scaleIn shadow-2xl border border-white/10 rounded"
            @click.stop
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
        </div>

        <!-- Right side: Image information and Generate button -->
        <div
          class="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full dark:bg-black/50 bg-muted backdrop-blur-md p-4 md:p-6 lg:p-8 flex flex-col overflow-y-auto animate-slideInRight"
          @click.stop
        >
          <div class="dark:text-white/80 mb-4 md:mb-6">
            <h3 class="dark:text-white text-base md:text-lg font-medium mb-2">
              {{ $t("promptDetails") }}
            </h3>
            <USkeleton
              v-if="loadings['historyDetail']"
              class="h-8 w-full"
            />
            <p
              class="text-xs md:text-sm mb-4 md:mb-6 overflow-y-auto bg-gray-200 p-2 rounded-lg dark:bg-gray-800/50"
            >
              {{ title }}
            </p>

            <BaseInfo
              class="mb-4 md:mb-6"
              :properties="{
                model: getImageModelLabel(historyDetail?.model_name),
                style: style,
                aspectRatio: historyDetail?.aspect_ratio,
                personGeneration: getPersonGenerationLabel(
                  historyDetail?.person_generation
                ),
                safety_filter_level: getSafetyFilterLabel(
                  historyDetail?.safety_filter_level
                ),
                used_credit: historyDetail?.used_credit
              }"
              :loading="loadings['fetchHistoryDetail']"
            />
          </div>

          <div class="mt-auto pt-2 flex flex-row gap-4 items-center">
            <template v-if="loadings['fetchHistoryDetail']">
              <USkeleton class="h-10 w-full" />
              <USkeleton class="h-10 w-10" />
            </template>
            <template v-else>
              <UChatPromptSubmit
                color="primary"
                :label="$t('generateWithPrompt')"
                class="cursor-pointer w-full justify-center bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600"
                icon="mingcute:ai-fill"
                @click="generateWithPrompt"
              />
              <BaseDownloadButton :link="firstImage?.image_url" />
            </template>
          </div>
        </div>

        <div
          v-if="!loadings['fetchHistoryDetail']"
          class="absolute bottom-4 left-4 dark:text-white/70 text-xs md:text-sm hidden md:block"
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
