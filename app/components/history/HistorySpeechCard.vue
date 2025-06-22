<script setup lang="ts">
import { ref, computed } from 'vue'
import WaveformPlayer from '../WaveformPlayer.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const lastAudio = computed(() => {
  return props.data?.generated_audio?.[props.data?.generated_audio?.length - 1] || ''
})

const audioUrl = computed(() => {
  return lastAudio.value?.audio_url || ''
})

const title = computed(() => {
  return props.data?.input_text || props.data?.name || 'Generated Speech'
})

const prompt = computed(() => {
  return props.data?.input_text || props.data?.custom_prompt || 'No prompt available'
})

const model = computed(() => {
  return props.data?.model_name || props.data?.model || 'Speech Model'
})

const voice = computed(() => {
  return props.data?.voice || 'Default Voice'
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
  <UPageCard class="speech-card cursor-pointer" @click="openFullScreen">
    <div class="p-4">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {{ prompt }}
        </p>
      </div>
      
      <div class="mb-4">
        <WaveformPlayer 
          v-if="audioUrl"
          :audio-url="audioUrl"
          :fullscreen="false"
        />
      </div>
      
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
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
        <div class="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {{ title }}
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {{ prompt }}
            </p>
            <div class="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
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
              v-if="audioUrl"
              :audio-url="audioUrl"
              :fullscreen="true"
            />
          </div>
        </div>

        <div class="absolute bottom-4 left-4 text-gray-500 dark:text-gray-400 text-sm">
          Press ESC to close
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.speech-card {
  transition: all 0.2s ease-in-out;
}

.speech-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
