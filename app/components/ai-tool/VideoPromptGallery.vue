<script setup lang="ts">
interface VideoExample {
  id: string
  title: string
  prompt: string
  thumbnailUrl: string
  model: string
  duration: string
}

const emit = defineEmits<{
  'use-prompt': [prompt: string]
}>()

// Sample video data with prompts and settings
const videoExamples: VideoExample[] = [
  {
    id: '1',
    title: 'Icicles',
    prompt:
      'Close up shot (composition) of melting icicles (subject) on a frozen rock wall (context) with cool blue tones (ambiance), zoomed in (camera motion) maintaining close-up detail of water drips (action).	',

    thumbnailUrl:
      'https://ai.google.dev/static/gemini-api/docs/video/images/icicles2.gif',
    model: 'Veo 2',
    duration: '5s'
  },
  {
    id: '2',
    title: 'Man on the phone',
    prompt:
      'The camera dollies to show a close up of a desperate man in a green trench coat. He\'s making a call on a rotary-style wall phone with a green neon light. It looks like a movie scene.',

    thumbnailUrl:
      'https://ai.google.dev/static/gemini-api/docs/video/images/phonebooth.gif',
    model: 'Veo 2',
    duration: '8s'
  },
  {
    id: '3',
    title: 'Running snow leopard',
    prompt:
      'Create a short 3D animated scene in a joyful cartoon style. A cute creature with snow leopard-like fur, large expressive eyes, and a friendly, rounded form happily prances through a whimsical winter forest. The scene should feature rounded, snow-covered trees, gentle falling snowflakes, and warm sunlight filtering through the branches. The creature\'s bouncy movements and wide smile should convey pure delight. Aim for an upbeat, heartwarming tone with bright, cheerful colors and playful animation.',

    thumbnailUrl:
      'https://ai.google.dev/static/gemini-api/docs/video/images/running_snow_leopard.gif',
    model: 'Veo 2',
    duration: '6s'
  },
  {
    id: '4',
    title: 'Snow leopard',
    prompt:
      'A cute creature with snow leopard-like fur is walking in winter forest, 3D cartoon style render.	',
    thumbnailUrl:
      'https://ai.google.dev/static/gemini-api/docs/video/images/snow_leopard_short.gif',
    model: 'Veo 2',
    duration: '7s'
  },
  {
    id: '5',
    title: 'Subject',
    prompt:
      'An architectural rendering of a white concrete apartment building with flowing organic shapes, seamlessly blending with lush greenery and futuristic elements',
    thumbnailUrl:
      'https://ai.google.dev/static/gemini-api/docs/video/images/white_building.gif',
    model: 'Veo 2',
    duration: '5s'
  },
  {
    id: '6',
    title: 'Context',
    prompt:
      'A satellite floating through outer space with the moon and some stars in the background.',
    thumbnailUrl:
      'https://ai.google.dev/static/gemini-api/docs/video/images/satellite2.gif',
    model: 'Veo 2',
    duration: '5s'
  },
  {
    id: '7',
    title: 'Action',
    prompt:
      'A wide shot of a woman walking along the beach, looking content and relaxed towards the horizon at sunset.',
    thumbnailUrl:
      'https://ai.google.dev/static/gemini-api/docs/video/images/sunset.gif',
    model: 'Veo 2',
    duration: '5s'
  },
  {
    id: '8',
    title: 'Camera motion',
    prompt:
      'A POV shot from a vintage car driving in the rain, Canada at night, cinematic.',
    thumbnailUrl:
      'https://ai.google.dev/static/gemini-api/docs/video/images/pov_shot.gif',
    model: 'Veo 2',
    duration: '5s'
  },
  {
    id: '9',
    title: 'Composition',
    prompt:
      'Extreme close-up of a an eye with city reflected in it.',
    thumbnailUrl:
      'https://ai.google.dev/static/gemini-api/docs/video/images/composition_eye_close_up.gif',
    model: 'Veo 2',
    duration: '5s'
  },
  {
    id: '10',
    title: 'Ambiance',
    prompt:
      'A close-up of a girl holding adorable golden retriever puppy in the park, sunlight.',
    thumbnailUrl:
      'https://ai.google.dev/static/gemini-api/docs/video/images/ambiance_puppy.gif',
    model: 'Veo 2',
    duration: '5s'
  }
]

const onUsePrompt = (prompt: string) => {
  emit('use-prompt', prompt)
}
</script>

<template>
  <UPageSection
    :title="$t('videoExamples')"
    :description="$t('videoExamplesDescription')"
    :ui="{
      container: '!px-0 !pt-6 sm:gap-6 lg:gap-8',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <div class="grid grid-cols-1 md:grid-cols-1 gap-8">
      <Motion
        v-for="(video, index) in videoExamples"
        :key="video.id"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.1 * index }"
        :in-view-options="{ once: true }"
      >
        <VideoPromptCard
          :title="video.title"
          :prompt="video.prompt"
          :thumbnail-url="video.thumbnailUrl"
          :model="video.model"
          :duration="video.duration"
          orientation="horizontal"
          @use-prompt="onUsePrompt"
        />
      </Motion>
    </div>
  </UPageSection>
</template>
