<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useTokenClient } from 'vue3-google-signin'

definePageMeta({
  layout: 'auth'
})
const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)
const { t } = useI18n()

useSeoMeta({
  title: t('auth.login'),
  description: t('auth.loginDescription')
})

const { isReady, login } = useTokenClient({
  onSuccess: authStore.signInWithGoogle,
  onError: authStore.signInError
  // other options
})

const fields = computed(() => [
  {
    name: 'username',
    type: 'text' as const,
    label: t('auth.email'),
    placeholder: t('auth.enterEmail'),
    required: true
  },
  {
    name: 'password',
    label: t('auth.password'),
    type: 'password' as const,
    placeholder: t('auth.enterPassword')
  },
  {
    name: 'remember_me',
    label: t('auth.rememberMe'),
    type: 'checkbox' as const
  }
])

const providers = computed(() => {
  return [
    {
      label: t('auth.google'),
      icon: 'i-simple-icons-google',
      onClick: login,
      disabled: !isReady,
      loading: loading.value
    }
  ] as any[]
})

const schema = computed(() =>
  z.object({
    username: z
      .string({
        required_error: t('validation.required')
      })
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail')),
    password: z
      .string({
        required_error: t('validation.required')
      })
      .min(1, t('validation.required'))
      .min(8, t('validation.passwordMinLength'))
  })
)

type Schema = {
  username: string
  password: string
  remember_me?: boolean
}

function onSubmit(payload: FormSubmitEvent<Schema>) {
  authStore.login(payload.data)
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    :title="$t('auth.welcomeBack')"
    :loading="loading"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t("auth.dontHaveAccount") }}
      <ULink
        to="/auth/signup"
        class="text-primary font-medium"
      >{{
        $t("auth.signUp")
      }}</ULink>.
    </template>
    <template #validation>
      <UAlert
        v-if="error"
        variant="subtle"
        color="error"
        icon="i-lucide-info"
        :title="$t(error?.error_code || 'auth.loginFailed')"
      />
    </template>
    <template #password-hint>
      <ULink
        to="/auth/account-recovery"
        class="text-primary font-medium"
        tabindex="-1"
      >{{
        $t("auth.forgotPassword")
      }}</ULink>
    </template>

    <template #footer>
      {{ $t("auth.bySigningIn") }}
      <ULink
        to="/terms"
        class="text-primary font-medium"
      >{{
        $t("auth.termsOfService")
      }}</ULink>.
      <button
        :disabled="!isReady"
        @click="() => login()"
      >
        {{ $t("auth.loginWithGoogle") }}
      </button>
    </template>
  </UAuthForm>
</template>
