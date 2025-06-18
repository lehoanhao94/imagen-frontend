<template>
  <UButton
    v-if="isValidLink"
    :color="isDownloaded ? 'success' : 'neutral'"
    variant="subtle"
    :icon="
      isDownloaded
        ? 'line-md:circle-filled-to-confirm-circle-filled-transition'
        : 'line-md:download-outline-loop'
    "
    size="lg"
    @click="downloadFile"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  link: {
    type: String,
    required: true
  }
})

const isDownloaded = ref(false)
const error = ref<string | null>(null)
const downloadFile = () => {
  isDownloaded.value = false
  error.value = null
  // Reset error message before starting the download
  if (isDownloaded.value) {
    return // Prevent multiple clicks while downloading
  }
  // check if the link is valid
  if (!props.link || !props.link.startsWith('http')) {
    error.value = 'Invalid download link'
    return
  }

  const link = document.createElement('a')
  link.href = props.link
  link.download = props.link.split('/').pop() || 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  isDownloaded.value = true
  setTimeout(() => {
    isDownloaded.value = false
  }, 2000) // Reset after 2 seconds
}

const isValidLink = computed(() => {
  return props.link && props.link.startsWith('http')
})
</script>
