<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()

const items = computed(
  () =>
    [
      {
        label: t('aiToolMenu.imagen'),
        icon: 'hugeicons:ai-image',
        slot: 'image' as const,
        to: '/app',
        exact: true
        // children: [
        //   {
        //     label: t('aiToolMenu.imagen3'),
        //     description: t('aiToolMenu.imagen3Description')
        //   },
        //   {
        //     label: t('aiToolMenu.imagen4'),
        //     description: t('aiToolMenu.imagen4Description'),
        //     disabled: true,
        //     badge: t('aiToolMenu.soon')
        //   },
        //   {
        //     label: t('aiToolMenu.gemini2Flash'),
        //     description: t('aiToolMenu.gemini2FlashDescription')
        //   }
        // ]
      },
      {
        label: t('aiToolMenu.videoGen'),
        icon: 'hugeicons:ai-video',
        slot: 'components' as const,
        to: '/app/video-gen'
        // children: [
        //   {
        //     label: t('aiToolMenu.veo2'),
        //     description: t('aiToolMenu.veo2Description')
        //   },
        //   {
        //     label: t('aiToolMenu.veo3'),
        //     description: t('aiToolMenu.veo3Description')
        //   }
        // ]
      },
      {
        label: t('aiToolMenu.speechGen'),
        icon: 'hugeicons:ai-voice',
        slot: 'components' as const,
        to: '/app/speech-gen'
        // children: [
        //   {
        //     label: t('aiToolMenu.gemini25Pro'),
        //     description: t('aiToolMenu.gemini25ProDescription')
        //   },
        //   {
        //     label: t('aiToolMenu.gemini25Flash'),
        //     description: t('aiToolMenu.gemini25FlashDescription')
        //   }
        // ]
      },
      {
        label: t('Multi-speaker Gen'),
        icon: 'hugeicons:ai-user',
        slot: 'components' as const,
        to: '/app/multi-speaker-gen'
        // children: [
        //   {
        //     label: t('aiToolMenu.gemini25Pro'),
        //     description: t('aiToolMenu.gemini25ProDescription')
        //   },
        //   {
        //     label: t('aiToolMenu.gemini25Flash'),
        //     description: t('aiToolMenu.gemini25FlashDescription')
        //   }
        // ]
      }
      // {
      //   label: t('aiToolMenu.musicGen'),
      //   icon: 'ri:music-ai-fill',
      //   slot: 'components' as const,
      //   to: '/app/music-gen',
      //   children: [
      //     {
      //       label: t('aiToolMenu.link'),
      //       description: t('aiToolMenu.linkDescription')
      //     }
      //   ]
      // }
    ] satisfies NavigationMenuItem[]
)
</script>

<template>
  <UNavigationMenu
    :items="items"
    class=""
    :ui="{
      root: 'w-full flex-1 justify-center sm:justify-start items-center',
      list: 'flex flex-wrap gap-2 w-full !justify-center',
      viewport: 'z[30]',
      content: 'sm:w-auto min-h-[200px]',
      link: 'flex-col sm:flex-row',
      linkTrailingIcon: 'hidden sm:block',
      linkLeadingIcon: 'size-8 sm:size-6'
    }"
    :delay-duration="700"
  />
</template>
