<script setup lang="ts">
interface ImageStyle {
  id: string
  name: string
  description: string
  icon: string
}

interface ImageExample {
  id: string
  title: string
  prompt: string
  imageUrl: string
  style: string
}

interface ImageStyleSelectProps {
  modelValue?: string | null
}

const props = defineProps<ImageStyleSelectProps>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const { styles } = useStyles()

// Create ImageStyle objects from the styles list
const imageStyles: ImageStyle[] = styles.map(style => ({
  id: style.toLowerCase().replace(/\s+/g, '-'),
  name: style,
  description: t(
    `imageStyles.${style.toLowerCase().replace(/\s+/g, '-')}.description`
  ),
  icon: 'lucide:palette'
}))

// Example images for each style
const imageExamplesByStyle: Record<string, ImageExample[]> = {
  '3d-render': [
    {
      id: '1',
      title: '3D Render',
      prompt:
        'A charming miniature restaurant interior, rendered with ultra-realistic details and soft morning light. An AI-anthropomorphized orange kitten with a plump round face and expressive eyes shines brightly. The kitten is wearing a white long-sleeved hoodie under pale blue overalls, with its tail peeking out from under the clothes. The kitten has entered a restaurant and is eating udon noodles with chopsticks. He is seated. The noodles are topped with seaweed and spring onion. Style: Handmade miniature diorama, soft and shallow depth of field, Studio Ghibli-inspired aesthetic, warm country atmosphere, 8K resolution, slow motion, close-up, only the face and the udon noodles are visible',
      imageUrl:
        'https://cdn.leonardo.ai/users/79aca543-3693-400d-bb1f-f15c57de4225/generations/0c1c1d3b-0d85-4a51-885f-ceb0eab4a3b1/Leonardo_Phoenix_10_A_charming_miniature_restaurant_interior_r_6.jpg?w=512',
      style: '3D Render'
    }
  ],
  'acrylic': [
    {
      id: '3',
      title: 'Acrylic',
      prompt:
        'Mountain landscape painted in vibrant acrylic colors with bold brushstrokes and texture',
      imageUrl:
        'https://cdn.leonardo.ai/users/954c4d2e-803e-4306-93b4-74d452bd6e60/generations/f75e2e50-2664-44ab-b5fd-8ec4a25d3825/Leonardo_Phoenix_10_Crystal_lagoon_at_sunrise_split_view_with_3.jpg?w=512',
      style: 'Acrylic'
    }
  ],
  'anime-general': [
    {
      id: '5',
      title: 'Anime General',
      prompt:
        'Anime style character with large expressive eyes, colorful hair, and detailed clothing',
      imageUrl:
        'https://cdn.leonardo.ai/users/5fc68b74-7ce5-42c3-96e2-8f1239bef207/generations/c640e125-7a5f-4236-bd8f-2bc5fe4270e3/segments/4:4:1/Leonardo_Phoenix_10_A_powerful_martial_artist_stands_confident_0.jpg?w=512',
      style: 'Anime General'
    }
  ],
  'creative': [
    {
      id: '7',
      title: 'Creative',
      prompt:
        'Abstract creative artwork with flowing colors, dynamic composition, and artistic interpretation',
      imageUrl:
        'https://cdn.leonardo.ai/users/6f04321b-e9c7-4ebc-bef5-c50a26de2bbb/generations/fa26cacc-ce5d-46aa-8d08-919ff995f993/Leonardo_Phoenix_10_a_vibrant_and_whimsical_cityscape_at_dusk_3.jpg?w=512',
      style: 'Creative'
    }
  ],
  'dynamic': [
    {
      id: '9',
      title: 'Dynamic',
      prompt:
        'High-energy action scene with motion blur, dramatic lighting, and dynamic composition',
      imageUrl:
        'https://cdn.leonardo.ai/users/d0703f94-2c47-4575-9bb9-ed6629e7e170/generations/3381b72f-ce9f-4a83-85d8-e28bda3f54a4/segments/1:2:2/Leonardo_Phoenix_10_A_majestic_cityscape_at_night_featuring_a_1.jpg?w=512',
      style: 'Dynamic'
    }
  ],
  'fashion': [
    {
      id: '11',
      title: 'Fashion',
      prompt:
        'High-fashion portrait with elegant styling, professional lighting, and luxury aesthetic',
      imageUrl:
        'https://cdn.leonardo.ai/users/40e59c8d-885d-45a2-8bfa-c7365d463da9/generations/58ed6961-04af-4f15-8c81-6dca7c700d57/Leonardo_Phoenix_10_vibrant_colorful_Aquatint_print_of_a_warri_3.jpg?w=512',
      style: 'Fashion'
    }
  ]
}

// Add default examples for styles without specific examples
styles.forEach((style) => {
  const styleId = style.toLowerCase().replace(/\s+/g, '-')
  if (!imageExamplesByStyle[styleId]) {
    imageExamplesByStyle[styleId] = [
      {
        id: `default-${styleId}-1`,
        title: `${style} Example`,
        prompt: `Example image in ${style} style with professional quality and artistic composition`,
        imageUrl:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
        style: style
      }
    ]
  }
})

