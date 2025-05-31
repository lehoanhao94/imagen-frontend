<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

/**
 * Library page with tabs and infinite scroll functionality
 *
 * Features:
 * - Tabs for different content types (Imagen, Video, Speech, Music)
 * - Route query parameter to maintain active tab on reload
 * - Loads initial set of items for each tab
 * - Detects when user scrolls to bottom of page
 * - Loads additional items and appends to existing list
 * - Shows loading indicator while fetching
 * - Maintains original data order (old data first, new data appended)
 */

// Tab definitions
const tabItems = computed(() => [
  {
    key: 'imagen',
    label: t('library.tabs.imagen'),
    icon: 'hugeicons:ai-image'
  },
  {
    key: 'video',
    label: t('library.tabs.video'),
    icon: 'hugeicons:ai-video'
  },
  {
    key: 'speech',
    label: t('library.tabs.speech'),
    icon: 'hugeicons:ai-voice'
  },
  {
    key: 'music',
    label: t('library.tabs.music'),
    icon: 'ri:music-ai-fill'
  }
])

// Active tab management
const activeTab = ref(route.query.tab as string || 'imagen')

// Update route when tab changes
const updateRoute = (tabKey: string) => {
  router.push({ query: { ...route.query, tab: tabKey } })
}

// Watch for route changes to update active tab
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string') {
    activeTab.value = newTab
  }
})

// Watch active tab changes to update route
watch(activeTab, (newTab) => {
  updateRoute(newTab)
})
// Mock data for images (existing)
const imagenInitialData = [
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/ae43823c-9b34-43ec-89d8-a561b2d817cf/generations/09b9108b-e6c3-4300-a31d-4a5a6012e2e1/Leonardo_Phoenix_10_create_an_illustration_of_A_woman_wearing_2.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/b6c8b211-6345-4cc4-a86b-efa3673506e3/generations/022ef9ef-7435-4580-ada9-bfc39ee325c3/Leonardo_Phoenix_10_A_sophisticated_lady_in_a_forest_green_tea_0.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/846c2e73-4c2d-4138-afa2-c2f6feecf304/generations/240454cc-405d-4c9d-89bf-8e265324a9cf/Leonardo_Phoenix_10_An_illustration_of_a_graceful_female_figur_0.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/c675554b-c126-47eb-936a-7ee76290f5e3/generations/27d15640-a5a9-4dbc-a9bc-40fd28f82d10/Leonardo_Phoenix_10_Create_an_image_of_a_majestic_tortoise_in_3.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/dc4608ba-6fc1-415e-ad8f-8dde28127c66/generations/6313bb9e-0ba2-4e65-a72d-561b348e2100/Leonardo_Phoenix_10_Vibrant_and_highly_detailed_photograph_of_2.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  }
]

// Mock data for videos
const videoInitialData = [
  {
    videoUrl: '#',
    thumbnailUrl: 'https://cdn.leonardo.ai/users/ae43823c-9b34-43ec-89d8-a561b2d817cf/generations/09b9108b-e6c3-4300-a31d-4a5a6012e2e1/Leonardo_Phoenix_10_create_an_illustration_of_A_woman_wearing_2.jpg?w=512',
    title: 'Create a cinematic video of a woman dancing',
    prompt: 'A beautiful woman with flowing hair dancing gracefully in a sunlit meadow, slow motion, cinematic lighting, golden hour',
    model: 'Veo 2',
    style: 'Cinematic',
    duration: '5s'
  },
  {
    videoUrl: '#',
    thumbnailUrl: 'https://cdn.leonardo.ai/users/b6c8b211-6345-4cc4-a86b-efa3673506e3/generations/022ef9ef-7435-4580-ada9-bfc39ee325c3/Leonardo_Phoenix_10_A_sophisticated_lady_in_a_forest_green_tea_0.jpg?w=512',
    title: 'Abstract geometric animation',
    prompt: 'Abstract geometric shapes morphing and transforming in space, vibrant colors, modern art style',
    model: 'Veo 3',
    style: 'Abstract',
    duration: '8s'
  }
]

