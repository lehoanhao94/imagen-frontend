<script setup lang="ts">
import { ref } from 'vue'

const aiToolStore = useAIToolStore()
const { t } = useI18n()
const fileInput = ref<HTMLInputElement | null>(null)

const handleClick = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files && files.length > 0) {
    const file = files[0]

    // Only accept image files
    if (file && file.type.startsWith('image/')) {
      // Create a URL for the image
      const imageUrl = URL.createObjectURL(file)

      // Add the image to the store
      aiToolStore.addImage({
        src: imageUrl,
        alt: file.name,
        file: file
      })

      // Reset the input so the same file can be selected again
      target.value = ''
    } else {
      alert(t('imageSelect.pleaseSelectImageFile'))
    }
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
      :label="$t('addImage')"
      @click="handleClick"
    />
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>
