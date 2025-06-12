<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Use fullscreen layout for immersive experience
definePageMeta({
  layout: 'fullscreen'
})

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

// Navigation back to history
const goBack = () => {
  router.push('/history/video-gen')
}

// Handle error state
const hasError = computed(() => errors.value.fetchHistoryDetail !== null)
const isLoading = computed(() => loadings.value.fetchHistoryDetail)
</script>

<template>
  <div>
    <!-- Minimal header for navigation -->
    <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
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

      <!-- Main content: Video + Details -->
      <div
        v-else-if="historyDetail"
        class="flex-1 flex"
      >
        <!-- Left side: Video player (takes most space) -->
        <div class="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div class="max-w-4xl w-full">
            <!-- Video title and prompt -->
            <div class="mb-6 text-center">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ historyDetail.name || $t('libraryPages.videoDetails') }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto line-clamp-2">
                {{ historyDetail.input_text }}
              </p>
            </div>

            <!-- Video player container -->
            <div class="bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div
                class="relative group cursor-pointer aspect-video"
                @click="openFullScreen"
              >
                <video
                  v-if="historyDetail.media_url"
                  :src="historyDetail.media_url"
                  :poster="historyDetail.thumbnail_url"
                  controls
                  class="w-full h-full object-contain bg-black"
                  @play="isVideoPlaying = true"
                  @pause="isVideoPlaying = false"
                />
                <div
                  v-else
                  class="w-full h-full bg-gray-800 flex items-center justify-center"
                >
                  <UIcon
                    name="i-lucide-video-off"
                    class="w-16 h-16 text-gray-400"
                  />
                </div>

                <!-- Play button overlay -->
                <div
                  v-if="historyDetail.media_url && !isVideoPlaying"
                  class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <UIcon
                    name="i-lucide-play"
                    class="w-20 h-20 text-white drop-shadow-lg"
                  />
                </div>

                <!-- Fullscreen hint -->
                <div
                  v-if="historyDetail.media_url"
                  class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <UButton
                    icon="i-lucide-maximize"
                    variant="ghost"
                    color="white"
                    size="sm"
                    class="backdrop-blur-sm"
                    @click.stop="openFullScreen"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side: Sticky details panel -->
        <div class="w-96 bg-background border-l border-border overflow-y-auto">
          <div class="sticky top-0">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <UIcon
                  name="i-lucide-info"
                  class="w-5 h-5 mr-2"
                />
                {{ $t('libraryPages.videoInformation') }}
              </h2>

              <div class="space-y-6">
                <!-- Prompt -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <UIcon
                      name="i-lucide-message-square"
                      class="w-4 h-4 mr-2"
                    />
                    {{ t('prompt') || 'Prompt' }}
                  </h4>
                  <div class="p-4 bg-muted rounded-xl text-sm leading-relaxed">
                    {{ historyDetail.input_text }}
                  </div>
                </div>

                <!-- Status -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <UIcon
                      name="i-lucide-activity"
                      class="w-4 h-4 mr-2"
                    />
                    {{ t('status') || 'Status' }}
                  </h4>
                  <div class="flex items-center space-x-3">
                    <UBadge
                      :color="historyDetail.status === 2 ? 'green' : historyDetail.status === 1 ? 'yellow' : 'red'"
                      variant="subtle"
                      size="lg"
                    >
                      {{ historyDetail.status === 2 ? (t('completed') || 'Completed') : historyDetail.status === 1 ? (t('processing') || 'Processing') : (t('failed') || 'Failed') }}
                    </UBadge>
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ historyDetail.status_percentage }}%
                    </span>
                  </div>
                </div>

                <!-- Model -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <UIcon
                      name="i-lucide-cpu"
                      class="w-4 h-4 mr-2"
                    />
                    {{ t('model') || 'Model' }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 bg-muted p-3 rounded-lg">
                    {{ historyDetail.model_name || historyDetail.model }}
                  </p>
                </div>

                <!-- Created At -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <UIcon
                      name="i-lucide-calendar"
                      class="w-4 h-4 mr-2"
                    />
                    {{ t('createdAt') || 'Created At' }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 bg-muted p-3 rounded-lg">
                    {{ formatDate(historyDetail.created_at) }}
                  </p>
                </div>

                <!-- Used Credits -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <UIcon
                      name="i-lucide-coins"
                      class="w-4 h-4 mr-2"
                    />
                    {{ t('usedCredits') || 'Used Credits' }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 bg-muted p-3 rounded-lg">
                    {{ historyDetail.used_credit }} {{ t('credits') || 'credits' }}
                  </p>
                </div>

                <!-- Additional details -->
                <div
                  v-if="historyDetail.type"
                  class="pt-6 border-t border-border"
                >
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <UIcon
                      name="i-lucide-file-text"
                      class="w-4 h-4 mr-2"
                    />
                    Technical Details
                  </h4>
                  <div class="grid gap-4">
                    <div class="bg-muted p-3 rounded-lg">
                      <h5 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {{ t('type') || 'Type' }}
                      </h5>
                      <p class="text-sm">
                        {{ historyDetail.type }}
                      </p>
                    </div>
                    <div
                      v-if="historyDetail.file_size"
                      class="bg-muted p-3 rounded-lg"
                    >
                      <h5 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {{ t('fileSize') || 'File Size' }}
                      </h5>
                      <p class="text-sm">
                        {{ (historyDetail.file_size / 1024 / 1024).toFixed(2) }} MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  </div>
</template>
