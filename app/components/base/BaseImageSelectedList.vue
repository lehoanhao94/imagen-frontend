<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ImageFile {
  src: string
  alt: string
  file: File
}

interface Props {
  modelValue?: ImageFile[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: ImageFile[]]
  'remove': [src: string]
}>()

const { t } = useI18n()

// Track which avatar is being hovered or tapped
const hoveredIndex = ref<number | null>(null)
const isTouchDevice = ref(false)

// Check if it's a touch device on component mount
onMounted(() => {
  isTouchDevice.value
    = 'ontouchstart' in window || navigator.maxTouchPoints > 0
})

const handleMouseEnter = (index: number) => {
  hoveredIndex.value = index
}

const handleMouseLeave = () => {
  hoveredIndex.value = null
}

const handleTap = (index: number) => {
  if (isTouchDevice.value) {
    if (hoveredIndex.value === index) {
      hoveredIndex.value = null
    } else {
      hoveredIndex.value = index
    }
  }
}

const removeImage = (src: string) => {
  const updatedImages = props.modelValue.filter(image => image.src !== src)
  emit('update:modelValue', updatedImages)
  emit('remove', src)
}
</script>

<template>
  <UAvatarGroup v-if="modelValue.length > 0">
    <UPopover
      v-for="(image, index) in modelValue"
      :key="index"
      mode="hover"
      :open-delay="300"
      arrow
      :content="{
        side: 'top',
        align: 'center'
      }"
    >
      <div
        class="relative"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave()"
        @click="handleTap(index)"
      >
        <UAvatar
          :src="image.src"
          :alt="image.alt || t('imageSelect.selectedImage')"
          class="transition-all duration-200"
          :class="{ 'opacity-50': hoveredIndex === index }"
        />
        <!-- Overlay with remove button -->
        <div
          v-if="hoveredIndex === index"
          class="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
        >
          <UButton
            icon="i-lucide-x"
            color="error"
            variant="solid"
            size="xs"
            class="rounded-full"
            :title="t('imageSelect.removeImage')"
            :aria-label="t('imageSelect.removeImage')"
            @click.stop="removeImage(image.src)"
          />
        </div>
      </div>
      <template #content>
        <div class="">
          <img
            :src="image.src"
            :alt="image.alt || t('imageSelect.selectedImage')"
            class="w-44 h-44 object-cover rounded-lg"
          >
        </div>
      </template>
    </UPopover>
  </UAvatarGroup>
</template>

<style scoped>
.u-avatar {
  position: relative;
  overflow: visible;
}
</style>
