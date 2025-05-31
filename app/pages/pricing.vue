<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: `${t('pricing.title')} - Imagen`,
  description: t('pricing.description'),
  ogTitle: `${t('pricing.title')} - Imagen`,
  ogDescription: t('pricing.description')
})
</script>

<template>
  <UPage>
    <UPageHero
      :title="$t('pricing.title')"
      :description="$t('pricing.description')"
    />
    <UPageSection>
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-4">{{ $t('pricing.comingSoon') }}</h2>
        <p class="text-muted-foreground">
          {{ $t('pricing.comingSoonDescription') }}
        </p>
      </div>
    </UPageSection>
  </UPage>
</template>