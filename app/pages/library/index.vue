<script setup lang="ts">
const { t } = useI18n()

// Library categories with routing
const libraryCategories = computed(() => [
  {
    key: 'imagen',
    label: t('library.tabs.imagen'),
    icon: 'hugeicons:ai-image',
    route: '/library/imagen',
    description: 'AI-generated images and artwork'
  },
  {
    key: 'video-gen',
    label: t('library.tabs.video'),
    icon: 'hugeicons:ai-video',
    route: '/library/video-gen',
    description: 'AI-generated videos and animations'
  },
  {
    key: 'speech',
    label: t('library.tabs.speech'),
    icon: 'hugeicons:ai-voice',
    route: '/library/speech',
    description: 'AI-generated speech and voice content'
  },
  {
    key: 'music',
    label: t('library.tabs.music'),
    icon: 'ri:music-ai-fill',
    route: '/library/music',
    description: 'AI-generated music and audio'
  }
])
</script>

<template>
  <UPage>
    <UContainer class="pt-30">
      <UPageHero
        title="AI Content Library"
        description="Browse and manage your AI-generated content across different categories"
      />

      <UPageSection>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Motion
            v-for="(category, index) in libraryCategories"
            :key="category.key"
            :initial="{
              scale: 1.1,
              opacity: 0,
              filter: 'blur(20px)'
            }"
            :animate="{
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)'
            }"
            :transition="{
              duration: 0.6,
              delay: index * 0.1
            }"
          >
            <UCard
              :to="category.route"
              class="group hover:bg-muted/50 transition-colors cursor-pointer h-full"
            >
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    :name="category.icon"
                    class="w-8 h-8 text-primary group-hover:scale-110 transition-transform"
                  />
                  <h3 class="text-lg font-semibold">
                    {{ category.label }}
                  </h3>
                </div>
              </template>

              <p class="text-muted-foreground text-sm">
                {{ category.description }}
              </p>

              <template #footer>
                <div class="flex justify-end">
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                  />
                </div>
              </template>
            </UCard>
          </Motion>
        </div>
      </UPageSection>
    </UContainer>
  </UPage>
</template>
