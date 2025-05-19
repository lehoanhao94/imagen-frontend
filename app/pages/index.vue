<script setup lang="ts"></script>

<template>
  <div class="h-[80vh] flex flex-col justify-center">
    <div>
      <BaseAppTitle />
    </div>
    <UChatPrompt
      class="[view-transition-name:chat-prompt] mt-15"
      variant="subtle"
      placeholder="Describe the image you want to generate..."
    >
      <UChatPromptSubmit
        color="primary"
        label="Generate"
        class="bg-gradient-to-r from-primary to-violet-400"
        icon=""
      />

      <template #footer>
        <div class="flex items-center gap-2">
          <BaseModelSelect />
          <UButton
            icon="majesticons:image-plus"
            size="sm"
            color="neutral"
            variant="ghost"
          />
        </div>
      </template>
    </UChatPrompt>

    <!-- <div class="mt-10">
      <BaseImageLoading />
    </div> -->
  </div>
</template>
