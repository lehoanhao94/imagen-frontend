<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  orientation: {
    type: String as () => 'horizontal' | 'vertical',
    default: 'horizontal'
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  model: {
    type: String,
    default: 'Video Model'
  },
  style: {
    type: String,
    default: 'Dynamic'
  },
  duration: {
    type: String,
    default: '5s'
  },
  uuid: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  'use-prompt': [prompt: string]
}>()

const isFullScreenOpen = ref(false)
const isVideoPlaying = ref(false)

const openFullScreen = () => {
  // If uuid is provided, navigate to detail page instead of opening fullscreen
  if (props.uuid) {
    navigateTo(`/library/video-gen/d/${props.uuid}`)
  } else {
    isFullScreenOpen.value = true
  }
}

const onUsePrompt = () => {
  emit('use-prompt', props.prompt)
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
    <!-- Video thumbnail with play button -->
    <div
      class="relative order-first lg:order-last w-full group cursor-pointer"
      @click="openFullScreen"
    >
      <img
        :src="thumbnailUrl"
        :alt="title"
        class="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
      >
      <!-- Play button overlay -->
      <div class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <UIcon
          name="i-lucide-play"
          class="w-12 h-12 text-white"
        />
      </div>
      <!-- Duration badge -->
      <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {{ duration }}
      </div>
    </div>

    <template #description>
      <div class="text-xs mt-2">
        <div class="font-bold">
          <div>{{ $t("promptDetails") }}</div>
        </div>
        <div class="font-light p-2 bg-muted mt-1 rounded-lg">
          {{ prompt }}
        </div>
      </div>

      <div class="mt-2 grid grid-cols-3">
        <div>
          <div class="text-[10px] font-light">
            {{ $t("model") }}
          </div>
          <div class="text-xs">
            {{ model }}
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
            {{ $t("duration") }}
          </div>
          <div class="text-xs">
            {{ duration }}
          </div>
        </div>
      </div>
      <UChatPromptSubmit
        color="primary"
        :label="$t('useThisPrompt')"
        class="cursor-pointer mt-4 w-full justify-center bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600"
        icon="mingcute:ai-fill"
        @click="onUsePrompt"
      />
      <UButton
        v-if="uuid"
        color="neutral"
        variant="outline"
        :label="$t('viewDetails') || 'View Details'"
        class="cursor-pointer mt-2 w-full justify-center"
        icon="i-lucide-eye"
        @click="openFullScreen"
      />
    </template>
  </UPageCard>

  <!-- Full Screen Video Modal -->
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
        <!-- Prevent click propagation on the video itself -->
        <video
          :src="videoUrl"
          :autoplay="isFullScreenOpen"
          controls
          class="max-h-[90vh] max-w-[90vw] object-contain cursor-auto"
          @click.stop
          @play="isVideoPlaying = true"
          @pause="isVideoPlaying = false"
        />
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="absolute top-4 right-4 text-white hover:bg-white/10"
          @click="isFullScreenOpen = false"
        />
        <div class="absolute bottom-4 text-white/70 text-sm">
          {{ $t('clickToClose') }}
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.video-card {
  transition: transform 0.2s ease;
}
.video-card:hover {
  transform: scale(1.02);
}
</style>
