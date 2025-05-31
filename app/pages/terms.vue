<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: `${t('terms.title')} - Imagen`,
  description: t('terms.description'),
  ogTitle: `${t('terms.title')} - Imagen`,
  ogDescription: t('terms.description')
})
</script>

<template>
  <UPage>
    <div class="mt-30 w-20 h-20 mx-auto animate__animated animate__zoomInDown">
      <BaseLogo
        id="main-logo"
        :loading="false"
        :class="{ 'logo-loading animate__pulse': false }"
        class="animate__animated animate__infinite"
      />
    </div>
    <UPageHero
      :title="$t('terms.title')"
      :description="$t('terms.description')"
    />
    <UPageSection>
      <div class="prose dark:prose-invert max-w-none">
        <h2>{{ $t('terms.acceptanceOfTerms') }}</h2>
        <p>
          {{ $t('terms.acceptanceOfTermsDescription') }}
        </p>

        <h2>{{ $t('terms.useOfService') }}</h2>
        <p>
          {{ $t('terms.useOfServiceDescription') }}
        </p>

        <h2>{{ $t('terms.userAccounts') }}</h2>
        <p>
          {{ $t('terms.userAccountsDescription') }}
        </p>

        <h2>{{ $t('terms.intellectualProperty') }}</h2>
        <p>
          {{ $t('terms.intellectualPropertyDescription') }}
        </p>

        <h2>{{ $t('terms.termination') }}</h2>
        <p>
          {{ $t('terms.terminationDescription') }}
        </p>

        <h2>{{ $t('terms.disclaimers') }}</h2>
        <p>
          {{ $t('terms.disclaimersDescription') }}
        </p>

        <h2>{{ $t('terms.contactUsTerms') }}</h2>
        <p>
          {{ $t('terms.contactUsTermsDescription') }}
        </p>
      </div>
    </UPageSection>
  </UPage>
</template>
