<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";

const props = defineProps({
  orientation: {
    type: String,
    default: "horizontal",
  },
  audioUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "Generated Speech",
  },
  prompt: {
    type: String,
    default: "No prompt available",
  },
  preset: {
    type: String,
    default: "Speech Model",
  },
  voice: {
    type: String,
    default: "Default Voice",
  },
  duration: {
    type: String,
    default: "0:00",
  },
  data: {
    type: Object,
    default: () => ({}),
  },
});

const isFullScreenOpen = ref(false);
const isHovered = ref(false);
const isTouchDevice = ref(false);

// Audio player state
const audioElement = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const audioDuration = ref(0);
const isLoading = ref(false);

// Check if it's a touch device on component mount
onMounted(() => {
  isTouchDevice.value = "ontouchstart" in window || navigator.maxTouchPoints > 0;
});

// Cleanup audio on unmount
onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value = null;
  }
});

const openFullScreen = () => {
  // On touch devices, first tap shows overlay, second tap opens fullscreen
  if (isTouchDevice.value && !isHovered.value) {
    isHovered.value = true;
    return;
  }

  isFullScreenOpen.value = true;
};

const closeFullScreen = () => {
  isFullScreenOpen.value = false;
  isHovered.value = false;
};

// Audio player functions
const togglePlay = async () => {
  if (!audioElement.value) {
    // Create audio element if it doesn't exist
    audioElement.value = new Audio(props.audioUrl);
    
    // Set up event listeners
    audioElement.value.addEventListener('loadedmetadata', () => {
      audioDuration.value = audioElement.value?.duration || 0;
    });
    
    audioElement.value.addEventListener('timeupdate', () => {
      currentTime.value = audioElement.value?.currentTime || 0;
    });
    
    audioElement.value.addEventListener('ended', () => {
      isPlaying.value = false;
      currentTime.value = 0;
    });
    
    audioElement.value.addEventListener('loadstart', () => {
      isLoading.value = true;
    });
    
    audioElement.value.addEventListener('canplay', () => {
      isLoading.value = false;
    });
    
    audioElement.value.addEventListener('error', () => {
      isLoading.value = false;
      console.error('Audio playback error');
    });
  }

  try {
    if (isPlaying.value) {
      audioElement.value.pause();
      isPlaying.value = false;
    } else {
      await audioElement.value.play();
      isPlaying.value = true;
    }
  } catch (error) {
    console.error('Audio playback failed:', error);
    isLoading.value = false;
  }
};

const seek = (event: Event) => {
  if (!audioElement.value) return;
  
  const target = event.target as HTMLInputElement;
  const seekTime = (parseFloat(target.value) / 100) * audioDuration.value;
  audioElement.value.currentTime = seekTime;
  currentTime.value = seekTime;
};

// Format time display
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Progress percentage
const progressPercentage = computed(() => {
  if (audioDuration.value === 0) return 0;
  return (currentTime.value / audioDuration.value) * 100;
});

// Computed properties for display
const displayTitle = computed(() => {
  return props.data?.name || props.title;
});

const displayPrompt = computed(() => {
  return props.data?.input_text || props.data?.custom_prompt || props.prompt;
});

const displayPreset = computed(() => {
  return props.data?.model_name || props.data?.model || props.preset;
});

const displayVoice = computed(() => {
  return props.data?.voice || props.data?.speaker_name || props.voice;
});
</script>

