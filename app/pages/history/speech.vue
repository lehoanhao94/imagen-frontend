<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'

const { t } = useI18n()

/**
 * Speech History page with infinite scroll functionality
 */

// Use history store for fetching speech data
const historyStore = useHistoryStore()

// Filter parameters for the API
const filterParams = ref({
  filter_by: 'speech', // Filter for speech generation type
  items_per_page: 10
})

// Computed properties from store
const historiesData = computed(() => historyStore.histories)
const isLoading = computed(() => historyStore.loadings.fetchHistories || historyStore.loadings.fetchMoreHistories)
const hasMoreData = computed(() => historyStore.hasMoreHistories)

// Error handling from store
const hasError = computed(() => !!historyStore.errors.fetchHistories)
const errorMessage = computed(() => {
  const error = historyStore.errors.fetchHistories
  return error?.response?.data?.message || error?.message || 'Failed to load speech history. Please try again.'
})

// Map history data to speech card props
const librariesData = computed(() => {
  return historiesData.value.map(history => ({
    uuid: history.uuid,
    audioUrl: history.media_url || '#',
    thumbnailUrl: 'https://via.placeholder.com/512x288?text=Audio',
    title: history.name || 'Generated Speech',
    prompt: history.input_text || history.custom_prompt || 'No prompt available',
    model: history.model_name || history.model || 'Speech Model',
    voice: history.voice || 'Default Voice',
    duration: '2m 30s' // Default duration since not in history data
  }))
})

// Initial data fetch
const fetchInitialData = async () => {
  await historyStore.fetchHistories({
    ...filterParams.value,
    page: 1
  })
}

// Fetch more data for infinite scroll
const fetchMoreLibraryItems = async () => {
  if (!hasMoreData.value || isLoading.value) return

  await historyStore.fetchMoreHistories(filterParams.value)
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
onMounted(async () => {
  // Fetch initial data
  await fetchInitialData()

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
        :title="t('history.tabs.speech')"
        :description="t('historyPages.speechDescription')"
      />

      <!-- Navigation breadcrumb -->
      <nav
        class="flex mb-8"
        aria-label="Breadcrumb"
      >
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <NuxtLink
              to="/history"
              class="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <UIcon
                name="i-lucide-library"
                class="w-4 h-4 mr-2"
              />
              {{ $t('history.tabs.history') }}
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <UIcon
                name="i-lucide-chevron-right"
                class="w-4 h-4 text-muted-foreground"
              />
              <span class="ml-1 text-sm font-medium text-primary md:ml-2">{{ $t('historyPages.speechBreadcrumb') }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Error message -->
      <div
        v-if="hasError"
        class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8"
      >
        <div class="flex items-center">
          <UIcon
            name="i-lucide-alert-triangle"
            class="w-5 h-5 text-red-500 mr-2"
          />
          <p class="text-red-700">{{ errorMessage }}</p>
        </div>
      </div>

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
          <!-- Use dedicated speech card component -->
          <HistorySpeechCard
            :key="`speech-card-${index}`"
            orientation="vertical"
            :audio-url="speech.audioUrl"
            :title="speech.title"
            :prompt="speech.prompt"
            :preset="speech.model"
            :voice="speech.voice"
            :duration="speech.duration"
            :data="historiesData[index]"
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
        {{ $t('historyPages.endOfSpeechHistory') }}
      </div>
    </UContainer>
  </UPage>
</template>
