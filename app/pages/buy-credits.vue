<script setup lang="ts">
const authStore = useAuthStore()
const { user_credit } = storeToRefs(authStore)
</script>

<template>
  <UPage>
    <UContainer class="mt-20">
      <UPageHeader
        :title="formatNumber(user_credit?.available_credit || 0)"
        :description="$t('Your credits will never expire.')"
        :headline="$t('Available credits')"
      />
    </UContainer>
    <UPageSection>
      <div class="prose dark:prose-invert max-w-none">
        <BuyCreditsQuickTopup />
      </div>
    </UPageSection>
  </UPage>
</template>
