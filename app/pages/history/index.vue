<script setup lang="ts">
import HistoryImageCard from '~/components/history/HistoryImageCard.vue'
import HistoryVideoCard from '~/components/history/HistoryVideoCard.vue'
import HistorySpeechCard from '~/components/history/HistorySpeechCard.vue'
import BaseHistoryFilterSelect from '~/components/base/BaseHistoryFilterSelect.vue'

definePageMeta({
  middleware: 'auth'
})

const historyComponents = {
  'image': HistoryImageCard,
  'video': HistoryVideoCard,
  'tts-text': HistorySpeechCard,
  'tts-document': HistorySpeechCard
}

/**
 * Imagen History page with infinite scroll functionality
 */

// Use history store for fetching imagen data
const historyStore = useHistoryStore()

const { historiesWithPage, loadings } = storeToRefs(historyStore)

// Filter parameters for the API
const selectedFilter = ref('all')
const filterParams = ref({
  items_per_page: 9
})

// Computed properties from store
const historiesData = computed(() => historyStore.histories)
const isLoading = computed(
  () =>
    historyStore.loadings.fetchHistories
    || historyStore.loadings.fetchMoreHistories
)
const hasMoreData = computed(() => historyStore.hasMoreHistories)

// Error handling from store
const hasError = computed(() => !!historyStore.errors.fetchHistories)
const errorMessage = computed(() => {
  const error = historyStore.errors.fetchHistories
  return (
    error?.response?.data?.message
    || error?.message
    || 'Failed to load imagen history. Please try again.'
  )
})

// Map history data to image card props
const librariesData = computed(() => {
  return historiesData.value.map(history => ({
    ...history
  }))
})

// Initial data fetch
const fetchInitialData = async () => {
  const params: any = {
    ...filterParams.value,
    page: 1
  }
  if (selectedFilter.value !== 'all') {
    params.filter_by = selectedFilter.value
  }
  await historyStore.fetchHistories(params)
}

// Fetch more data for infinite scroll
const fetchMoreLibraryItems = async () => {
  if (!hasMoreData.value || isLoading.value) return

  const params: any = {
    ...filterParams.value
  }
  if (selectedFilter.value !== 'all') {
    params.filter_by = selectedFilter.value
  }
  await historyStore.fetchMoreHistories(params)
}

// Handle filter change
const onFilterChange = async (newFilter: string) => {
  selectedFilter.value = newFilter
  // Reset histories and fetch new data
  historyStore.histories = []
  historyStore.historiesWithPage = [{ page: 1, histories: [] }]
  historyStore.currentPage = 1
  historyStore.hasMoreHistories = true
  await fetchInitialData()
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
                name="i-lucide-history"
                class="w-4 h-4 mr-2"
              />
              {{ $t("history.tabs.history") }}
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <UIcon
                name="i-lucide-chevron-right"
                class="w-4 h-4 text-muted-foreground"
              />
              <BaseHistoryFilterSelect
                v-model="selectedFilter"
                variant="none"
                @update:model-value="onFilterChange"
              />
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
          <p class="text-red-700">
            {{ errorMessage }}
          </p>
        </div>
      </div>
      <!-- Content -->
      <!-- Actual content and load-more skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-4">
          <template v-for="(historiesData, index) in historiesWithPage">
            <Motion
              v-for="(row, rowIndex) in historiesData.histories.slice(0, 3)"
              :key="`row-${rowIndex}`"
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
              <component
                :is="historyComponents[row.type]"
                :data="row"
              />
            </Motion>
          </template>
          <Motion
            v-for="n in 3"
            v-if="loadings.fetchMoreHistories || loadings.fetchHistories"
            :key="`row-${n}`"
            class="w-full rounded-lg"
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
              delay: n * 0.1
            }"
          >
            <USkeleton
              class="w-full"
              :style="{
                height: 60 * (n + 1) + 'px',
                borderRadius: '0.5rem'
              }"
            />
          </Motion>
        </div>
        <div class="space-y-4">
          <template v-for="(historiesData, index) in historiesWithPage">
            <Motion
              v-for="(row, rowIndex) in historiesData.histories.slice(3, 6)"
              :key="`row-${rowIndex}`"
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
              <component
                :is="historyComponents[row.type]"
                :data="row"
              />
            </Motion>
          </template>
          <Motion
            v-for="n in 4"
            v-if="loadings.fetchMoreHistories || loadings.fetchHistories"
            :key="`row-${n}`"
            class="w-full rounded-lg"
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
              delay: n * 0.1
            }"
          >
            <USkeleton
              class="w-full"
              :style="{
                height: 65 * (5 - n) + 'px',
                borderRadius: '0.5rem'
              }"
            />
          </Motion>
        </div>
        <div class="space-y-4">
          <template v-for="(historiesData, index) in historiesWithPage">
            <Motion
              v-for="(row, rowIndex) in historiesData.histories.slice(6, 9)"
              :key="`row-${rowIndex}`"
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
              <component
                :is="historyComponents[row.type]"
                :data="row"
              />
            </Motion>
          </template>

          <Motion
            v-for="n in 3"
            v-if="loadings.fetchMoreHistories || loadings.fetchHistories"
            :key="`row-${n}`"
            class="w-full rounded-lg"
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
              delay: n * 0.1
            }"
          >
            <USkeleton
              class="w-full"
              :style="{
                height: 60 * (n + 1) + 'px',
                borderRadius: '0.5rem'
              }"
            />
          </Motion>
        </div>
      </div>

      <div
        v-if="false"
        class="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4"
      >
        <Motion
          v-for="(row, index) in librariesData"
          :key="`row-${index}`"
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
          <component
            :is="historyComponents[row.type]"
            :data="row"
          />
        </Motion>
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
        {{ $t("historyPages.endOfImagesHistory") }}
      </div>
    </UContainer>
  </UPage>
</template>
