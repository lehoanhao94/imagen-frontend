<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = [
  {
    label: 'Imagen',
    icon: 'hugeicons:ai-image',
    slot: 'image' as const,
    to: '/app',
    exact: true,
    children: [
      {
        label: 'Imagen 3',
        description:
          'Generate high-quality, detailed images with accurate text rendering for creative visual content.'
      },
      {
        label: 'Imagen 4',
        description:
          'Express your ideas like never before — with Imagen, creativity has no limits.',
        disabled: true,
        badge: 'Soon'
      },
      {
        label: 'Gemini 2.0 Flash',
        description:
          'Gemini 2.0 Flash is a powerful tool for generating images from text prompts.'
      }
    ]
  },
  {
    label: 'Video Gen',
    icon: 'i-lucide-box',
    slot: 'components' as const,
    to: '/app/video-gen',
    children: [
      {
        label: 'Veo 2',
        description:
          'Greater control, consistency, and creativity than ever before.'
      },
      {
        label: 'Veo 3',
        description:
          'Video, meet audio. Our latest video generation model, designed to empower filmmakers and storytellers.'
      }
    ]
  },
  {
    label: 'Speech Gen',
    icon: 'hugeicons:ai-voice',
    slot: 'components' as const,
    to: '/app/speech-gen',
    children: [
      {
        label: 'Gemini 2.5 Pro',
        description: 'The most advanced text-to-speech model available.'
      },
      {
        label: 'Gemini 2.5 Flash',
        description: `Large scale processing (e.g. multiple pdfs).
Low latency, high volume tasks which require thinking
Agentic use cases`
      }
    ]
  },
  {
    label: 'Music Gen',
    icon: 'ri:music-ai-fill',
    slot: 'components' as const,
    to: '/app/music-gen',
    children: [
      {
        label: 'Link',
        description: 'Use NuxtLink with superpowers.'
      }
    ]
  }
] satisfies NavigationMenuItem[]
</script>

<template>
  <UNavigationMenu
    :items="items"
    class="w-full justify-start"
    :ui="{
      viewport: 'z[30]',
      content: 'sm:w-auto min-h-[200px]'
    }"
    :delay-duration="700"
  />
</template>
