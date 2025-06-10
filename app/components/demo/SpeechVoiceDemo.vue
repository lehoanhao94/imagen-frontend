<template>
  <div class="p-6 space-y-6">
    <h2 class="text-xl font-bold">Speech Voice Selection Demo</h2>
    
    <!-- Example 1: Default usage -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Example 1: Default Usage</h3>
      <BaseSpeechVoiceSelectModal 
        v-model="voice1"
        placeholder="Choose a voice..."
      />
      <div v-if="voice1" class="text-sm text-gray-600">
        Selected: {{ voice1.speaker_name }} ({{ voice1.gender }}, {{ voice1.accent }})
      </div>
    </div>

    <!-- Example 2: Small size -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Example 2: Small Size</h3>
      <BaseSpeechVoiceSelectModal 
        v-model="voice2"
        size="sm"
        placeholder="Pick a voice"
      />
      <div v-if="voice2" class="text-sm text-gray-600">
        Selected: {{ voice2.speaker_name }}
      </div>
    </div>

    <!-- Example 3: Large size with custom placeholder -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Example 3: Large Size</h3>
      <BaseSpeechVoiceSelectModal 
        v-model="voice3"
        size="lg"
        placeholder="Select narrator voice..."
      />
      <div v-if="voice3" class="text-sm text-gray-600">
        Selected: {{ voice3.speaker_name }} - {{ voice3.description }}
      </div>
    </div>

    <!-- Example 4: Multiple instances with different purposes -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <h4 class="font-semibold">Main Narrator</h4>
        <BaseSpeechVoiceSelectModal 
          v-model="mainNarrator"
          placeholder="Select main narrator..."
        />
      </div>
      
      <div class="space-y-2">
        <h4 class="font-semibold">Character Voice</h4>
        <BaseSpeechVoiceSelectModal 
          v-model="characterVoice"
          placeholder="Select character voice..."
        />
      </div>
    </div>

    <!-- Display selected voices -->
    <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 class="font-semibold mb-2">Selected Voices Summary:</h4>
      <div class="space-y-1 text-sm">
        <div>Voice 1: {{ voice1?.speaker_name || 'Not selected' }}</div>
        <div>Voice 2: {{ voice2?.speaker_name || 'Not selected' }}</div>
        <div>Voice 3: {{ voice3?.speaker_name || 'Not selected' }}</div>
        <div>Main Narrator: {{ mainNarrator?.speaker_name || 'Not selected' }}</div>
        <div>Character Voice: {{ characterVoice?.speaker_name || 'Not selected' }}</div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex gap-2">
      <UButton @click="clearAll">Clear All</UButton>
      <UButton @click="setRandomVoices" variant="outline">Set Random Voices</UButton>
      <UButton @click="logSelectedVoices" variant="ghost">Log to Console</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpeechVoice } from '~/composables/useSpeechVoices'

// Multiple voice selections for different purposes
const voice1 = ref<SpeechVoice | null>(null)
const voice2 = ref<SpeechVoice | null>(null)
const voice3 = ref<SpeechVoice | null>(null)
const mainNarrator = ref<SpeechVoice | null>(null)
const characterVoice = ref<SpeechVoice | null>(null)

// Get voices from composable for demo purposes
const { voices, loadVoices } = useSpeechVoices()

// Load voices on mount
onMounted(() => {
  if (voices.value.length === 0) {
    loadVoices()
  }
})

// Demo functions
const clearAll = () => {
  voice1.value = null
  voice2.value = null
  voice3.value = null
  mainNarrator.value = null
  characterVoice.value = null
}

const setRandomVoices = () => {
  if (voices.value.length > 0) {
    const getRandomVoice = () => voices.value[Math.floor(Math.random() * voices.value.length)]
    
    voice1.value = getRandomVoice()
    voice2.value = getRandomVoice()
    voice3.value = getRandomVoice()
    mainNarrator.value = getRandomVoice()
    characterVoice.value = getRandomVoice()
  }
}

const logSelectedVoices = () => {
  console.log('Selected Voices:', {
    voice1: voice1.value,
    voice2: voice2.value,
    voice3: voice3.value,
    mainNarrator: mainNarrator.value,
    characterVoice: characterVoice.value
  })
}

// Watch for changes
watch([voice1, voice2, voice3, mainNarrator, characterVoice], () => {
  console.log('Voice selections changed')
})
</script>
