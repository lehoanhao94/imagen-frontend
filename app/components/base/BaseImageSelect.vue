<script setup lang="ts">
import { ref } from 'vue'

interface ImageFile {
  src: string
  alt: string
  file: File
}

interface Props {
  modelValue?: ImageFile[]
  multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  multiple: false
})

const emit = defineEmits<{
  'update:modelValue': [value: ImageFile[]]
}>()

const { t } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)

const handleClick = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    const newImages: ImageFile[] = []
    const filesToProcess = props.multiple ? Array.from(files) : [files[0]]

    for (const file of filesToProcess) {
      // Only accept image files
      if (file && file.type.startsWith('image/')) {
        // Create a URL for the image
        const imageUrl = URL.createObjectURL(file)

        const imageFile: ImageFile = {
          src: imageUrl,
          alt: file.name,
          file: file
        }

        newImages.push(imageFile)
      } else {
        alert(t('imageSelect.pleaseSelectImageFile'))
        return
      }
    }

    // Emit the updated value
    if (newImages.length > 0) {
      const updatedValue = props.multiple
        ? [...props.modelValue, ...newImages]
        : newImages

      emit('update:modelValue', updatedValue)
    }

    // Reset the input so the same file can be selected again
    target.value = ''
  }
}
</script>

<template>
  <div>
    <UButton
      icon="majesticons:image-plus"
      size="sm"
      color="neutral"
      variant="outline"
      :label="multiple ? $t('addImages') : $t('addImage')"
      @click="handleClick"
    />
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      :multiple="multiple"
      class="hidden"
      @change="handleFileChange"
    >
  </div>
</template>
