<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="relative h-screen flex-col">
    <div class="flex justify-center px-4 pt-10">
      <UButton
        icon="i-lucide-chevron-left"
        to="/"
        size="xl"
        color="neutral"
        variant="subtle"
        class="absolute left-8 top-8 rounded-full z-10"
        :aria-label="t('auth.backToHome')"
        :title="t('auth.backToHome')"
      />

      <UPageCard
        variant="ghost"
        class="max-w-sm w-full"
      >
        <div
          class="logo-container w-20 h-20 mx-auto animate__animated animate__zoomInDown"
        >
          <BaseLogo
            id="main-logo"
            :loading="false"
            :class="{ 'logo-loading animate__pulse': false }"
            class="animate__animated animate__infinite"
          />
        </div>
        <slot />
      </UPageCard>

      <LazyLayoutStarBg />
      <BaseLoadingOverlay />
    </div>
    <AppFooter />
  </div>
</template>
