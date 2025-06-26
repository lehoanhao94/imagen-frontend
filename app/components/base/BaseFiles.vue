<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue?: File[]
  uploadProgress?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  uploadProgress: 0
})

const emit = defineEmits<{
  'update:modelValue': [value: File[]]
}>()

const { t } = useI18n()

const fileIcon = (file: File) => {
  if (file.type.startsWith('application/pdf')) {
    return 'vscode-icons:file-type-pdf2'
  } else if (
    file.type.startsWith(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
  ) {
    return 'vscode-icons:file-type-word'
  } else if (
    file.type.startsWith(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
  ) {
    return 'vscode-icons:file-type-excel'
  } else if (
    file.type.startsWith(
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    )
  ) {
    return 'vscode-icons:file-type-powerpoint'
  } else if (file.type.startsWith('text/plain')) {
    return 'streamline-flex-color:text-file-flat'
  } else if (file.type.startsWith('application/epub+zip')) {
    return 'vscode-icons:file-type-epub'
  } else if (file.type.startsWith('application/x-mobipocket-ebook')) {
    return 'noto:notebook-with-decorative-cover'
  } else if (file.type.startsWith('application/vnd.ms-powerpoint')) {
    return 'vscode-icons:file-type-powerpoint2'
  } else if (file.type.startsWith('application/vnd.ms-excel')) {
    return 'vscode-icons:file-type-excel2'
  } else {
    return 'i-lucide-file'
  }
}

const shorterFileName = (file: File) => {
  // cut first 10 characters and last 10 characters
  return (
    file.name.slice(0, 10)
    + '...'
    + file.name.slice(-10)
    + ` (${formatFileSize(file.size)})`
  )
}

const onRemoveSelectedFile = (file: File) => {
  const updatedFiles = props.modelValue.filter(f => f.name !== file.name)
  emit('update:modelValue', updatedFiles)
}

const uploaded = ref(false)
watch(
  () => props.uploadProgress,
  (newValue) => {
    if (newValue === 100) {
      uploaded.value = true
      setTimeout(() => {
        uploaded.value = false
      }, 2000)
    }
  }
)
</script>

<template>
  <div>
    <UButtonGroup
      v-for="file in props.modelValue"
      :key="file.name"
    >
      <UButton
        :icon="fileIcon(file)"
        color="neutral"
        variant="outline"
        :label="shorterFileName(file)"
      />

      <UButton
        v-if="uploadProgress > 0 && uploadProgress < 100"
        icon="line-md:uploading-loop"
        color="neutral"
        variant="outline"
      >
        {{ $t("Uploading...") }} {{ props.uploadProgress }}%
      </UButton>
      <UButton
        v-else-if="uploaded"
        icon="line-md:circle-filled-to-confirm-circle-filled-transition"
        color="neutral"
        variant="outline"
        class="text-green-500"
      >
        {{ $t("Uploaded") }}
      </UButton>
      <UButton
        v-else
        color="neutral"
        variant="outline"
        icon="mdi:remove"
        class="cursor-pointer"
        @click="onRemoveSelectedFile(file)"
      />
    </UButtonGroup>
  </div>
</template>
