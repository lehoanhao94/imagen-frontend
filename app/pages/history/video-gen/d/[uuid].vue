<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Use fullscreen layout for immersive experience
definePageMeta({
  layout: 'fullscreen'
})

const route = useRoute()
const router = useRouter()

// Get the UUID from the route parameters
const uuid = computed(() => route.params.uuid as string)

// Initialize the history store
const historyStore = useHistoryStore()
const { historyDetail, loadings, errors } = storeToRefs(historyStore)

// Video modal state
const isModalOpen = ref(false)

// Fetch history detail on component mount
onMounted(async () => {
  if (uuid.value) {
    await historyStore.fetchHistoryDetail(uuid.value)
    // Open modal automatically when data is loaded
    if (historyDetail.value) {
      isModalOpen.value = true
    }
  }
})

// Navigation back to history
const goBack = () => {
  router.push('/history/video-gen')
}

// Handle modal close - redirect back to history
const handleModalClose = () => {
  isModalOpen.value = false
  goBack()
}

// Handle generate with prompt
const handleGenerate = (prompt: string) => {
  // Implement generation logic here
  console.log('Generating with prompt:', prompt)
  // You might want to redirect to generation page or trigger generation
}

// Handle error state
const hasError = computed(() => errors.value.fetchHistoryDetail !== null)
const isLoading = computed(() => loadings.value.fetchHistoryDetail)
</script>

<template>
  <div>
    <!-- Minimal header for navigation (shown when modal is closed or on error/loading) -->
    <header
      v-if="!isModalOpen || hasError || isLoading"
      class="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center space-x-4">
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            color="neutral"
            @click="goBack"
          >
            {{ $t('historyPages.backToHistory') }}
          </UButton>
        </div>
      </div>
    </header>

    <!-- Main fullscreen content -->
    <div class="h-[calc(100vh-73px)] flex">
      <!-- Error state -->
      <div
        v-if="hasError"
        class="flex-1 flex items-center justify-center"
      >
        <div class="text-center py-12">
          <UIcon
            name="i-lucide-alert-triangle"
            class="w-12 h-12 text-red-500 mx-auto mb-4"
          />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ $t('libraryPages.errorLoadingVideo') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ $t('libraryPages.videoNotFound') }}
          </p>
          <UButton @click="goBack">
            {{ $t('historyPages.backToHistory') }}
          </UButton>
        </div>
      </div>

      <!-- Loading state -->
      <div
        v-else-if="isLoading"
        class="flex-1 flex items-center justify-center"
      >
        <div class="flex items-center">
          <UIcon
            name="i-lucide-loader"
            class="animate-spin text-primary h-8 w-8 mr-2"
          />
          <span class="text-primary">{{ $t('libraryPages.loadingVideoDetails') }}</span>
        </div>
      </div>

      <!-- Content loaded - show placeholder when modal is open -->
      <div
        v-else-if="historyDetail"
        class="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ historyDetail.name || $t('libraryPages.videoDetails') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ $t('libraryPages.videoDisplayedInModal') || 'Video is displayed in modal view' }}
          </p>
          <UButton
            color="primary"
            @click="isModalOpen = true"
          >
            {{ $t('openVideoModal') || 'Open Video' }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Video Detail Modal -->
    <VideoDetailModal
      v-model="isModalOpen"
      :video-data="historyDetail"
      :show-generate-button="true"
      @generate="handleGenerate"
      @update:model-value="handleModalClose"
    />
  </div>
</template>
