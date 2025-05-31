<template>
  <UPage>
    <UPageHero
      :title="$t('AI Image Generator')"
      :description="$t('Generate AI images from text prompts with a magical particle transformation effect')"
    />
    <UPageSection>
      <div class="grid grid-cols-1 gap-8">
        <div class="w-full">
          <UCard>
            <template #header>
              <div class="flex flex-col space-y-4">
                <UFormGroup :label="$t('Enter your prompt')">
                  <UTextarea
                    v-model="prompt"
                    :placeholder="$t('Describe the image you want to generate...')"
                    :rows="3"
                    class="w-full"
                  />
                </UFormGroup>
                <div class="flex justify-end">
                  <UButton
                    @click="generateImage"
                    :loading="isGenerating"
                    :disabled="!prompt || isGenerating"
                    color="primary"
                  >
                    {{ isGenerating ? $t('Generating...') : $t('Generate Image') }}
                  </UButton>
                </div>
              </div>
            </template>

            <div class="h-[500px] bg-gray-900 rounded-lg overflow-hidden">
              <div v-if="!currentImage" class="h-full flex items-center justify-center text-gray-400">
                <div class="text-center">
                  <UIcon name="i-lucide-image" class="text-5xl mb-2" />
                  <p>{{ $t('Enter a prompt and click Generate Image to create an AI image') }}</p>
                </div>
              </div>
              <BaseMagicImage
                v-else
                :image-url="currentImage"
                :auto-transform="true"
                :particle-count="30000"
                :transformation-duration="3000"
                :show-controls="false"
              />
            </div>

            <template #footer v-if="currentImage">
              <div class="flex justify-between items-center">
                <p class="text-sm text-gray-500">
                  <span class="font-semibold">Prompt:</span> {{ lastPrompt }}
                </p>
                <UButton
                  @click="downloadImage"
                  variant="soft"
                  color="gray"
                  icon="i-lucide-download"
                >
                  Download
                </UButton>
              </div>
            </template>
          </UCard>
        </div>

        <div class="prose dark:prose-invert mx-auto">
          <h2>{{ $t('How It Works') }}</h2>
          <p>
            {{ $t('This AI image generator uses a particle-based transformation effect to visualize the creation process. When you enter a prompt and click \'Generate\', the system:') }}
          </p>
          <ol>
            <li>{{ $t('Sends your prompt to an AI image generation API') }}</li>
            <li>{{ $t('Creates a particle system with thousands of tiny particles') }}</li>
            <li>{{ $t('Transforms the random noise particles into the generated image') }}</li>
          </ol>
          <p>
            {{ $t('The particles start in a random noise pattern and then smoothly transform into the final image, creating a magical effect that simulates the AI\'s creative process.') }}
          </p>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup>
import { ref } from 'vue';

const prompt = ref('');
const lastPrompt = ref('');
const currentImage = ref('');
const isGenerating = ref(false);

// Mock image generation API - in a real app, this would call an actual API
async function generateImage() {
  if (!prompt.value) return;

  isGenerating.value = true;
  lastPrompt.value = prompt.value;

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo purposes, we'll use the local demo image
    // In a real application, you would call an actual AI image generation API

    // First set to empty to trigger reload if same image is selected
    currentImage.value = '';

    // Set after a short delay to simulate API call
    setTimeout(() => {
      // Use the local demo image
      currentImage.value = '/images/demo.jpg';

      // Trigger the particle transformation effect
      setTimeout(() => {
        const magicImageComponent = document.querySelector('.magic-image-container');
        if (magicImageComponent) {
          // Find the component instance and call its method
          const triggerButton = magicImageComponent.querySelector('button');
          if (triggerButton) {
            triggerButton.click();
          }
        }
      }, 500);
    }, 500);
  } catch (error) {
    console.error('Error generating image:', error);
    // Handle error
  } finally {
    isGenerating.value = false;
  }
}

function downloadImage() {
  if (!currentImage.value) return;

  // For local images, we need to fetch them first to get a blob URL
  fetch(currentImage.value)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ai-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
      console.error('Error downloading image:', error);
    });
}
</script>
