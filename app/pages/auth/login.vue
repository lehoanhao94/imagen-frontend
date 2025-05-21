<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const { t } = useI18n()

useSeoMeta({
  title: t('auth.login'),
  description: t('auth.loginDescription')
})

const toast = useToast()

const fields = computed(() => [{
  name: 'email',
  type: 'text' as const,
  label: t('auth.email'),
  placeholder: t('auth.enterEmail'),
  required: true
}, {
  name: 'password',
  label: t('auth.password'),
  type: 'password' as const,
  placeholder: t('auth.enterPassword')
}, {
  name: 'remember',
  label: t('auth.rememberMe'),
  type: 'checkbox' as const
}])

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    toast.add({ title: 'Google', description: 'Login with Google' })
  }
}, {
  label: 'Apple',
  icon: 'i-simple-icons-apple',
  onClick: () => {
    toast.add({ title: 'Apple', description: 'Login with Apple' })
  }
}]

const schema = z.object({
  email: z.string().email(t('validation.invalidEmail')),
  password: z.string().min(8, t('validation.passwordMinLength'))
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Submitted', payload)
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="schema"
    :providers="providers"
    :title="$t('auth.welcomeBack')"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('auth.dontHaveAccount') }} <ULink
        to="/auth/signup"
        class="text-primary font-medium"
      >{{ $t('auth.signUp') }}</ULink>.
    </template>

    <template #password-hint>
      <ULink
        to="/"
        class="text-primary font-medium"
        tabindex="-1"
      >{{ $t('auth.forgotPassword') }}</ULink>
    </template>

    <template #footer>
      {{ $t('auth.bySigningIn') }} <ULink
        to="/"
        class="text-primary font-medium"
      >{{ $t('auth.termsOfService') }}</ULink>.
    </template>
  </UAuthForm>
</template>