const selectedStyle = ref<string | null>(props.modelValue || null)
const isModalOpen = ref(false)
const tempSelectedStyle = ref<string | null>(null)

const openModal = () => {
  tempSelectedStyle.value = selectedStyle.value
  isModalOpen.value = true
}

const confirmSelection = () => {
  if (tempSelectedStyle.value) {
    selectedStyle.value = tempSelectedStyle.value
    emit('update:modelValue', tempSelectedStyle.value)
  }
  isModalOpen.value = false
}

const cancelSelection = () => {
  tempSelectedStyle.value = selectedStyle.value
  isModalOpen.value = false
}

const selectTempStyle = (style: string) => {
  tempSelectedStyle.value = style
}

const currentImageExamples = computed(() => {
  if (!tempSelectedStyle.value) return []
  const styleId = tempSelectedStyle.value.toLowerCase().replace(/\s+/g, '-')
  return imageExamplesByStyle[styleId] || []
})

const selectedStyleObject = computed(() => {
  if (!selectedStyle.value) return null
  return (
    imageStyles.find(style => style.name === selectedStyle.value) || null
  )
})

watch(
  () => props.modelValue,
  (newValue) => {
    selectedStyle.value = newValue || null
  }
)
</script>

<template>
  <div>
    <!-- Button to open Modal -->
    <UButton
      :label="selectedStyle ? selectedStyle : t('imageStyles.selectImageStyle')"
      :icon="selectedStyleObject ? selectedStyleObject.icon : 'lucide:palette'"
      color="neutral"
      variant="outline"
      trailing-icon="lucide:chevron-down"
      class="justify-between"
      v-bind="$attrs"
      @click="openModal"
    />

    <!-- Image Style Selection Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="t('imageStyles.selectImageStyle')"
      :ui="{ footer: 'justify-end', content: 'max-w-6xl', body: '!p-0' }"
    >
      <template #body>
        <div class="h-full grid grid-cols-12 gap-4">
          <div
            class="flex flex-col p-4 gap-4 col-span-12 lg:col-span-7 h-[50vh] sm:h-full overflow-y-auto sm:overflow-visible"
          >
            <UCard
              v-for="style in imageStyles"
              :key="style.id"
              class="cursor-pointer transition-all duration-200 hover:shadow-md"
              :class="{
                'ring-1 ring-primary-500 bg-primary-50 dark:bg-primary-950':
                  tempSelectedStyle === style.name,
                'hover:bg-gray-50 dark:hover:bg-gray-800':
                  tempSelectedStyle !== style.name
              }"
              @click="selectTempStyle(style.name)"
            >
              <div class="flex items-start gap-3">
                <UIcon
                  :name="style.icon"
                  class="w-6 h-6 text-primary-500 mt-1 flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <h5
                    class="font-medium text-sm text-gray-900 dark:text-white line-clamp-2"
                  >
                    {{ style.name }}
                  </h5>
                  <p
                    class="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2"
                  >
                    {{ style.description }}
                  </p>
                </div>
                <UIcon
                  v-if="tempSelectedStyle === style.name"
                  name="lucide:check-circle"
                  class="w-5 h-5 text-primary-500 flex-shrink-0"
                />
              </div>
            </UCard>
          </div>
          <div
            class="col-span-12 lg:col-span-5 relative dark:bg-slate-950 p-4 px-6"
          >
            <div class="sticky top-4 sm:h-[70vh">
              <div class="space-y-4">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ t("imageStyles.examples") }}
                </h4>
                <div
                  v-if="tempSelectedStyle"
                  class="space-y-4 overflow-y-auto"
                >
                  <div
                    class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <img
                      :src="`/images/${tempSelectedStyle}.png`"
                      :alt="tempSelectedStyle"
                      class="w-full h-[55vh] object-cover"
                    >
                    <div class="p-3">
                      <h6
                        class="font-medium text-sm text-gray-900 dark:text-white"
                      >
                        DJ with Cat
                      </h6>
                      <p
                        class="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2"
                      >
                        A beautiful and sexy female DJ with long flowing hair,
                        wearing stylish and revealing clubwear, standing
                        confidently at a modern DJ booth with colorful neon
                        lights in the background. Beside her, a cute cat with
                        expressive eyes is sitting calmly, watching her. The
                        atmosphere is vibrant and energetic, like a high-end
                        nightclub. Cinematic lighting, high detail, futuristic
                        and glamorous vibe
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="flex items-center justify-center h-[60vh] text-gray-500"
                >
                  <div class="text-center">
                    <UIcon
                      name="lucide:palette"
                      class="w-12 h-12 mx-auto mb-2 opacity-50"
                    />
                    <p class="text-sm">
                      {{ t("imageStyles.selectStyleToSeeExamples") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <UButton
          :label="t('cancel')"
          color="neutral"
          variant="outline"
          @click="cancelSelection"
        />
        <UButton
          :label="t('confirm')"
          color="primary"
          :disabled="!tempSelectedStyle"
          @click="confirmSelection"
        />
      </template>
    </UModal>
  </div>
</template>
