<template>
  <div class="waveform-container">
    <div
      v-if="props.audioUrl && props.audioUrl !== '#'"
      ref="waveformRef"
      :class="[
        'waveform-player',
        fullscreen ? 'waveform-fullscreen' : 'waveform-card'
      ]"
    />
    <div
      v-else
      :class="[
        'waveform-placeholder',
        fullscreen ? 'waveform-fullscreen' : 'waveform-card'
      ]"
    >
      <div class="no-audio-message">
        <UIcon
          name="i-heroicons-musical-note"
          class="w-8 h-8 text-gray-400"
        />
        <span class="text-gray-500 text-sm">No audio available</span>
      </div>
    </div>

    <div
      v-if="props.audioUrl && props.audioUrl !== '#'"
      class="waveform-controls"
    >
      <UButton
        :icon="isPlaying ? 'i-heroicons-pause-solid' : 'i-heroicons-play-solid'"
        :loading="isLoading"
        size="sm"
        color="primary"
        variant="soft"
        @click="togglePlay"
      />
      <div class="time-display">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import WaveSurfer from 'wavesurfer.js'

interface Props {
  audioUrl: string
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fullscreen: false
})

const emit = defineEmits<{
  ready: [duration: number]
  timeupdate: [currentTime: number]
  finish: []
}>()

const waveformRef = ref<HTMLElement>()
const wavesurfer = ref<WaveSurfer>()
const isPlaying = ref(false)
const isLoading = ref(true)
const currentTime = ref(0)
const duration = ref(0)

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (wavesurfer.value) {
    wavesurfer.value.playPause()
  }
}

const initWaveSurfer = () => {
  if (!waveformRef.value || !props.audioUrl || props.audioUrl === '#') return

  wavesurfer.value = WaveSurfer.create({
    container: waveformRef.value,
    waveColor: props.fullscreen ? '#4F46E5' : '#A78BFA',
    progressColor: props.fullscreen ? '#6366F1' : '#8B5CF6',
    cursorColor: '#EF4444',
    barWidth: 2,
    barRadius: 1,
    height: props.fullscreen ? 80 : 60,
    normalize: true
  })

  wavesurfer.value.load(props.audioUrl)

  // Event listeners
  wavesurfer.value.on('ready', () => {
    isLoading.value = false
    duration.value = wavesurfer.value?.getDuration() || 0
    emit('ready', duration.value)
  })

  wavesurfer.value.on('play', () => {
    isPlaying.value = true
  })

  wavesurfer.value.on('pause', () => {
    isPlaying.value = false
  })

  wavesurfer.value.on('finish', () => {
    isPlaying.value = false
    emit('finish')
  })

  wavesurfer.value.on('timeupdate', (currentTimeSeconds) => {
    currentTime.value = currentTimeSeconds || 0
    emit('timeupdate', currentTime.value)
  })

  wavesurfer.value.on('error', (error: any) => {
    console.error('Wavesurfer error:', error)
    isLoading.value = false
  })
}

onMounted(() => {
  nextTick(() => {
    initWaveSurfer()
  })
})

onUnmounted(() => {
  if (wavesurfer.value) {
    wavesurfer.value.destroy()
  }
})

// Watch for audioUrl changes
watch(() => props.audioUrl, (newUrl) => {
  if (newUrl && newUrl !== '#' && wavesurfer.value) {
    isLoading.value = true
    wavesurfer.value.load(newUrl)
  }
})
</script>

<style scoped>
.waveform-container {
  width: 100%;
}

.waveform-player {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.waveform-placeholder {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(249 250 251);
  border: 2px dashed rgb(209 213 219);
}

.dark .waveform-placeholder {
  background-color: rgb(31 41 55);
  border-color: rgb(75 85 99);
}

.no-audio-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.waveform-card {
  min-height: 60px;
}

.waveform-fullscreen {
  min-height: 80px;
}

.waveform-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.time-display {
  font-size: 0.875rem;
  color: rgb(107 114 128);
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
}

.dark .time-display {
  color: rgb(156 163 175);
}
</style>