// Mock data for speech
const speechInitialData = [
  {
    audioUrl: '#',
    thumbnailUrl: 'https://cdn.leonardo.ai/users/846c2e73-4c2d-4138-afa2-c2f6feecf304/generations/240454cc-405d-4c9d-89bf-8e265324a9cf/Leonardo_Phoenix_10_An_illustration_of_a_graceful_female_figur_0.jpg?w=512',
    title: 'Motivational Speech Generation',
    prompt: 'Generate an inspiring motivational speech about overcoming challenges and achieving dreams',
    model: 'Gemini 2.5 Pro',
    voice: 'Professional',
    duration: '2m 30s'
  },
  {
    audioUrl: '#',
    thumbnailUrl: 'https://cdn.leonardo.ai/users/c675554b-c126-47eb-936a-7ee76290f5e3/generations/27d15640-a5a9-4dbc-a9bc-40fd28f82d10/Leonardo_Phoenix_10_Create_an_image_of_a_majestic_tortoise_in_3.jpg?w=512',
    title: 'Storytelling Voice Generation',
    prompt: 'Create a storytelling voice for a children\'s fairy tale with a warm and gentle tone',
    model: 'Gemini 2.5 Flash',
    voice: 'Gentle',
    duration: '1m 45s'
  }
]

// Mock data for music
const musicInitialData = [
  {
    audioUrl: '#',
    thumbnailUrl: 'https://cdn.leonardo.ai/users/dc4608ba-6fc1-415e-ad8f-8dde28127c66/generations/6313bb9e-0ba2-4e65-a72d-561b348e2100/Leonardo_Phoenix_10_Vibrant_and_highly_detailed_photograph_of_2.jpg?w=512',
    title: 'Upbeat Electronic Music',
    prompt: 'Create an upbeat electronic dance music track with synthesizers and a strong bass line',
    model: 'Music Gen Pro',
    genre: 'Electronic',
    duration: '3m 15s'
  },
  {
    audioUrl: '#', 
    thumbnailUrl: 'https://cdn.leonardo.ai/users/f33d9042-22f3-4fbb-96ef-923567ea1ed9/generations/50b0bcd7-58f9-4a2c-a8c7-6a5a356bd852/Leonardo_Phoenix_10_Create_a_minimalist_and_elegant_vintageins_2.jpg?w=512',
    title: 'Relaxing Ambient Music',
    prompt: 'Generate a peaceful ambient music track with nature sounds and soft melodies for meditation',
    model: 'Music Gen Standard',
    genre: 'Ambient',
    duration: '5m 20s'
  }
]

// More sample data for pagination
const imagenMoreData = [
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/f33d9042-22f3-4fbb-96ef-923567ea1ed9/generations/50b0bcd7-58f9-4a2c-a8c7-6a5a356bd852/Leonardo_Phoenix_10_Create_a_minimalist_and_elegant_vintageins_2.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/9a6d696b-3a81-4d92-bc5c-7a17fa079e18/generations/d4e3a995-ef53-4bc0-941a-7f0c9ef5d21f/Leonardo_Phoenix_10_A_weathered_rusty_old_train_its_carriages_3.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  }
]

const videoMoreData = [
  {
    videoUrl: '#',
    thumbnailUrl: 'https://cdn.leonardo.ai/users/4315e00c-057a-48d6-908a-01aa2c0bd0ad/generations/aa62988f-090e-49bb-9cda-b5b31476e22c/Leonardo_Phoenix_10_depict_water_color_style_semi_anime_japan_3.jpg?w=512',
    title: 'Watercolor animation style',
    prompt: 'A watercolor style animation of cherry blossoms falling in a Japanese garden',
    model: 'Veo 2',
    style: 'Watercolor',
    duration: '6s'
  }
]

const speechMoreData = [
  {
    audioUrl: '#',
    thumbnailUrl: 'https://cdn.leonardo.ai/users/75e44a4e-fca9-4a82-9199-1be4ff04737f/generations/0cd41ddd-aa9d-43aa-acac-92bee7d0e84f/segments/3:3:1/Leonardo_Phoenix_10_3D_cartoonstyle_image_of_a_printed_photogr_0.jpg?w=512',
    title: 'Educational narration',
    prompt: 'Generate an educational narration about space exploration with an authoritative yet engaging tone',
    model: 'Gemini 2.5 Pro',
    voice: 'Authoritative',
    duration: '3m 12s'
  }
]

const musicMoreData = [
  {
    audioUrl: '#',
    thumbnailUrl: 'https://cdn.leonardo.ai/users/9a6d696b-3a81-4d92-bc5c-7a17fa079e18/generations/d4e3a995-ef53-4bc0-941a-7f0c9ef5d21f/Leonardo_Phoenix_10_A_weathered_rusty_old_train_its_carriages_3.jpg?w=512',
    title: 'Jazz instrumental',
    prompt: 'Create a smooth jazz instrumental piece with saxophone and piano',
    model: 'Music Gen Pro',
    genre: 'Jazz',
    duration: '4m 30s'
  }
]

