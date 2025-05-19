<script setup lang="ts">
const { model } = useLLM()
</script>

<template>
  <div class="h-[80vh] flex flex-col justify-center">
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
        icon=""
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
</template>
