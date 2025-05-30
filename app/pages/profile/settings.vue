<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const authStore = useAuthStore()
const { user, loading, error } = storeToRefs(authStore)
const { t } = useI18n()
const toast = useToast()
const passwordChangeSuccess = ref(false)
const profileUpdateSuccess = ref(false)

useSeoMeta({
  title: 'Profile Settings - Imagen',
  description: 'Manage your account settings and preferences',
  ogTitle: 'Profile Settings - Imagen',
  ogDescription: 'Manage your account settings and preferences'
})

// Profile info form
const profileFields = computed(() => [
  {
    name: 'full_name',
    label: t('profile.fullName'),
    placeholder: t('profile.enterFullName'),
    value: user.value?.full_name || '',
    required: true
  },
  {
    name: 'email',
    label: t('profile.email'),
    placeholder: t('profile.enterEmail'),
    value: user.value?.email || '',
    disabled: true,
    required: true
  }
])

const profileSchema = computed(() =>
  z.object({
    full_name: z
      .string({
        required_error: t('validation.required')
      })
      .min(1, t('validation.required'))
  })
)

type ProfileSchema = {
  full_name: string
}

async function onProfileSubmit(payload: FormSubmitEvent<ProfileSchema>) {
  try {
    const result = await authStore.updateProfile({
      full_name: payload.data.full_name
    })

    if (result) {
      profileUpdateSuccess.value = true
      toast.add({
        title: t('profile.profileUpdated') || 'Profile Updated',
        description: t('profile.profileUpdatedDescription') || 'Your profile has been updated successfully',
        color: 'success'
      })
    }
  } catch (error) {
    console.error('Profile update error:', error)
    toast.add({
      title: t('profile.profileUpdateError') || 'Profile Update Failed',
      description: error.message || t('profile.profileUpdateErrorDescription') || 'There was an error updating your profile',
      color: 'error'
    })
  }
}

// Password change form
const passwordFields = computed(() => [
  {
    name: 'current_password',
    type: 'password',
    label: t('profile.currentPassword'),
    placeholder: t('profile.enterCurrentPassword'),
    required: true
  },
  {
    name: 'new_password',
    type: 'password',
    label: t('profile.newPassword'),
    placeholder: t('profile.enterNewPassword'),
    required: true
  },
  {
    name: 'confirm_password',
    type: 'password',
    label: t('profile.confirmPassword'),
    placeholder: t('profile.enterConfirmPassword'),
    required: true
  }
])

const passwordSchema = computed(() =>
  z.object({
    current_password: z
      .string({
        required_error: t('validation.required')
      })
      .min(1, t('validation.required')),
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
  }).refine((data) => data.new_password === data.confirm_password, {
    message: t('validation.passwordsDoNotMatch'),
    path: ['confirm_password']
  })
)

type PasswordSchema = {
  current_password: string
  new_password: string
  confirm_password: string
}

async function onPasswordSubmit(payload: FormSubmitEvent<PasswordSchema>) {
  try {
    // Call API to change password
    const result = await authStore.changePassword({
      current_password: payload.data.current_password,
      new_password: payload.data.new_password
    })
    
    if (result) {
      passwordChangeSuccess.value = true
      toast.add({
        title: t('profile.passwordChanged') || 'Password Changed',
        description: t('profile.passwordChangedDescription') || 'Your password has been changed successfully',
        color: 'success'
      })
    }
  } catch (error) {
    console.error('Password change error:', error)
    toast.add({
      title: t('profile.passwordChangeError') || 'Password Change Failed',
      description: error.message || t('profile.passwordChangeErrorDescription') || 'There was an error changing your password',
      color: 'error'
    })
  }
}
</script>

<template>
  <UPage class="min-h-screen dark:bg-neutral-900/80">
    <ProfileHeader class="px-2" />
    
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-8">{{ $t('profile.settings') || 'Profile Settings' }}</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Profile Information -->
        <UCard class="p-6">
          <template #header>
            <div class="flex items-center space-x-4 mb-4">
              <UIcon name="i-lucide-user" class="text-primary" />
              <h2 class="text-xl font-semibold">
                {{ $t('profile.personalInformation') || 'Personal Information' }}
              </h2>
            </div>
          </template>

          <UForm
            :fields="profileFields"
            :schema="profileSchema"
            class="space-y-4"
            :state="profileUpdateSuccess ? 'success' : undefined"
            @submit="onProfileSubmit"
          >
            <template #success>
              <UAlert
                v-if="profileUpdateSuccess"
                color="success"
                variant="soft"
                icon="i-lucide-check-circle"
                :title="$t('profile.profileUpdated') || 'Profile Updated'"
                :description="$t('profile.profileUpdatedDescription') || 'Your profile has been updated successfully'"
              />
            </template>

            <template #default="{ values }">
              <div class="flex justify-end mt-4">
                <UButton
                  type="submit"
                  color="primary"
                  :loading="loading"
                >
                  {{ $t('profile.saveChanges') || 'Save Changes' }}
                </UButton>
              </div>
            </template>
          </UForm>
        </UCard>

        <!-- Password Change -->
        <UCard class="p-6">
          <template #header>
            <div class="flex items-center space-x-4 mb-4">
              <UIcon name="i-lucide-lock" class="text-primary" />
              <h2 class="text-xl font-semibold">
                {{ $t('profile.changePassword') || 'Change Password' }}
              </h2>
            </div>
          </template>

          <UForm
            :fields="passwordFields"
            :schema="passwordSchema"
            class="space-y-4"
            :state="passwordChangeSuccess ? 'success' : undefined"
            @submit="onPasswordSubmit"
          >
            <template #success>
              <UAlert
                v-if="passwordChangeSuccess"
                color="success"
                variant="soft"
                icon="i-lucide-check-circle"
                :title="$t('profile.passwordChanged') || 'Password Changed'"
                :description="$t('profile.passwordChangedDescription') || 'Your password has been updated successfully'"
              />
            </template>

            <template #error>
              <UAlert
                v-if="error"
                color="error"
                variant="soft"
                icon="i-lucide-alert-circle"
                :title="error"
              />
            </template>

            <template #default="{ values }">
              <div class="flex justify-end mt-4">
                <UButton
                  type="submit"
                  color="primary"
                  :loading="loading"
                >
                  {{ $t('profile.changePassword') || 'Change Password' }}
                </UButton>
              </div>
            </template>
          </UForm>
        </UCard>
      </div>
    </div>
  </UPage>
</template>