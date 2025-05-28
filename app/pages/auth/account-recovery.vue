<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)
const { t } = useI18n()

useSeoMeta({
  title: t('auth.accountRecoveryTitle'),
  description: t('auth.accountRecoveryDescription')
})

const emailSent = ref(false)

const fields = computed(() => [
  {
    name: 'email',
    type: 'email',
    label: t('auth.email'),
    placeholder: t('auth.enterEmail'),
    required: true
  }
])

const schema = computed(() =>
  z.object({
    email: z
      .string({
        required_error: t('validation.required')
      })
      .min(1, t('validation.required'))
      .email(t('validation.invalidEmail'))
  })
)

type Schema = {
  email: string
}

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const result = await authStore.passwordRecovery(payload.data)
  if (result) {
    emailSent.value = true
  }
}
</script>

<template>
  <div v-if="!emailSent">
    <UAuthForm
      :fields="fields"
      :schema="schema"
      :title="$t('auth.accountRecoveryTitle')"
      :submit="{ label: $t('auth.sendRecoveryEmail') }"
      :loading="loading"
      @submit="onSubmit"
    >
      <template #description>
        {{ $t('auth.accountRecoveryDescription') }}
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

  <div v-else class="text-center space-y-4">
    <UIcon
      name="i-lucide-mail-check"
      class="w-16 h-16 mx-auto text-green-500"
    />
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
      {{ $t('auth.recoveryEmailSent') }}
    </h2>
    <p class="text-gray-600 dark:text-gray-400">
      {{ $t('auth.recoveryEmailSentDescription') }}
    </p>
    <UButton
      to="/auth/login"
      variant="outline"
      class="mt-4"
    >
      {{ $t('auth.backToLogin') }}
    </UButton>
  </div>
</template>
