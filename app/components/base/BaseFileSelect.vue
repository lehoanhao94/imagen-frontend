<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue?: File[]
  multiple?: boolean
  supportFiles?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  multiple: false,
  supportFiles: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: File[]]
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
    const newFiles: File[] = []
    const filesToProcess = props.multiple ? Array.from(files) : [files[0]]

    for (const file of filesToProcess) {
      console.log('🚀 ~ handleFileChange ~ file:', file?.type)
      // Only accept image files
      if (file && props.supportFiles.includes(file.type)) {
        newFiles.push(file)
      } else {
        alert(t('Please select a supported file'))
        return
      }
    }

    // Emit the updated value
    if (newFiles.length > 0) {
      const updatedValue = props.multiple
        ? [...props.modelValue, ...newFiles]
        : newFiles

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
      icon="majesticons:file-plus"
      size="sm"
      color="neutral"
      variant="soft"
      :label="multiple ? $t('Select Files') : $t('Select File')"
      @click="handleClick"
    />
    <input
      ref="fileInput"
      type="file"
      :accept="`application/pdf, .docx, .txt, .mobi, .epub, .pptx, .xlsx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.presentation, .html, .${supportFiles.join(
        ', .'
      )}`"
      :multiple="multiple"
      class="hidden"
      @change="handleFileChange"
    >
  </div>
</template>
