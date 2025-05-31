<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)
const { t } = useI18n()
const route = useRoute()

useSeoMeta({
  title: t('auth.resetPasswordTitle'),
  description: t('auth.resetPasswordDescription')
})

const resetSuccess = ref(false)
const token = computed(() => route.query.token as string)

// Redirect if no token
if (!token.value) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Invalid reset token'
  })
}

const fields = computed(() => [
  {
    name: 'new_password',
    type: 'password',
    label: t('auth.newPassword'),
    placeholder: t('auth.enterNewPassword'),
    required: true
  },
  {
    name: 'confirm_password',
    type: 'password',
    label: t('auth.confirmPassword'),
    placeholder: t('auth.enterConfirmPassword'),
    required: true
  }
])

const schema = computed(() =>
  z.object({
    new_password: z
      .string({
        required_error: t('validation.required')
      })
      .min(1, t('validation.required'))
      .min(8, t('validation.passwordMinLength')),
    confirm_password: z
      .string({
        required_error: t('validation.required')
      })
      .min(1, t('validation.required'))
  }).refine(data => data.new_password === data.confirm_password, {
    message: t('validation.passwordsDoNotMatch'),
    path: ['confirm_password']
  })
)

type Schema = {
  new_password: string
  confirm_password: string
}

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const result = await authStore.passwordReset({
    token: token.value,
    new_password: payload.data.new_password
  })

  if (result) {
    resetSuccess.value = true
  }
}
</script>

<template>
  <div v-if="!resetSuccess">
    <UAuthForm
      :fields="fields"
      :schema="schema"
      :title="$t('auth.resetPasswordTitle')"
      :submit="{ label: $t('auth.resetPassword') }"
      :loading="loading"
      @submit="onSubmit"
    >
      <template #description>
        {{ $t('auth.resetPasswordDescription') }}
      </template>

      <template #validation>
        <UAlert
          v-if="error"
          variant="subtle"
          color="error"
          icon="i-lucide-info"
          :title="error"
        />
      </template>

      <template #footer>
        <ULink
          to="/auth/login"
          class="text-primary font-medium"
        >
          {{ $t('auth.backToLogin') }}
        </ULink>
      </template>
    </UAuthForm>
  </div>

  <div
    v-else
    class="text-center space-y-4"
  >
    <UIcon
      name="i-lucide-check-circle"
      class="w-16 h-16 mx-auto text-green-500"
    />
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
      {{ $t('auth.passwordResetSuccess') }}
    </h2>
    <p class="text-gray-600 dark:text-gray-400">
      {{ $t('auth.passwordResetSuccessDescription') }}
    </p>
    <UButton
      to="/auth/login"
      class="mt-4"
    >
      {{ $t('auth.backToLogin') }}
    </UButton>
  </div>
</template>
