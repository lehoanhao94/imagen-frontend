<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue'

const { t } = useI18n()

/**
 * Video Generation Library page with infinite scroll functionality
 */

// Use history store for fetching video data
const historyStore = useHistoryStore()

// Filter parameters for the API
const filterParams = ref({
  filter_by: 'all',
  items_per_page: 10
})

// Computed properties from store
const librariesData = computed(() => historyStore.histories)
const isLoading = computed(() => historyStore.loadings.fetchHistories || historyStore.loadings.fetchMoreHistories)
const hasMoreData = computed(() => historyStore.hasMoreHistories)

// Error handling from store
const hasError = computed(() => !!historyStore.errors.fetchHistories)
const errorMessage = computed(() => {
  const error = historyStore.errors.fetchHistories
  return error?.response?.data?.message || error?.message || 'Failed to load video library. Please try again.'
})

// Map history data to video card props
const mappedVideoData = computed(() => {
  return librariesData.value.map(history => ({
    uuid: history.uuid,
    videoUrl: history.media_url || '#',
    thumbnailUrl: history.media_url || 'https://via.placeholder.com/512x288?text=Video',
    title: history.name || 'Generated Video',
    prompt: history.input_text || history.custom_prompt || 'No prompt available',
    model: history.model_name || history.model || 'Video Model',
    style: 'Video Generation', // Default style since not in history data
    duration: '5s' // Default duration since not in history data
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
        :title="t('library.tabs.video')"
        :description="t('libraryPages.videoDescription')"
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
              <span class="ml-1 text-sm font-medium text-primary md:ml-2">{{ $t('libraryPages.videoBreadcrumb') }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Error message -->
      <div
        v-if="hasError"
        class="text-center py-8"
      >
        <UAlert
          color="red"
          variant="soft"
          :title="$t('error') || 'Error'"
          :description="errorMessage"
        />
        <UButton
          color="primary"
          variant="outline"
          class="mt-4"
          @click="fetchInitialData"
        >
          {{ $t('tryAgain') || 'Try Again' }}
        </UButton>
      </div>

      <!-- Empty state -->
      <div
        v-if="!hasError && !isLoading && mappedVideoData.length === 0"
        class="text-center py-16"
      >
        <UIcon
          name="i-lucide-video"
          class="w-16 h-16 text-gray-400 mx-auto mb-4"
        />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {{ $t('libraryPages.noVideosFound') }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ $t('libraryPages.noVideosFoundDescription') }}
        </p>
      </div>

      <!-- Content -->
      <UPageColumns v-if="!hasError && mappedVideoData.length > 0">
        <Motion
          v-for="(video, index) in mappedVideoData"
          :key="`video-${video.uuid}-${index}`"
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
            :key="`video-card-${video.uuid}`"
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
        {{ $t('libraryPages.endOfVideoLibrary') }}
      </div>
    </UContainer>
  </UPage>
</template>
