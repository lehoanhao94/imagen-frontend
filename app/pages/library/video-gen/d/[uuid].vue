<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// Get the UUID from the route parameters
const uuid = computed(() => route.params.uuid as string)

// Initialize the history store
const historyStore = useHistoryStore()
const { historyDetail, loadings, errors } = storeToRefs(historyStore)

// Video player state
const isVideoPlaying = ref(false)
const isFullScreenOpen = ref(false)

// Fetch history detail on component mount
onMounted(async () => {
  if (uuid.value) {
    await historyStore.fetchHistoryDetail(uuid.value)
  }
})

// Video player controls
const openFullScreen = () => {
  isFullScreenOpen.value = true
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

// Navigation back to library
const goBack = () => {
  router.push('/library/video-gen')
}

// Handle error state
const hasError = computed(() => errors.value.fetchHistoryDetail !== null)
const isLoading = computed(() => loadings.value.fetchHistoryDetail)
</script>

<template>
  <UPage>
    <UContainer class="pt-30">
      <!-- Header with back navigation -->
      <div class="mb-8">
        <UButton
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          class="mb-4"
          @click="goBack"
        >
          {{ t('backToLibrary') || 'Back to Library' }}
        </UButton>

        <UPageHero
          :title="historyDetail?.name || t('videoDetails') || 'Video Details'"
          :description="historyDetail?.input_text || 'Loading video details...'"
        />
      </div>

      <!-- Error state -->
      <div
        v-if="hasError"
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-alert-triangle"
          class="w-12 h-12 text-red-500 mx-auto mb-4"
        />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {{ t('errorLoadingVideo') || 'Error Loading Video' }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ t('videoNotFound') || 'The video you are looking for could not be found or loaded.' }}
        </p>
        <UButton
          @click="goBack"
        >
          {{ t('backToLibrary') || 'Back to Library' }}
        </UButton>
      </div>

      <!-- Loading state -->
      <div
        v-else-if="isLoading"
        class="flex justify-center items-center py-12"
      >
        <UIcon
          name="i-lucide-loader"
          class="animate-spin text-primary h-8 w-8 mr-2"
        />
        <span class="text-primary">{{ t('loadingVideoDetails') || 'Loading video details...' }}</span>
      </div>

      <!-- Main content -->
      <div
        v-else-if="historyDetail"
        class="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <!-- Left side: Video player -->
        <div class="order-2 lg:order-1">
          <div class="bg-card rounded-lg overflow-hidden shadow-lg">
            <div
              class="relative group cursor-pointer"
              @click="openFullScreen"
            >
              <video
                v-if="historyDetail.media_url"
                :src="historyDetail.media_url"
                :poster="historyDetail.thumbnail_url"
                controls
                class="w-full h-auto object-contain bg-black"
                @play="isVideoPlaying = true"
                @pause="isVideoPlaying = false"
              />
              <div
                v-else
                class="w-full h-64 bg-gray-200 dark:bg-gray-800 flex items-center justify-center"
              >
                <UIcon
                  name="i-lucide-video-off"
                  class="w-12 h-12 text-gray-400"
                />
              </div>

              <!-- Play button overlay -->
              <div
                v-if="historyDetail.media_url && !isVideoPlaying"
                class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <UIcon
                  name="i-lucide-play"
                  class="w-16 h-16 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right side: Video details -->
        <div class="order-1 lg:order-2">
          <UPageCard
            title="Video Information"
            class="h-fit"
          >
            <template #description>
              <div class="space-y-6">
                <!-- Prompt -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {{ t('prompt') || 'Prompt' }}
                  </h4>
                  <div class="p-3 bg-muted rounded-lg text-sm">
                    {{ historyDetail.input_text }}
                  </div>
                </div>

                <!-- Model -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {{ t('model') || 'Model' }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ historyDetail.model_name || historyDetail.model }}
                  </p>
                </div>

                <!-- Created At -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {{ t('createdAt') || 'Created At' }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ formatDate(historyDetail.created_at) }}
                  </p>
                </div>

                <!-- Used Credits -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {{ t('usedCredits') || 'Used Credits' }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ historyDetail.used_credit }} {{ t('credits') || 'credits' }}
                  </p>
                </div>

                <!-- Status -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {{ t('status') || 'Status' }}
                  </h4>
                  <div class="flex items-center space-x-2">
                    <UBadge
                      :color="historyDetail.status === 2 ? 'green'
                        : historyDetail.status === 1 ? 'yellow'
                        : 'red'"
                      variant="subtle"
                    >
                      {{
                        historyDetail.status === 2 ? (t('completed') || 'Completed')
                        : historyDetail.status === 1 ? (t('processing') || 'Processing')
                        : (t('failed') || 'Failed')
                      }}
                    </UBadge>
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ historyDetail.status_percentage }}%
                    </span>
                  </div>
                </div>

                <!-- Additional details -->
                <div
                  v-if="historyDetail.type"
                  class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <h5 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {{ t('type') || 'Type' }}
                    </h5>
                    <p class="text-sm">
                      {{ historyDetail.type }}
                    </p>
                  </div>
                  <div v-if="historyDetail.file_size">
                    <h5 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {{ t('fileSize') || 'File Size' }}
                    </h5>
                    <p class="text-sm">
                      {{ (historyDetail.file_size / 1024 / 1024).toFixed(2) }} MB
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </UPageCard>
        </div>
      </div>
    </UContainer>

    <!-- Full Screen Video Modal -->
    <UModal
      v-model:open="isFullScreenOpen"
      fullscreen
      :ui="{
        content: 'bg-black/90 backdrop-blur-xl'
      }"
      @keydown.esc="isFullScreenOpen = false"
    >
      <template #content>
        <div
          class="relative w-full h-full flex items-center justify-center"
          @click="isFullScreenOpen = false"
        >
          <video
            v-if="historyDetail?.media_url"
            :src="historyDetail.media_url"
            :autoplay="isFullScreenOpen"
            controls
            class="max-h-[90vh] max-w-[90vw] object-contain cursor-auto"
            @click.stop
          />
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            class="absolute top-4 right-4 text-white hover:bg-white/10"
            @click="isFullScreenOpen = false"
          />
          <div class="absolute bottom-4 text-white/70 text-sm">
            {{ t('clickToClose') || 'Click anywhere to close' }}
          </div>
        </div>
      </template>
    </UModal>
  </UPage>
</template>
