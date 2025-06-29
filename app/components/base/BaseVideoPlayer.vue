<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const referenceVideo = ref<HTMLVideoElement | null>(null)
const isFullScreenOpen = ref(false)
const isTouchDevice = ref(false)

// Check if it's a touch device on component mount
onMounted(() => {
  isTouchDevice.value
    = 'ontouchstart' in window || navigator.maxTouchPoints > 0
})

const lastGenerated = computed(() => {
  return (
    props.data?.generated_video?.[props.data?.generated_video?.length - 1] || {}
  )
})

const videoUrl = computed(() => {
  return lastGenerated.value?.video_url || ''
})

const isVideoPlaying = ref(false)

const onTogglePlay = () => {
  // dont close the modal when clicking on the video
  if (isTouchDevice.value) {
    isFullScreenOpen.value = true
  }
  if (referenceVideo.value) {
    if (isVideoPlaying.value) {
      referenceVideo.value.pause()
    } else {
      referenceVideo.value.play()
    }
  }
  isVideoPlaying.value = !isVideoPlaying.value
}

const duration = computed(() => {
  const video = lastGenerated.value
  if (video && video.duration) {
    const minutes = Math.floor(video.duration / 60)
    const seconds = Math.floor(video.duration % 60)
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }
  return '0:00'
})

const thumbnailImage = computed(() => {
  return lastGenerated.value?.thumbnails?.find(
    (thumb: any) => thumb.size === 'medium'
  )
})
</script>

<template>
  <div
    v-if="videoUrl"
    class="relative order-first lg:order-last w-full group cursor-pointer"
  >
    <!-- Prevent click propagation on the video itself -->

    <!-- Play button overlay -->
    <div
      class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
      @click.stop="onTogglePlay"
    >
      <UIcon
        :name="isVideoPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
        class="w-12 h-12 text-white cursor-pointer"
      />
    </div>
    <!-- Duration badge -->
    <div
      class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
    >
      {{ duration }}
    </div>

    <video
      ref="referenceVideo"
      :src="videoUrl"
      :autoplay="false"
      controls
      class="object-contain cursor-auto w-full md:h-[95vh] h-[50vh]"
      :poster="thumbnailImage?.url"
      @click.stop
      @play="isVideoPlaying = true"
      @pause="isVideoPlaying = false"
    />
  </div>
  <div
    v-else
    class="w-full h-40 flex items-center justify-center"
  >
    <div class="text-gray-400 dark:text-gray-600 flex flex-col items-center">
      <UIcon
        name="hugeicons:video-off"
        class="w-8 h-8 mb-2"
      />
      {{ $t("noVideoAvailable") }}
    </div>
  </div>
</template>
