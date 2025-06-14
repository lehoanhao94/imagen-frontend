<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import AudioVisual from '../AudioVisual.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const lastAudio = computed(() => {
  return (
    props.data?.generated_audio?.[props.data?.generated_audio?.length - 1] || ''
  )
})

const isFullScreenOpen = ref(false)
const isHovered = ref(false)
const isTouchDevice = ref(false)

// Audio player state
const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const audioDuration = ref(0)
const isLoading = ref(false)

// Check if it's a touch device on component mount
onMounted(() => {
  isTouchDevice.value
    = 'ontouchstart' in window || navigator.maxTouchPoints > 0
})

// Cleanup audio on unmount
onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }
})

const openFullScreen = () => {
  // On touch devices, first tap shows overlay, second tap opens fullscreen
  if (isTouchDevice.value && !isHovered.value) {
    isHovered.value = true
    return
  }

  isFullScreenOpen.value = true
}

const closeFullScreen = () => {
  isFullScreenOpen.value = false
  isHovered.value = false
}

// Audio player functions
const togglePlay = async () => {
  if (!audioElement.value) {
    // Create audio element if it doesn't exist
    audioElement.value = new Audio(lastAudio.value?.audio_url || '')

    // Set up event listeners
    audioElement.value.addEventListener('loadedmetadata', () => {
      audioDuration.value = audioElement.value?.duration || 0
    })

    audioElement.value.addEventListener('timeupdate', () => {
      currentTime.value = audioElement.value?.currentTime || 0
    })

    audioElement.value.addEventListener('ended', () => {
      isPlaying.value = false
      currentTime.value = 0
    })

    audioElement.value.addEventListener('loadstart', () => {
      isLoading.value = true
    })

    audioElement.value.addEventListener('canplay', () => {
      isLoading.value = false
    })

    audioElement.value.addEventListener('error', () => {
      isLoading.value = false
      console.error('Audio playback error')
    })
  }

  try {
    if (isPlaying.value) {
      audioElement.value.pause()
      isPlaying.value = false
    } else {
      await audioElement.value.play()
      isPlaying.value = true
    }
  } catch (error) {
    console.error('Audio playback failed:', error)
    isLoading.value = false
  }
}

const seek = (value: number) => {
  if (!audioElement.value) return

  const seekTime = (value / 100) * audioDuration.value
  audioElement.value.currentTime = seekTime
  currentTime.value = seekTime
}

// Format time display
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Progress percentage
const progressPercentage = computed(() => {
  if (audioDuration.value === 0) return 0
  return (currentTime.value / audioDuration.value) * 100
})

// Canvas width for AudioVisual component
const canvasWidth = ref(0)
const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const updateWidth = () => {
    if (containerRef.value) {
      canvasWidth.value = containerRef.value.offsetWidth
    }
  }
  window.addEventListener('resize', updateWidth)
  updateWidth()
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})
</script>

<template>
  <UButton
    :icon="isPlaying ? 'i-heroicons-pause-solid' : 'i-heroicons-play-solid'"
    size="xl"
    color="primary"
    variant="subtle"
    block
    class="rounded-full"
    @click="togglePlay"
  >
    Audio
  </UButton>
</template>

<style scoped>
/* Custom slider styles */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: rgb(var(--color-primary-500));
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: background 0.15s ease-in-out;
}

.slider::-webkit-slider-thumb:hover {
  background: rgb(var(--color-primary-600));
}

.slider::-webkit-slider-track {
  height: 8px;
  cursor: pointer;
  background: #ddd;
  border-radius: 4px;
  border: none;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: rgb(var(--color-primary-500));
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  border: none;
}

.slider::-moz-range-track {
  height: 8px;
  cursor: pointer;
  background: #ddd;
  border-radius: 4px;
  border: none;
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

/* Responsive styles for AudioVisual */
.audio-visual-full {
  width: 100% !important;
  max-width: 100%;
  min-width: 0;
}
</style>
