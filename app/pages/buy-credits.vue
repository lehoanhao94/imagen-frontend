<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

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
    <UContainer class="mt-6">
      <div>
        <BuyCreditsQuickTopup />
      </div>
    </UContainer>
  </UPage>
</template>