<template>
  <HistoryWrapper :type="data.type || 'speech'">
    <UPageCard
      :orientation="'vertical'"
      spotlight
      spotlight-color="primary"
      :ui="{
        container: 'lg:items-start sm:p-0',
        root: 'overflow-hidden relative group',
      }"
    >
      <div class="relative w-full h-full aspect-square sm:aspect-auto">
        <!-- Audio player interface -->
        <div class="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex flex-col items-center justify-center p-6 cursor-pointer transition-opacity relative"
          @click="openFullScreen">
          
          <!-- Waveform placeholder/icon -->
          <div class="mb-6">
            <UIcon
              name="i-lucide-audio-waveform"
              class="w-16 h-16 text-primary"
            />
          </div>
          
          <!-- Audio controls -->
          <div class="w-full max-w-sm space-y-4" @click.stop>
            <!-- Play/Pause button and time display -->
            <div class="flex items-center justify-center space-x-4">
              <span class="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
                {{ formatTime(currentTime) }}
              </span>
              
              <UButton
                :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
                size="lg"
                color="primary"
                variant="solid"
                :loading="isLoading"
                @click="togglePlay"
                class="flex-shrink-0"
              />
              
              <span class="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
                {{ audioDuration > 0 ? formatTime(audioDuration) : duration }}
              </span>
            </div>
            
            <!-- Progress bar -->
            <div class="w-full">
              <input
                type="range"
                min="0"
                max="100"
                :value="progressPercentage"
                @input="seek"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
              />
            </div>
          </div>
        </div>

        <!-- Hover Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex flex-col justify-between p-4"
          :class="{ 'opacity-100': isHovered }"
        >
          <div class="flex justify-between items-start gap-2">
            <div
              class="text-white font-medium text-sm line-clamp-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer hover:underline hover:text-primary"
              :class="{ 'translate-y-0 opacity-100': isHovered }"
              @click.stop="openFullScreen"
            >
              {{ displayTitle }}
            </div>
            <UButton
              icon="i-lucide-maximize"
              color="neutral"
              variant="ghost"
              size="xs"
              class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 hover:bg-white/10"
              :class="{ 'opacity-100': isHovered }"
              @click.stop="openFullScreen"
            />
          </div>
          <UChatPromptSubmit
            color="primary"
            :label="$t('listenToSpeech')"
            class="cursor-pointer w-full justify-center bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150"
            :class="{ 'translate-y-0 opacity-100': isHovered }"
            @click.stop="togglePlay"
          />
        </div>
      </div>
    </UPageCard>

    <!-- Fullscreen Modal -->
    <UModal v-model="isFullScreenOpen" :ui="{ width: 'w-full max-w-none', height: 'h-full max-h-none' }">
      <div class="fixed inset-0 bg-black flex items-center justify-center animate-fadeIn" @click="closeFullScreen">
        <!-- Left side: Audio player -->
        <div class="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full flex items-center justify-center p-4 md:p-8 animate-scaleIn">
          <div class="max-w-2xl w-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg p-8 flex flex-col items-center justify-center space-y-6" @click.stop>
            
            <!-- Large waveform icon -->
            <div class="mb-4">
              <UIcon
                name="i-lucide-audio-waveform"
                class="w-32 h-32 text-primary"
              />
            </div>
            
            <!-- Title -->
            <h2 class="text-2xl font-medium text-center text-gray-800 dark:text-gray-200 mb-4">
              {{ displayTitle }}
            </h2>
            
            <!-- Audio controls -->
            <div class="w-full max-w-lg space-y-6">
              <!-- Play/Pause button and time display -->
              <div class="flex items-center justify-center space-x-6">
                <span class="text-lg text-gray-600 dark:text-gray-400 min-w-[4rem]">
                  {{ formatTime(currentTime) }}
                </span>
                
                <UButton
                  :icon="isPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
                  size="xl"
                  color="primary"
                  variant="solid"
                  :loading="isLoading"
                  @click="togglePlay"
                  class="flex-shrink-0"
                />
                
                <span class="text-lg text-gray-600 dark:text-gray-400 min-w-[4rem]">
                  {{ audioDuration > 0 ? formatTime(audioDuration) : duration }}
                </span>
              </div>
              
              <!-- Progress bar -->
              <div class="w-full">
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="progressPercentage"
                  @input="seek"
                  class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right side: Speech information -->
        <div
          class="w-full md:w-1/3 lg:w-1/4 h-1/2 md:h-full bg-black/50 backdrop-blur-md p-4 md:p-6 lg:p-8 flex flex-col overflow-y-auto animate-slideInRight"
          @click.stop
        >
          <h2 class="text-white text-xl md:text-2xl font-medium mb-4 md:mb-6">
            {{ displayTitle }}
          </h2>

          <div class="text-white/80 mb-4 md:mb-6">
            <h3 class="text-white text-base md:text-lg font-medium mb-2">
              {{ $t("promptDetails") }}
            </h3>
            <p class="text-xs md:text-sm mb-4 md:mb-6 overflow-y-auto bg-muted p-2 rounded-lg">
              {{ displayPrompt }}
            </p>

            <div class="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
              <div>
                <h4 class="text-white/60 text-xs uppercase mb-1">
                  {{ $t("model") }}
                </h4>
                <p class="text-xs md:text-sm">
                  {{ displayPreset }}
                </p>
              </div>
              <div>
                <h4 class="text-white/60 text-xs uppercase mb-1">
                  {{ $t("voice") }}
                </h4>
                <p class="text-xs md:text-sm">
                  {{ displayVoice }}
                </p>
              </div>
              <div>
                <h4 class="text-white/60 text-xs uppercase mb-1">
                  {{ $t("duration") }}
                </h4>
                <p class="text-xs md:text-sm">
                  {{ audioDuration > 0 ? formatTime(audioDuration) : duration }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-auto pt-2">
            <UChatPromptSubmit
              color="primary"
              :label="$t('generateSimilar')"
              class="cursor-pointer w-full justify-center bg-gradient-to-r from-primary-500 to-violet-500 max-h-10 dark:text-white hover:from-primary-600 hover:to-violet-600"
            />
          </div>
        </div>
      </div>
    </UModal>
  </HistoryWrapper>
</template>

<style scoped>
/* Custom slider styles */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: rgb(var(--color-primary-500));
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: background .15s ease-in-out;
}

.slider::-webkit-slider-thumb:hover {
  background: rgb(var(--color-primary-600));
}

.slider::-webkit-slider-track {
  height: 8px;
  cursor: pointer;
  background: #ddd;
  border-radius: 4px;
  border: none;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: rgb(var(--color-primary-500));
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  border: none;
}

.slider::-moz-range-track {
  height: 8px;
  cursor: pointer;
  background: #ddd;
  border-radius: 4px;
  border: none;
}

/* Animation for modal content */
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-scaleIn {
  animation: scaleIn 0.5s ease-out;
}

.animate-slideInRight {
  animation: slideInRight 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>