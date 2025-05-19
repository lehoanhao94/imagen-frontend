<script setup lang="ts">
const { model } = useLLM()

const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}
</script>

<template>
  <UPage v-if="page">
    <AiToolTextToImage :page />
    <div
      v-if="false"
      class="h-[80vh] flex flex-col justify-center"
    >
      <div>
        <BaseAppTitle />
      </div>
      <UChatPrompt
        class="[view-transition-name:chat-prompt] mt-15"
        variant="subtle"
        :placeholder="$t('Describe the image you want to generate...')"
      >
        <UChatPromptSubmit
          color="primary"
          label="Generate"
          class="bg-gradient-to-r from-primary to-violet-400 max-h-10"
          icon="mingcute:ai-fill"
        />

        <template #footer />
      </UChatPrompt>
      <div class="flex items-center gap-3 mt-4">
        <UFormField :label="$t('Model/Preset')">
          <BaseModelSelect />
        </UFormField>
        <UFormField
          v-if="model.options.includes('style')"
          :label="$t('Style')"
        >
          <BaseStyleSelect />
        </UFormField>
        <UFormField
          v-if="model.options.includes('imageDimensions')"
          :label="$t('Image Dimensions')"
        >
          <BaseImageDimensionsSelect />
        </UFormField>
        <UFormField
          v-if="model.options.includes('yourImage')"
          :label="$t('Your Image')"
        >
          <BaseImageSelect />
        </UFormField>
      </div>
      <!-- <div class="mt-10">
      <BaseImageLoading />
    </div> -->
    </div>
  </UPage>
</template>