// Data management per tab
const dataMap = {
  imagen: {
    initial: imagenInitialData,
    more: imagenMoreData
  },
  video: {
    initial: videoInitialData,
    more: videoMoreData
  },
  speech: {
    initial: speechInitialData,
    more: speechMoreData
  },
  music: {
    initial: musicInitialData,
    more: musicMoreData
  }
}

// Reactive state for each tab
const librariesData = ref({
  imagen: [...imagenInitialData],
  video: [...videoInitialData],
  speech: [...speechInitialData],
  music: [...musicInitialData]
})

const pageData = ref({
  imagen: 1,
  video: 1,
  speech: 1,
  music: 1
})

const isLoadingData = ref({
  imagen: false,
  video: false,
  speech: false,
  music: false
})

const hasMoreDataLeft = ref({
  imagen: true,
  video: true,
  speech: true,
  music: true
})

// Get current tab data
const currentLibraries = computed(() => {
  const tabKey = activeTab.value as keyof typeof librariesData.value
  return librariesData.value[tabKey] || []
})
const currentPage = computed(() => pageData.value[activeTab.value as keyof typeof pageData.value] || 1)
const isLoading = computed(() => isLoadingData.value[activeTab.value as keyof typeof isLoadingData.value] || false)
const hasMoreData = computed(() => hasMoreDataLeft.value[activeTab.value as keyof typeof hasMoreDataLeft.value] || false)

// Mock API fetch function
const fetchMoreLibraryItems = async () => {
  const currentTabKey = activeTab.value as keyof typeof dataMap
  if (!hasMoreData.value || isLoading.value) return

  isLoadingData.value[currentTabKey] = true

  try {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real implementation, you would fetch from your API with pagination:
    // const response = await fetch(`/api/library/${currentTabKey}?page=${pageData.value[currentTabKey]}&limit=10`);
    // const newData = await response.json();

    // Mock response based on page
    if (pageData.value[currentTabKey] === 1) {
      // Append new data to existing data (preserving order)
      const moreData = dataMap[currentTabKey].more
      librariesData.value[currentTabKey] = [...librariesData.value[currentTabKey], ...moreData]
      pageData.value[currentTabKey]++
    } else {
      // For demo purposes, we'll stop loading after second page
      hasMoreDataLeft.value[currentTabKey] = false
    }

    // In a real implementation, you would check if there's more data available:
    // if (newData.length < limit) {
    //   hasMoreDataLeft.value[currentTabKey] = false;
    // }
  } catch (error) {
    console.error('Error fetching more library items:', error)
    // Show error to user
    alert('Failed to load more items. Please try again.')
  } finally {
    isLoadingData.value[currentTabKey] = false
  }
}

// Intersection observer for infinite scroll
let observer: IntersectionObserver | null = null

const observeLastElement = (entries: IntersectionObserverEntry[]) => {
  const entry = entries[0]
  if (entry && entry.isIntersecting && !isLoading.value) {
    fetchMoreLibraryItems()
  }
}

// Setup scroll observer on component mount
onMounted(() => {
  observer = new IntersectionObserver(observeLastElement, {
    threshold: 0.5,
    rootMargin: '0px 0px 200px 0px' // Load more when within 200px of bottom
  })

  // Setup scroll event for fallback
  window.addEventListener('scroll', checkScrollPosition)
})

// Clean up on unmount
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  window.removeEventListener('scroll', checkScrollPosition)
})

// Update observer target when the libraries array changes
watch(currentLibraries, () => {
  nextTick(() => {
    const loadingTrigger = document.getElementById('loading-trigger')
    if (loadingTrigger && observer) {
      observer.disconnect()
      observer.observe(loadingTrigger)
    }
  })
})

// Debounce function to improve scroll performance
const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Fallback scroll detection with debouncing
const checkScrollPosition = debounce(() => {
  if (isLoading.value || !hasMoreData.value) return

  const scrollPosition = window.scrollY + window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  // Load more when user scrolls to 90% of the page
  if (scrollPosition >= documentHeight * 0.9) {
    fetchMoreLibraryItems()
  }
}, 200) // 200ms debounce;
</script>

