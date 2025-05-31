<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: `${t('privacy.title')} - Imagen`,
  description: t('privacy.description'),
  ogTitle: `${t('privacy.title')} - Imagen`,
  ogDescription: t('privacy.description')
})
</script>

<template>
  <UPage>
    <div
      class="mt-30 w-20 h-20 mx-auto animate__animated animate__zoomInDown"
    >
      <BaseLogo
        id="main-logo"
        :loading="false"
        :class="{ 'logo-loading animate__pulse': false }"
        class="animate__animated animate__infinite"
      />
    </div>
    <UPageHero
      :title="$t('privacy.title')"
      :description="$t('privacy.description')"
    />
    <UPageSection>
      <div class="prose dark:prose-invert max-w-none">
        <h2>{{ $t('privacy.informationWeCollect') }}</h2>
        <p>
          {{ $t('privacy.informationWeCollectDescription') }}
        </p>

        <h2>{{ $t('privacy.howWeUseInformation') }}</h2>
        <p>
          {{ $t('privacy.howWeUseInformationDescription') }}
        </p>

        <h2>{{ $t('privacy.informationSharing') }}</h2>
        <p>
          {{ $t('privacy.informationSharingDescription') }}
        </p>

        <h2>{{ $t('privacy.dataSecurity') }}</h2>
        <p>
          {{ $t('privacy.dataSecurityDescription') }}
        </p>

        <h2>{{ $t('privacy.contactUs') }}</h2>
        <p>
          {{ $t('privacy.contactUsDescription') }}
        </p>
      </div>
    </UPageSection>
  </UPage>
</template>
