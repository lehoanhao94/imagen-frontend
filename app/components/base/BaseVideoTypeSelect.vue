<script setup lang="ts">
interface VideoType {
  id: string
  title: string
  description: string
  icon: string
}

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

interface VideoTypeSelectProps {
  modelValue?: VideoType | null
}

const props = defineProps<VideoTypeSelectProps>()
const emit = defineEmits<{
  'update:modelValue': [value: VideoType]
}>()

const { t } = useI18n()

const videoTypes: VideoType[] = [
  {
    id: 'advertising-marketing',
    title: t('videoTypes.advertisingMarketing.title'),
    description: t('videoTypes.advertisingMarketing.description'),
    icon: 'lucide:megaphone'
  },
  {
    id: 'social-media-content',
    title: t('videoTypes.socialMediaContent.title'),
    description: t('videoTypes.socialMediaContent.description'),
    icon: 'lucide:smartphone'
  },
  {
    id: 'personal-entertainment',
    title: t('videoTypes.personalEntertainment.title'),
    description: t('videoTypes.personalEntertainment.description'),
    icon: 'lucide:clapperboard'
  },
  {
    id: 'education-training',
    title: t('videoTypes.educationTraining.title'),
    description: t('videoTypes.educationTraining.description'),
    icon: 'lucide:graduation-cap'
  },
  {
    id: 'corporate-communication',
    title: t('videoTypes.corporateCommunication.title'),
    description: t('videoTypes.corporateCommunication.description'),
    icon: 'lucide:building-2'
  },
  {
    id: 'personalized-videos',
    title: t('videoTypes.personalizedVideos.title'),
    description: t('videoTypes.personalizedVideos.description'),
    icon: 'material-symbols:personal-injury'
  }
]

// Video examples for each type
const videoExamplesByType: Record<string, VideoExample[]> = {
  'advertising-marketing': [
    {
      id: '1',
      title: 'Product Launch Ad',
      prompt:
        'Modern product showcase with dynamic camera movements, sleek lighting, professional commercial style, high-end branding',
      videoUrl:
        'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
      model: 'Veo 2',
      style: 'Commercial',
      duration: '5s'
    }
  ],
  'social-media-content': [
    {
      id: '3',
      title: 'TikTok Dance Trend',
      prompt:
        'Energetic dance video with vibrant colors, quick cuts, trending music, vertical format, social media style',
      videoUrl:
        'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop',
      model: 'RunwayML Gen-3',
      style: 'Dynamic',
      duration: '3s'
    }
  ],
  'personal-entertainment': [
    {
      id: '5',
      title: 'Comedy Sketch',
      prompt:
        'Funny comedy scene with expressive characters, humorous situations, entertaining dialogue, lighthearted mood',
      videoUrl:
        'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop',
      model: 'RunwayML Gen-3',
      style: 'Comedy',
      duration: '6s'
    }
  ],
  'education-training': [
    {
      id: '6',
      title: 'Tutorial Video',
      prompt:
        'Educational content with clear explanations, step-by-step demonstrations, professional presentation style',
      videoUrl:
        'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop',
      model: 'Veo 2',
      style: 'Educational',
      duration: '7s'
    }
  ],
  'corporate-communication': [
    {
      id: '7',
      title: 'Company Announcement',
      prompt:
        'Professional corporate video with executive presentation, clean office environment, business formal style',
      videoUrl:
        'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop',
      model: 'Veo 2',
      style: 'Corporate',
      duration: '5s'
    }
  ],
  'personalized-videos': [
    {
      id: '8',
      title: 'Birthday Greeting',
      prompt:
        'Personalized birthday video with festive decorations, warm lighting, celebratory atmosphere, heartfelt message',
      videoUrl:
        'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=300&fit=crop',
      model: 'RunwayML Gen-3',
      style: 'Personal',
      duration: '4s'
    }
  ],
  'time-cost-savings': [
    {
      id: '9',
      title: 'Quick Promo Video',
      prompt:
        'Fast-paced promotional content with efficient production, cost-effective visuals, streamlined messaging',
      videoUrl:
        'https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
      model: 'Veo 2',
      style: 'Efficient',
      duration: '3s'
    }
  ]
}

const selectedType = ref<VideoType | null>(props.modelValue || null)
const isModalOpen = ref(false)
const tempSelectedType = ref<VideoType | null>(null)
const playingVideos = ref<Set<string>>(new Set())

const openModal = () => {
  tempSelectedType.value = selectedType.value
  isModalOpen.value = true
}

const confirmSelection = () => {
  if (tempSelectedType.value) {
    selectedType.value = tempSelectedType.value
    emit('update:modelValue', tempSelectedType.value)
  }
  isModalOpen.value = false
}

const cancelSelection = () => {
  tempSelectedType.value = selectedType.value
  isModalOpen.value = false
}

const selectTempType = (type: VideoType) => {
  tempSelectedType.value = type
}

const currentVideoExamples = computed(() => {
  if (!tempSelectedType.value) return []
  return videoExamplesByType[tempSelectedType.value.id] || []
})

