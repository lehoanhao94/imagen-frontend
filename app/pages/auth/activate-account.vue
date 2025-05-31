<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)
const { t } = useI18n()
const route = useRoute()

useSeoMeta({
  title: t('auth.activateAccountTitle'),
  description: t('auth.activateAccountDescription')
})

const activationStatus = ref<'loading' | 'success' | 'error'>('loading')
const token = computed(() => route.query.token as string)

// Redirect if no token
if (!token.value) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid activation token'
  })
}

// Auto-activate account on mount
onMounted(async () => {
  try {
    const result = await authStore.activateAccount({ token: token.value })
    if (result) {
      activationStatus.value = 'success'
    } else {
      activationStatus.value = 'error'
    }
  } catch (err) {
    activationStatus.value = 'error'
  }
})
</script>

<template>
  <div class="text-center space-y-4">
    <!-- Loading State -->
    <div
      v-if="activationStatus === 'loading'"
      class="space-y-4"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="w-16 h-16 mx-auto text-primary animate-spin"
      />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('auth.activateAccountTitle') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('auth.activateAccountDescription') }}
      </p>
    </div>

    <!-- Success State -->
    <div
      v-else-if="activationStatus === 'success'"
      class="space-y-4"
    >
      <UIcon
        name="i-lucide-check-circle"
        class="w-16 h-16 mx-auto text-green-500"
      />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('auth.accountActivated') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('auth.accountActivatedDescription') }}
      </p>
      <UButton
        to="/auth/login"
        class="mt-4"
      >
        {{ $t('auth.login') }}
      </UButton>
    </div>

    <!-- Error State -->
    <div
      v-else
      class="space-y-4"
    >
      <UIcon
        name="i-lucide-x-circle"
        class="w-16 h-16 mx-auto text-red-500"
      />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('auth.activationFailed') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('auth.activationFailedDescription') }}
      </p>
      <div class="flex gap-2 justify-center">
        <UButton
          to="/auth/login"
          variant="outline"
        >
          {{ $t('auth.backToLogin') }}
        </UButton>
        <UButton
          variant="outline"
          @click="$router.go(0)"
        >
          {{ $t('Try again') }}
        </UButton>
      </div>
    </div>

    <!-- Error Alert -->
    <UAlert
      v-if="error && activationStatus === 'error'"
      variant="subtle"
      color="error"
      icon="i-lucide-info"
      :title="error"
      class="mt-4"
    />
  </div>
</template>
