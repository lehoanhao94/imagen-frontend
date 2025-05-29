<script setup lang="ts">
const authStore = useAuthStore()
const { isNotVerifyAccount, canResendActivationEmailAfter, user }
  = storeToRefs(authStore)

const resendActivationEmailInterval = ref(null as any)

const resendActivationEmail = async () => {
  authStore.canResendActivationEmailAfter = 30
  resendActivationEmailInterval.value = setInterval(() => {
    authStore.canResendActivationEmailAfter--
    if (authStore.canResendActivationEmailAfter === 0) {
      clearInterval(resendActivationEmailInterval.value)
    }
  }, 1000)
  authStore.resendVerificationEmail()
}

onMounted(() => {
  if (authStore.canResendActivationEmailAfter > 0) {
    resendActivationEmailInterval.value = setInterval(() => {
      authStore.canResendActivationEmailAfter--
      if (authStore.canResendActivationEmailAfter === 0) {
        clearInterval(resendActivationEmailInterval.value)
      }
    }, 1000)
  }
})
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50">
    <UBanner
      v-if="isNotVerifyAccount"
      color="warning"
      :title="$t('auth.notVerifyAccount')"
      :actions="[
        {
          label:
            canResendActivationEmailAfter > 0
              ? `Resend in ${canResendActivationEmailAfter} seconds`
              : $t('auth.resendActivationEmail'),
          onClick: resendActivationEmail,
          disabled: canResendActivationEmailAfter > 0
        }
      ]"
      icon="i-lucide-info"
    />
  </div>
</template>