<template>
  <UPage>
    <UContainer class="pt-30">
      <!-- Tabs Navigation -->
      <UTabs
        v-model="activeTab"
        :items="tabItems"
        orientation="horizontal"
        :ui="{
          root: 'w-full',
          list: 'relative flex bg-transparent dark:bg-transparent gap-2 px-0 mb-8',
          indicator: 'absolute top-[4px] duration-200 ease-out focus:outline-none rounded-lg bg-elevated/60',
          trigger: 'px-4 py-3 rounded-lg hover:bg-muted/50 data-[state=active]:text-highlighted data-[state=inactive]:text-muted flex items-center gap-2',
          label: 'truncate'
        }"
      >
        <template #trigger="{ item }">
          <UIcon
            :name="item.icon"
            class="w-5 h-5"
          />
          {{ item.label }}
        </template>

        <template #content="{ item }">
          <!-- Content for each tab -->
          <div v-if="item.key === 'imagen'">
            <UPageColumns>
              <Motion
                v-for="(image, index) in currentLibraries"
                :key="`imagen-${index}`"
                :initial="{
                  scale: 1.1,
                  opacity: 0,
                  filter: 'blur(20px)'
                }"
                :animate="{
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)'
                }"
                :transition="{
                  duration: 0.6,
                  delay: index * 0.1
                }"
              >
                <AIToolImageLibraryCard
                  :key="`imagen-card-${index}`"
                  orientation="vertical"
                  v-bind="image"
                />
              </Motion>
            </UPageColumns>
          </div>

          <div v-else-if="item.key === 'video'">
            <UPageColumns>
              <Motion
                v-for="(video, index) in currentLibraries"
                :key="`video-${index}`"
                :initial="{
                  scale: 1.1,
                  opacity: 0,
                  filter: 'blur(20px)'
                }"
                :animate="{
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)'
                }"
                :transition="{
                  duration: 0.6,
                  delay: index * 0.1
                }"
              >
                <VideoPromptCard
                  :key="`video-card-${index}`"
                  orientation="vertical"
                  :video-url="(video as any).videoUrl"
                  :thumbnail-url="(video as any).thumbnailUrl"
                  :title="(video as any).title"
                  :prompt="(video as any).prompt"
                  :model="(video as any).model"
                  :style="(video as any).style"
                  :duration="(video as any).duration"
                />
              </Motion>
            </UPageColumns>
          </div>

          <div v-else-if="item.key === 'speech'">
            <UPageColumns>
              <Motion
                v-for="(speech, index) in currentLibraries"
                :key="`speech-${index}`"
                :initial="{
                  scale: 1.1,
                  opacity: 0,
                  filter: 'blur(20px)'
                }"
                :animate="{
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)'
                }"
                :transition="{
                  duration: 0.6,
                  delay: index * 0.1
                }"
              >
                <!-- For now, reuse image card component with audio data -->
                <AIToolImageLibraryCard
                  :key="`speech-card-${index}`"
                  orientation="vertical"
                  :image-url="(speech as any).thumbnailUrl"
                  :title="(speech as any).title"
                  :prompt="(speech as any).prompt"
                  :preset="(speech as any).model"
                  :style="(speech as any).voice"
                  :resolution="(speech as any).duration"
                />
              </Motion>
            </UPageColumns>
          </div>

          <div v-else-if="item.key === 'music'">
            <UPageColumns>
              <Motion
                v-for="(music, index) in currentLibraries"
                :key="`music-${index}`"
                :initial="{
                  scale: 1.1,
                  opacity: 0,
                  filter: 'blur(20px)'
                }"
                :animate="{
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)'
                }"
                :transition="{
                  duration: 0.6,
                  delay: index * 0.1
                }"
              >
                <!-- For now, reuse image card component with music data -->
                <AIToolImageLibraryCard
                  :key="`music-card-${index}`"
                  orientation="vertical"
                  :image-url="(music as any).thumbnailUrl"
                  :title="(music as any).title"
                  :prompt="(music as any).prompt"
                  :preset="(music as any).model"
                  :style="(music as any).genre"
                  :resolution="(music as any).duration"
                />
              </Motion>
            </UPageColumns>
          </div>

          <!-- Loading indicator -->
          <div
            v-if="isLoading"
            class="flex justify-center items-center py-10"
          >
            <UIcon
              name="i-lucide-loader"
              class="animate-spin text-primary h-8 w-8 mr-2"
            />
            <span class="text-primary">{{ $t('loadingMoreItems') }}</span>
          </div>

          <!-- End of list indicator for intersection observer -->
          <div
            v-if="hasMoreData && !isLoading"
            id="loading-trigger"
            class="h-1 w-full"
            aria-hidden="true"
          />

          <!-- End message when all data is loaded -->
          <div
            v-if="!hasMoreData"
            class="text-center py-8 text-gray-500"
          >
            You've reached the end of the library
          </div>
        </template>
      </UTabs>
    </UContainer>
  </UPage>
</template>
