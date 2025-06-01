<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'

const { t } = useI18n()

/**
 * Video Generation Library page with infinite scroll functionality
 */

// Mock data for videos (extracted from original library.vue)
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

// Reactive state for video content
const librariesData = ref([...videoInitialData])
const pageData = ref(1)
const isLoadingData = ref(false)
const hasMoreDataLeft = ref(true)

// Computed properties
const isLoading = computed(() => isLoadingData.value)
const hasMoreData = computed(() => hasMoreDataLeft.value)

// Mock API fetch function
const fetchMoreLibraryItems = async () => {
  if (!hasMoreData.value || isLoading.value) return

  isLoadingData.value = true

  try {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock response based on page
    if (pageData.value === 1) {
      // Append new data to existing data (preserving order)
      librariesData.value = [...librariesData.value, ...videoMoreData]
      pageData.value++
    } else {
      // For demo purposes, we'll stop loading after second page
      hasMoreDataLeft.value = false
    }
  } catch (error) {
    console.error('Error fetching more library items:', error)
    // Show error to user
    alert('Failed to load more items. Please try again.')
  } finally {
    isLoadingData.value = false
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

// Update observer target when data changes
watch(librariesData, () => {
  nextTick(() => {
    const loadingTrigger = document.getElementById('loading-trigger')
    if (loadingTrigger && observer) {
      observer.disconnect()
      observer.observe(loadingTrigger)
    }
  })
})

// Debounce function to improve scroll performance
const debounce = (fn: (...args: any[]) => void, delay: number) => {
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
}, 200) // 200ms debounce
</script>

<template>
  <UPage>
    <UContainer class="pt-30">
      <UPageHero
        :title="t('library.tabs.video')"
        description="Browse your AI-generated videos and animations"
      />

      <!-- Navigation breadcrumb -->
      <nav
        class="flex mb-8"
        aria-label="Breadcrumb"
      >
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <NuxtLink
              to="/library"
              class="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <UIcon
                name="i-lucide-library"
                class="w-4 h-4 mr-2"
              />
              Library
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <UIcon
                name="i-lucide-chevron-right"
                class="w-4 h-4 text-muted-foreground"
              />
              <span class="ml-1 text-sm font-medium text-primary md:ml-2">Video Generation</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Content -->
      <UPageColumns>
        <Motion
          v-for="(video, index) in librariesData"
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
            v-bind="video"
          />
        </Motion>
      </UPageColumns>

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
        You've reached the end of the video library
      </div>
    </UContainer>
  </UPage>
</template>