const playVideo = (exampleId: string) => {
  playingVideos.value.add(exampleId)
}

const pauseVideo = (exampleId: string) => {
  playingVideos.value.delete(exampleId)
}

const isVideoPlaying = (exampleId: string) => {
  return playingVideos.value.has(exampleId)
}

watch(
  () => props.modelValue,
  (newValue) => {
    selectedType.value = newValue || null
  }
)
</script>

<template>
  <div>
    <!-- Button to open Modal -->
    <UButton
      :label="
        selectedType ? selectedType.title : t('videoTypes.selectVideoType')
      "
      :icon="selectedType ? selectedType.icon : 'lucide:video'"
      color="neutral"
      variant="outline"
      trailing-icon="lucide:chevron-down"
      class="justify-between"
      v-bind="$attrs"
      @click="openModal"
    />

    <!-- Video Type Selection Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="t('videoTypes.selectVideoType')"
      :ui="{ footer: 'justify-end', content: 'max-w-6xl', body: '!p-0' }"
    >
      <template #body>
        <div class="h-full grid grid-cols-12 gap-4">
          <div
            class="flex flex-col p-4 gap-4 col-span-12 lg:col-span-7 h-[50vh] sm:h-full overflow-y-auto sm:overflow-visible"
          >
            <UCard
              v-for="type in videoTypes"
              :key="type.id"
              class="cursor-pointer transition-all duration-200 hover:shadow-md"
              :class="{
                'ring-1 ring-primary-500 bg-primary-50 dark:bg-primary-950':
                  tempSelectedType?.id === type.id,
                'hover:bg-gray-50 dark:hover:bg-gray-800':
                  tempSelectedType?.id !== type.id
              }"
              @click="selectTempType(type)"
            >
              <div class="flex items-start gap-3">
                <UIcon
                  :name="type.icon"
                  class="w-6 h-6 text-primary-500 mt-1 flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <h5
                    class="font-medium text-sm text-gray-900 dark:text-white line-clamp-2"
                  >
                    {{ type.title }}
                  </h5>
                  <p
                    class="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2"
                  >
                    {{ type.description }}
                  </p>
                </div>
                <UIcon
                  v-if="tempSelectedType?.id === type.id"
                  name="lucide:check-circle"
                  class="w-5 h-5 text-primary-500 flex-shrink-0"
                />
              </div>
            </UCard>
          </div>
          <div class="col-span-12 lg:col-span-5 relative dark:bg-slate-950 p-4 px-6">
            <div class="sticky top-4 sm:h-[70vh">
              <div class="space-y-4">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ t("videoTypes.examples") }}
                </h4>
                <div
                  v-if="tempSelectedType"
                  class="space-y-4 overflow-y-auto"
                >
                  <div
                    v-for="example in currentVideoExamples"
                    :key="example.id"
                    class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <!-- Video Thumbnail -->
                    <div
                      class="relative aspect-video bg-gray-100 dark:bg-gray-800"
                    >
                      <!-- Video Element (when playing) -->
                      <video
                        v-if="isVideoPlaying(example.id)"
                        :src="example.videoUrl"
                        autoplay
                        controls
                        class="w-full h-full object-cover"
                        @ended="pauseVideo(example.id)"
                        @pause="pauseVideo(example.id)"
                      />
                      <!-- Thumbnail Image (when not playing) -->
                      <template v-else>
                        <img
                          :src="example.thumbnailUrl"
                          :alt="example.title"
                          class="w-full h-full object-cover"
                        >
                        <div
                          class="absolute inset-0 flex items-center justify-center"
                        >
                          <UButton
                            icon="lucide:play"
                            color="primary"
                            variant="solid"
                            size="lg"
                            class="rounded-full shadow-lg"
                            @click="playVideo(example.id)"
                          />
                        </div>
                      </template>
                    </div>

                    <!-- Video Info -->
                    <div class="p-3">
                      <h6
                        class="font-medium text-sm text-gray-900 dark:text-white"
                      >
                        {{ example.title }}
                      </h6>
                      <p
                        class="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2"
                      >
                        {{ example.prompt }}
                      </p>
                      <div
                        class="flex items-center gap-2 mt-2 text-xs text-gray-500"
                      >
                        <span>{{ example.model }}</span>
                        <span>•</span>
                        <span>{{ example.style }}</span>
                        <span>•</span>
                        <span>{{ example.duration }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="flex items-center justify-center h-[60vh] text-gray-500"
                >
                  <div class="text-center">
                    <UIcon
                      name="lucide:video"
                      class="w-12 h-12 mx-auto mb-2 opacity-50"
                    />
                    <p class="text-sm">
                      {{ t("videoTypes.selectTypeToSeeExamples") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <UButton
          :label="t('cancel')"
          color="neutral"
          variant="outline"
          @click="cancelSelection"
        />
        <UButton
          :label="t('confirm')"
          color="primary"
          :disabled="!tempSelectedType"
          @click="confirmSelection"
        />
      </template>
    </UModal>
  </div>
</template>
