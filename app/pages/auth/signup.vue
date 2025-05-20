<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const { t } = useI18n()

useSeoMeta({
  title: t('auth.signUpTitle'),
  description: t('auth.signUpDescription')
})

const toast = useToast()

const fields = computed(() => [{
  name: 'name',
  type: 'text' as const,
  label: t('auth.name'),
  placeholder: t('auth.enterName')
}, {
  name: 'email',
  type: 'text' as const,
  label: t('auth.email'),
  placeholder: t('auth.enterEmail')
}, {
  name: 'password',
  label: t('auth.password'),
  type: 'password' as const,
  placeholder: t('auth.enterPassword')
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
  name: z.string().min(1, t('validation.nameRequired')),
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
    :title="$t('auth.createAccount')"
    :submit="{ label: $t('auth.createAccount') }"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('auth.alreadyHaveAccount') }} <ULink
        to="/auth/login"
        class="text-primary font-medium"
      >{{ $t('auth.login') }}</ULink>.
    </template>

    <template #footer>
      {{ $t('auth.bySigningUp') }} <ULink
        to="/"
        class="text-primary font-medium"
      >{{ $t('auth.termsOfService') }}</ULink>.
    </template>
  </UAuthForm>
</template>
