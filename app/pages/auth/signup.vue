<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

definePageMeta({
  layout: 'auth'
})

const { t } = useI18n()

useSeoMeta({
  title: t('auth.signUpTitle'),
  description: t('auth.signUpDescription')
})

const { isReady, login } = useTokenClient({
  onSuccess: authStore.signInWithGoogle,
  onError: authStore.signInError
  // other options
})
const toast = useToast()

const fields = computed(() => [
  {
    name: 'name',
    type: 'text' as const,
    label: t('auth.name'),
    placeholder: t('auth.enterName'),
    value: ''
  },
  {
    name: 'email',
    type: 'text' as const,
    label: t('auth.email'),
    placeholder: t('auth.enterEmail')
  },
  {
    name: 'password',
    label: t('auth.password'),
    type: 'password' as const,
    placeholder: t('auth.enterPassword')
  }
])

const providers = computed(() => {
  return [
    {
      label: 'Google',
      icon: 'i-simple-icons-google',
      onClick: login,
      disabled: !isReady,
      loading: loading.value
    }
  ]
})

const schema = computed(() =>
  z.object({
    name: z
      .string({
        required_error: t('validation.required')
      })
      .min(1, t('validation.required')),
    email: z
      .string({
        required_error: t('validation.required')
      })
      .nonempty(t('validation.required'))
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail')),
    password: z
      .string({
        required_error: t('validation.required')
      })
      .nonempty(t('validation.required'))
      .min(1, t('validation.required'))
      .min(8, t('validation.passwordMinLength'))
  })
)

type Schema = {
  name: string
  email: string
  password: string
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { name, email, password } = event.data

  try {
    const result = await authStore.signup({
      email,
      full_name: name,
      password
    })

    if (!result) {
      // If signup failed, show the error message from the auth store
      toast.add({
        title: t('auth.signupFailed') || 'Signup failed',
        description:
          authStore.error
          || t('auth.signupFailedDescription')
          || 'There was an error during signup. Please try again.',
        color: 'error'
      })
    }
  } catch (error) {
    console.error('Signup error:', error)
    toast.add({
      title: t('auth.signupFailed') || 'Signup failed',
      description:
        t('auth.signupFailedDescription')
        || 'There was an error during signup. Please try again.',
      color: 'error'
    })
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    :title="$t('auth.createAccount')"
    :submit="{ label: $t('auth.createAccount') }"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t("auth.alreadyHaveAccount") }}
      <ULink
        to="/auth/login"
        class="text-primary font-medium"
      >{{
        $t("auth.login")
      }}</ULink>.
    </template>

    <template #footer>
      {{ $t("auth.bySigningUp") }}
      <ULink
        to="/terms"
        class="text-primary font-medium"
      >{{
        $t("auth.termsOfService")
      }}</ULink>.
    </template>
  </UAuthForm>
</template>
