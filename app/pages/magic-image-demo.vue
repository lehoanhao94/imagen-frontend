<template>
  <UPage>
    <UPageHero
      :title="$t('magicImageDemo.title')"
      :description="$t('magicImageDemo.description')"
    />
    <UPageSection>
      <div class="grid grid-cols-1 gap-8">
        <div class="h-[500px]">
          <BaseMagicImage
            :image-url="currentImage"
            :auto-transform="true"
            :particle-count="20000"
            :transformation-duration="3000"
          />
        </div>

        <div class="flex flex-wrap gap-4 justify-center">
          <UButton
            v-for="(image, index) in aiImages"
            :key="index"
            :color="currentImage === image ? 'primary' : 'gray'"
            @click="currentImage = image"
          >
            {{ $t('magicImageDemo.image') }} {{ index + 1 }}
          </UButton>
        </div>

        <div class="prose dark:prose-invert mx-auto">
          <h2>{{ $t('magicImageDemo.aboutTitle') }}</h2>
          <p>
            {{ $t('magicImageDemo.aboutDescription') }}
          </p>
          <h3>{{ $t('magicImageDemo.featuresTitle') }}</h3>
          <ul>
            <li>{{ $t('magicImageDemo.features.particleRendering') }}</li>
            <li>{{ $t('magicImageDemo.features.smoothTransitions') }}</li>
            <li>{{ $t('magicImageDemo.features.interactiveControls') }}</li>
            <li>{{ $t('magicImageDemo.features.customizable') }}</li>
            <li>{{ $t('magicImageDemo.features.automatic') }}</li>
          </ul>
          <h3>{{ $t('magicImageDemo.howItWorksTitle') }}</h3>
          <p>
            {{ $t('magicImageDemo.howItWorksDescription') }}
          </p>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup>
import { ref } from 'vue'

// Sample AI-generated images
const aiImages = [
  'https://images.unsplash.com/photo-1701615004837-40d8573b6652',
  'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
  'https://images.unsplash.com/photo-1675351066828-6bbd840a86d5',
  'https://images.unsplash.com/photo-1686591062448-3c2d39e9a2c2'
]

const currentImage = ref(aiImages[0])
</script>
