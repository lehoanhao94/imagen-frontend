<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'

const { t } = useI18n()

/**
 * Music Generation Library page with infinite scroll functionality
 */

// Mock data for music (extracted from original library.vue)
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

// Reactive state for music content
const librariesData = ref([...musicInitialData])
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
      librariesData.value = [...librariesData.value, ...musicMoreData]
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
        :title="t('library.tabs.music')"
        :description="t('libraryPages.musicDescription')"
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
              {{ $t('library.tabs.library') }}
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <UIcon
                name="i-lucide-chevron-right"
                class="w-4 h-4 text-muted-foreground"
              />
              <span class="ml-1 text-sm font-medium text-primary md:ml-2">{{ $t('libraryPages.musicBreadcrumb') }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Content -->
      <UPageColumns>
        <Motion
          v-for="(music, index) in librariesData"
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
            :image-url="music.thumbnailUrl"
            :title="music.title"
            :prompt="music.prompt"
            :preset="music.model"
            :style="music.genre"
            :resolution="music.duration"
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
        {{ $t('libraryPages.endOfMusicLibrary') }}
      </div>
    </UContainer>
  </UPage>
</template>
