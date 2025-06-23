<script setup lang="ts">
import { ref, computed } from 'vue'
import WaveformPlayer from '../WaveformPlayer.vue'

interface Props {
  data?: any
  audioUrl?: string
  title?: string
  prompt?: string
  preset?: string
  voice?: string
  duration?: string
  orientation?: string
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  audioUrl: '',
  title: '',
  prompt: '',
  preset: '',
  voice: '',
  duration: '',
  orientation: 'vertical'
})

const lastAudio = computed(() => {
  return (
    props.data?.generated_audio?.[props.data?.generated_audio?.length - 1] || ''
  )
})

const audioUrl = computed(() => {
  // Use individual prop first, then fall back to data prop
  return props.audioUrl || lastAudio.value?.audio_url || ''
})

const title = computed(() => {
  // Use individual prop first, then fall back to data prop
  return (
    props.title
    || props.data?.input_text
    || props.data?.name
    || 'Generated Speech'
  )
})

const prompt = computed(() => {
  // Use individual prop first, then fall back to data prop
  return (
    props.prompt
    || props.data?.input_text
    || props.data?.custom_prompt
    || 'No prompt available'
  )
})

const model = computed(() => {
  // Use individual prop first, then fall back to data prop
  return (
    props.preset
    || props.data?.model_name
    || props.data?.model
    || 'Speech Model'
  )
})

const voice = computed(() => {
  // Use individual prop first, then fall back to data prop
  return props.voice || props.data?.voice || 'Default Voice'
})

const isFullScreenOpen = ref(false)

const openFullScreen = () => {
  isFullScreenOpen.value = true
}

const closeFullScreen = () => {
  isFullScreenOpen.value = false
}
</script>

<template>
  <!-- Card View -->
  <UPageCard class="speech-card cursor-pointer">
    <div class="p-0">
      <div
        class="mb-4 cursor-pointer"
        @click="openFullScreen"
      >
        <p
          class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 hover:text-primary-500"
        >
          {{ prompt }}
        </p>
      </div>

      <div class="mb-4">
        <WaveformPlayer
          :audio-url="audioUrl"
          :fullscreen="false"
        />
      </div>

      <div
        class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
      >
        <span>{{ model }}</span>
        <span>{{ voice }}</span>
      </div>
    </div>
  </UPageCard>

  <!-- Full Screen Modal -->
  <UModal
    v-model:open="isFullScreenOpen"
    fullscreen
    :ui="{
      content: 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl'
    }"
    @keydown.esc="closeFullScreen"
  >
    <template #content>
      <div class="relative w-full h-full flex flex-col p-8">
        <!-- Close button -->
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="absolute top-4 right-4 z-10"
          @click="closeFullScreen"
        />

        <!-- Content -->
        <div
          class="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full"
        >
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {{ title }}
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {{ prompt }}
            </p>
            <div
              class="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
            >
              <span class="flex items-center gap-2">
                <UIcon name="i-lucide-cpu" />
                {{ model }}
              </span>
              <span class="flex items-center gap-2">
                <UIcon name="i-lucide-mic" />
                {{ voice }}
              </span>
            </div>
          </div>

          <div class="bg-white/50 dark:bg-gray-800/50 rounded-lg p-8">
            <WaveformPlayer
              :audio-url="audioUrl"
              :fullscreen="true"
            />
          </div>
        </div>

        <div
          class="absolute bottom-4 left-4 text-gray-500 dark:text-gray-400 text-sm"
        >
          Press ESC to close
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
