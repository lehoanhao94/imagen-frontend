<template>
  <UPage>
    <UPageHero
      title="AI Image Particle Effect"
      description="A demonstration of the BaseMagicImage component that transforms particles into AI-generated images"
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
            @click="currentImage = image"
            :color="currentImage === image ? 'primary' : 'gray'"
          >
            Image {{ index + 1 }}
          </UButton>
        </div>
        
        <div class="prose dark:prose-invert mx-auto">
          <h2>About This Component</h2>
          <p>
            The BaseMagicImage component uses Three.js to create a particle system that can transform between random positions and an AI-generated image. The particles move with swirling and flowing effects, creating a magical transformation.
          </p>
          <h3>Features</h3>
          <ul>
            <li>Particle-based image rendering</li>
            <li>Smooth transitions between random particle positions and image formation</li>
            <li>Interactive camera controls (drag to rotate, scroll to zoom)</li>
            <li>Customizable particle count and animation duration</li>
            <li>Automatic or manual transformation triggering</li>
          </ul>
          <h3>How It Works</h3>
          <p>
            The component analyzes the pixels of an image and creates a 3D particle system where each particle represents a pixel. Brighter pixels are positioned closer to the viewer, creating a subtle 3D effect. The particles are initially scattered randomly in 3D space, then animate to form the image when triggered.
          </p>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup>
import { ref } from 'vue';

// Sample AI-generated images
const aiImages = [
  'https://images.unsplash.com/photo-1701615004837-40d8573b6652',
  'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
  'https://images.unsplash.com/photo-1675351066828-6bbd840a86d5',
  'https://images.unsplash.com/photo-1686591062448-3c2d39e9a2c2'
];

const currentImage = ref(aiImages[0]);
</script>
