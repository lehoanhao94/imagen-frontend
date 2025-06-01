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
  description: t(`imageStyles.${style.toLowerCase().replace(/\s+/g, '-')}.description`),
  icon: 'lucide:palette'
}))

// Example images for each style
const imageExamplesByStyle: Record<string, ImageExample[]> = {
  '3d-render': [
    {
      id: '1',
      title: '3D Character',
      prompt: 'A futuristic robot character with metallic textures, rendered in high-quality 3D with realistic lighting and shadows',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=500&fit=crop',
      style: '3D Render'
    },
    {
      id: '2',
      title: '3D Architecture',
      prompt: 'Modern architectural building with glass and steel, photorealistic 3D rendering with environment lighting',
      imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=500&h=500&fit=crop',
      style: '3D Render'
    }
  ],
  'acrylic': [
    {
      id: '3',
      title: 'Acrylic Landscape',
      prompt: 'Mountain landscape painted in vibrant acrylic colors with bold brushstrokes and texture',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
      style: 'Acrylic'
    },
    {
      id: '4',
      title: 'Acrylic Portrait',
      prompt: 'Colorful portrait in acrylic painting style with expressive brushwork and vivid colors',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=500&fit=crop',
      style: 'Acrylic'
    }
  ],
  'anime-general': [
    {
      id: '5',
      title: 'Anime Character',
      prompt: 'Anime style character with large expressive eyes, colorful hair, and detailed clothing',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
      style: 'Anime General'
    },
    {
      id: '6',
      title: 'Anime Landscape',
      prompt: 'Beautiful anime-style landscape with cherry blossoms, traditional architecture, and soft lighting',
      imageUrl: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=500&h=500&fit=crop',
      style: 'Anime General'
    }
  ],
  'creative': [
    {
      id: '7',
      title: 'Creative Abstract',
      prompt: 'Abstract creative artwork with flowing colors, dynamic composition, and artistic interpretation',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=500&fit=crop',
      style: 'Creative'
    },
    {
      id: '8',
      title: 'Creative Portrait',
      prompt: 'Artistic portrait with creative lighting effects, unusual angles, and innovative composition',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
      style: 'Creative'
    }
  ],
  'dynamic': [
    {
      id: '9',
      title: 'Dynamic Action',
      prompt: 'High-energy action scene with motion blur, dramatic lighting, and dynamic composition',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=500&fit=crop',
      style: 'Dynamic'
    },
    {
      id: '10',
      title: 'Dynamic Architecture',
      prompt: 'Modern building with dynamic angles, bold geometric shapes, and dramatic perspective',
      imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=500&h=500&fit=crop',
      style: 'Dynamic'
    }
  ],
  'fashion': [
    {
      id: '11',
      title: 'Fashion Portrait',
      prompt: 'High-fashion portrait with elegant styling, professional lighting, and luxury aesthetic',
      imageUrl: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=500&h=500&fit=crop',
      style: 'Fashion'
    },
    {
      id: '12',
      title: 'Fashion Photography',
      prompt: 'Editorial fashion shoot with avant-garde clothing, dramatic poses, and studio lighting',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
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
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
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
  return imageStyles.find(style => style.name === selectedStyle.value) || null
})

watch(() => props.modelValue, (newValue) => {
  selectedStyle.value = newValue || null
})
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
      class="w-full justify-between"
      @click="openModal"
    />

    <!-- Image Style Selection Modal -->
    <UModal
      v-model:open="isModalOpen"
      :ui="{
        content: 'max-w-6xl'
      }"
    >
      <template #content>
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold">
              {{ t('imageStyles.selectImageStyle') }}
            </h3>
            <UButton
              icon="lucide:x"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="cancelSelection"
            />
          </div>

          <!-- Two Column Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
            <!-- Left Column: Image Styles -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ t('imageStyles.chooseStyle') }}
              </h4>
              <div class="space-y-2 max-h-[400px] overflow-y-auto">
                <button
                  v-for="style in imageStyles"
                  :key="style.id"
                  class="w-full p-4 text-left border rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  :class="{
                    'border-primary-500 bg-primary-50 dark:bg-primary-900/20': tempSelectedStyle === style.name,
                    'border-gray-200 dark:border-gray-700': tempSelectedStyle !== style.name
                  }"
                  @click="selectTempStyle(style.name)"
                >
                  <div class="flex items-start gap-3">
                    <UIcon
                      :name="style.icon"
                      class="w-5 h-5 mt-1 text-gray-600 dark:text-gray-400"
                    />
                    <div class="flex-1">
                      <h5 class="font-medium text-gray-900 dark:text-white">
                        {{ style.name }}
                      </h5>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {{ style.description }}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Right Column: Examples -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ t('imageStyles.examples') }}
              </h4>
              <div
                v-if="tempSelectedStyle"
                class="space-y-4 max-h-[400px] overflow-y-auto"
              >
                <div
                  v-for="example in currentImageExamples"
                  :key="example.id"
                  class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    :src="example.imageUrl"
                    :alt="example.title"
                    class="w-full h-32 object-cover"
                  >
                  <div class="p-3">
                    <h6 class="font-medium text-sm text-gray-900 dark:text-white">
                      {{ example.title }}
                    </h6>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {{ example.prompt }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400"
              >
                <div class="text-center">
                  <UIcon
                    name="lucide:palette"
                    class="w-12 h-12 mx-auto mb-3 opacity-50"
                  />
                  <p>{{ t('imageStyles.selectStyleToSeeExamples') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex justify-end gap-3 mt-6 pt-6 border-t">
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
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
