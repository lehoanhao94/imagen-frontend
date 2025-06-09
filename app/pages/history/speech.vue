<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'

const { t } = useI18n()

/**
 * Speech Generation Library page with infinite scroll functionality
 */

// Mock data for speech (extracted from original library.vue)
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

// Reactive state for speech content
const librariesData = ref([...speechInitialData])
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
      librariesData.value = [...librariesData.value, ...speechMoreData]
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
        :title="t('library.tabs.speech')"
        :description="t('libraryPages.speechDescription')"
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
              <span class="ml-1 text-sm font-medium text-primary md:ml-2">{{ $t('libraryPages.speechBreadcrumb') }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Content -->
      <UPageColumns>
        <Motion
          v-for="(speech, index) in librariesData"
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
            :image-url="speech.thumbnailUrl"
            :title="speech.title"
            :prompt="speech.prompt"
            :preset="speech.model"
            :style="speech.voice"
            :resolution="speech.duration"
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
        {{ $t('libraryPages.endOfSpeechLibrary') }}
      </div>
    </UContainer>
  </UPage>
</template>
