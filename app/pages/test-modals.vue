<template>
  <div class="p-8 space-y-8">
    <h1 class="text-2xl font-bold">
      Modal Components Test
    </h1>

    <div class="space-y-4">
      <h2 class="text-lg font-semibold">
        Voice Selection Modal
      </h2>
      <div class="max-w-md">
        <BaseSpeechVoiceSelectModal />
      </div>
      <div
        v-if="selectedVoice"
        class="text-sm text-gray-600"
      >
        Selected Voice: {{ selectedVoice.speaker_name }} ({{ selectedVoice.gender }})
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-lg font-semibold">
        Emotion Selection Modal
      </h2>
      <div class="max-w-md">
        <BaseSpeechEmotionSelectModal />
      </div>
      <div
        v-if="selectedEmotion"
        class="text-sm text-gray-600"
      >
        Selected Emotion: {{ selectedEmotion.emotion }} - {{ selectedEmotion.emotion_long }}
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-lg font-semibold">
        Original Components (for comparison)
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div>
          <label class="block text-sm font-medium mb-2">Original Voice Select</label>
          <BaseSpeechVoiceSelect />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Original Emotion Select</label>
          <BaseSpeechEmotionSelect />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

// Get the selected values from the composables to display them
const { selectedVoice } = useSpeechVoices()
const { selectedEmotion } = useSpeechEmotions()
</script>
