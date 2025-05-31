<script setup lang="ts">
interface VideoExample {
  id: string
  title: string
  prompt: string
  videoUrl: string
  thumbnailUrl: string
  model: string
  style: string
  duration: string
}

const emit = defineEmits<{
  'use-prompt': [prompt: string]
}>()

// Sample video data with prompts and settings
const videoExamples: VideoExample[] = [
  {
    id: '1',
    title: 'Serene Ocean Waves',
    prompt: 'A serene ocean scene with gentle waves rolling onto a sandy beach at golden hour, soft lighting, peaceful atmosphere, high quality, cinematic',
    videoUrl: 'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
    model: 'Leonardo Phoenix',
    style: 'Cinematic',
    duration: '5s'
  },
  {
    id: '2',
    title: 'Mountain Landscape',
    prompt: 'Majestic mountain landscape with snow-capped peaks, morning mist, dramatic clouds, time-lapse style, breathtaking vista, 4K quality',
    videoUrl: 'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    model: 'Video Gen Pro',
    style: 'Realistic',
    duration: '8s'
  },
  {
    id: '3',
    title: 'City at Night',
    prompt: 'Bustling city street at night with neon lights, car traffic light trails, urban atmosphere, vibrant colors, modern cityscape',
    videoUrl: 'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&h=300&fit=crop',
    model: 'Imagen Video',
    style: 'Urban',
    duration: '6s'
  },
  {
    id: '4',
    title: 'Forest Path',
    prompt: 'Enchanted forest path with dappled sunlight filtering through tall trees, magical atmosphere, nature walk, peaceful journey',
    videoUrl: 'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop',
    model: 'Leonardo Phoenix',
    style: 'Fantasy',
    duration: '7s'
  }
]

const onUsePrompt = (prompt: string) => {
  emit('use-prompt', prompt)
}
</script>

<template>
  <UPageSection
    :title="$t('videoExamples')"
    :description="$t('videoExamplesDescription')"
    :ui="{
      container: 'px-0 !pt-6 sm:gap-6 lg:gap-8',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Motion
        v-for="(video, index) in videoExamples"
        :key="video.id"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.1 * index }"
        :in-view-options="{ once: true }"
      >
        <VideoPromptCard
          :title="video.title"
          :prompt="video.prompt"
          :video-url="video.videoUrl"
          :thumbnail-url="video.thumbnailUrl"
          :model="video.model"
          :style="video.style"
          :duration="video.duration"
          orientation="horizontal"
          @use-prompt="onUsePrompt"
        />
      </Motion>
    </div>
  </UPageSection>
</template>
