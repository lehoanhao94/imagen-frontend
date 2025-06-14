<template>
  <!-- Full Screen Video Detail Modal -->
  <UModal
    v-model:open="isOpen"
    fullscreen
    :ui="{
      content: 'bg-black/90 backdrop-blur-xl'
    }"
    @keydown.esc="closeModal"
  >
    <template #content>
      <div
        class="relative w-full h-full flex flex-col md:flex-row"
        @click="closeModal"
      >
        <!-- Close button -->
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
          @click="closeModal"
        />

        <!-- Left side: Video -->
        <div
          class="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full flex items-center justify-center animate-fadeIn p-4"
        >
          <!-- Prevent click propagation on the video itself to avoid closing when clicking on the video -->
          <div class="relative order-first lg:order-last w-full group cursor-pointer">
            <!-- Prevent click propagation on the video itself -->
            <video
              v-if="videoData?.media_url"
              ref="referenceVideo"
              :src="videoData.media_url"
              :poster="videoData.thumbnail_url"
              :autoplay="false"
              controls
              class="w-full h-full object-contain cursor-auto max-h-[90vh]"
              @click.stop
              @play="isVideoPlaying = true"
              @pause="isVideoPlaying = false"
            />

            <!-- Fallback for no video -->
            <div
              v-else
              class="w-full h-96 bg-gray-800 flex items-center justify-center rounded-lg"
              @click.stop
            >
              <UIcon
                name="i-lucide-video-off"
                class="w-16 h-16 text-gray-400"
              />
            </div>

            <!-- Play button overlay -->
            <div
              v-if="videoData?.media_url && !isVideoPlaying"
              class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              @click.stop="onTogglePlay"
            >
              <UIcon
                :name="isVideoPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
                class="w-12 h-12 text-white"
              />
            </div>

            <!-- Duration badge -->
            <div
              v-if="duration && videoData?.media_url"
              class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
            >
              {{ duration }}
            </div>
          </div>
        </div>

        <!-- Right side: Video information and actions -->
        <div
          class="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full bg-black/50 backdrop-blur-md p-4 md:p-6 lg:p-8 flex flex-col overflow-y-auto animate-slideInRight"
          @click.stop
        >
          <h2 class="text-white text-xl md:text-2xl font-medium mb-4 md:mb-6">
            {{ videoData?.name || videoData?.input_text || $t('libraryPages.videoDetails') }}
          </h2>

          <div class="text-white/80 mb-4 md:mb-6">
            <h3 class="text-white text-base md:text-lg font-medium mb-2">
              {{ $t("promptDetails") }}
            </h3>
            <p
              class="text-xs md:text-sm mb-4 md:mb-6 overflow-y-auto bg-muted p-2 rounded-lg"
            >
              {{ videoData?.input_text }}
            </p>

            <div class="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
              <div v-if="videoData?.model_name || videoData?.model">
                <h4 class="text-white/60 text-xs uppercase mb-1">
                  {{ $t("model") || "Model" }}
                </h4>
                <p class="text-xs md:text-sm">
                  {{ videoData?.model_name || videoData?.model }}
                </p>
              </div>

              <div v-if="videoData?.status !== undefined">
                <h4 class="text-white/60 text-xs uppercase mb-1">
                  {{ $t("status") || "Status" }}
                </h4>
                <p class="text-xs md:text-sm">
                  {{ getStatusText(videoData.status) }}
                </p>
              </div>

              <div v-if="videoData?.used_credit">
                <h4 class="text-white/60 text-xs uppercase mb-1">
                  {{ $t("usedCredits") || "Credits" }}
                </h4>
                <p class="text-xs md:text-sm">
                  {{ videoData.used_credit }}
                </p>
              </div>

              <div v-if="videoData?.file_size">
                <h4 class="text-white/60 text-xs uppercase mb-1">
                  {{ $t("fileSize") || "Size" }}
                </h4>
                <p class="text-xs md:text-sm">
                  {{ formatFileSize(videoData.file_size) }}
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="showGenerateButton"
            class="mt-auto pt-2"
          >
            <UButton
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

<script setup lang="ts">
interface VideoDetailModalProps {
  modelValue?: boolean
  videoData?: any
  showGenerateButton?: boolean
}

const props = withDefaults(defineProps<VideoDetailModalProps>(), {
  modelValue: false,
  videoData: () => ({}),
  showGenerateButton: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'generate': [prompt: string]
}>()

const { t } = useI18n()

const referenceVideo = ref<HTMLVideoElement | null>(null)
const isVideoPlaying = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const onTogglePlay = () => {
  if (referenceVideo.value) {
    if (isVideoPlaying.value) {
      referenceVideo.value.pause()
    } else {
      referenceVideo.value.play()
    }
  }
  isVideoPlaying.value = !isVideoPlaying.value
}

const generateWithPrompt = () => {
  emit('generate', props.videoData?.input_text || '')
}

const duration = computed(() => {
  const video = referenceVideo.value
  if (video && video.duration) {
    const minutes = Math.floor(video.duration / 60)
    const seconds = Math.floor(video.duration % 60)
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }
  return '0:00'
})

const getStatusText = (status: number) => {
  switch (status) {
    case 2:
      return t('completed') || 'Completed'
    case 1:
      return t('processing') || 'Processing'
    default:
      return t('failed') || 'Failed'
  }
}

const formatFileSize = (bytes: number) => {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}
</script>

<style scoped>
/* Animation for modal content */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
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
