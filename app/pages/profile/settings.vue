<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const authStore = useAuthStore()
const { user, loading, error } = storeToRefs(authStore)
const { t } = useI18n()
const toast = useToast()
const passwordChangeSuccess = ref(false)
const profileUpdateSuccess = ref(false)

// Notification preferences
const emailNotifications = ref(true)
const marketingEmails = ref(false)
const securityAlerts = ref(true)

// Language preferences
const selectedLanguage = ref('en')
const languageOptions = [
  { name: 'English', value: 'en' },
  { name: 'Vietnamese', value: 'vi' },
  { name: 'Spanish', value: 'es' },
  { name: 'French', value: 'fr' },
  { name: 'German', value: 'de' },
  { name: 'Japanese', value: 'ja' },
  { name: 'Chinese', value: 'zh' }
]

// Account deletion
const confirmDeleteAccount = ref(false)
const deleteConfirmText = ref('')

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
  }).refine(data => data.new_password === data.confirm_password, {
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

// Notification preferences methods
function saveNotificationPreferences() {
  // This would typically make an API call to save notification preferences
  toast.add({
    title: t('profile.preferencesUpdated') || 'Preferences Updated',
    description: t('profile.notificationPreferencesUpdated') || 'Your notification preferences have been updated',
    color: 'success'
  })
}

// Language preferences methods
function saveLanguagePreferences() {
  // This would typically make an API call to save language preferences
  toast.add({
    title: t('profile.preferencesUpdated') || 'Preferences Updated',
    description: t('profile.languagePreferencesUpdated') || 'Your language preferences have been updated',
    color: 'success'
  })
}

// Account deletion methods
function deleteAccount() {
  if (deleteConfirmText.value === 'DELETE') {
    // This would make an API call to delete the user account
    toast.add({
      title: t('profile.accountDeleted') || 'Account Deleted',
      description: t('profile.accountDeletedDescription') || 'Your account has been deleted successfully',
      color: 'info'
    })

    // Close modal and redirect to home or login page
    confirmDeleteAccount.value = false

    // Log out user after account deletion
    setTimeout(() => {
      authStore.logout()
    }, 2000)
  }
}
</script>

<template>
  <UPage class="min-h-screen dark:bg-neutral-900/80">
    <ProfileHeader class="px-2" />

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-8">
        {{ $t('profile.settings') || 'Profile Settings' }}
      </h1>

      <div class="grid grid-cols-1 gap-8">
        <!-- Profile Information -->
        <UCard class="p-6">
          <template #header>
            <div class="flex items-center space-x-4 mb-4">
              <UIcon
                name="i-lucide-user"
                class="text-primary"
              />
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
              <UIcon
                name="i-lucide-lock"
                class="text-primary"
              />
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

        <!-- Notification Preferences -->
        <UCard class="p-6">
          <template #header>
            <div class="flex items-center space-x-4 mb-4">
              <UIcon
                name="i-lucide-bell"
                class="text-primary"
              />
              <h2 class="text-xl font-semibold">
                {{ $t('profile.notificationPreferences') || 'Notification Preferences' }}
              </h2>
            </div>
          </template>

          <div class="space-y-4">
            <UToggle
              v-model="emailNotifications"
              label="Email Notifications"
              color="primary"
            />
            <UToggle
              v-model="marketingEmails"
              label="Marketing Emails"
              color="primary"
            />
            <UToggle
              v-model="securityAlerts"
              label="Security Alerts"
              color="primary"
            />

            <div class="flex justify-end mt-4">
              <UButton
                color="primary"
                @click="saveNotificationPreferences"
              >
                {{ $t('profile.saveChanges') || 'Save Changes' }}
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Language Preferences -->
        <UCard class="p-6">
          <template #header>
            <div class="flex items-center space-x-4 mb-4">
              <UIcon
                name="i-lucide-globe"
                class="text-primary"
              />
              <h2 class="text-xl font-semibold">
                {{ $t('profile.languagePreferences') || 'Language Preferences' }}
              </h2>
            </div>
          </template>

          <div class="space-y-4">
            <USelect
              v-model="selectedLanguage"
              :options="languageOptions"
              option-attribute="name"
              :placeholder="$t('profile.selectLanguage') || 'Select Language'"
            />

            <div class="flex justify-end mt-4">
              <UButton
                color="primary"
                @click="saveLanguagePreferences"
              >
                {{ $t('profile.saveChanges') || 'Save Changes' }}
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Danger Zone -->
        <UCard class="p-6 border-red-300 dark:border-red-700">
          <template #header>
            <div class="flex items-center space-x-4 mb-4">
              <UIcon
                name="i-lucide-alert-triangle"
                class="text-error"
              />
              <h2 class="text-xl font-semibold text-error">
                {{ $t('profile.dangerZone') || 'Danger Zone' }}
              </h2>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t('profile.deleteAccountWarning') || 'Deleting your account is permanent and cannot be undone. All your data will be lost.' }}
            </p>

            <UButton
              color="error"
              variant="soft"
              @click="confirmDeleteAccount = true"
            >
              {{ $t('profile.deleteAccount') || 'Delete Account' }}
            </UButton>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <UModal v-model="confirmDeleteAccount">
      <UCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon
              name="i-lucide-alert-triangle"
              class="text-error"
            />
            <h3 class="text-lg font-semibold">
              {{ $t('profile.confirmDeleteAccount') || 'Confirm Account Deletion' }}
            </h3>
          </div>
        </template>

        <p class="mb-4">
          {{ $t('profile.deleteAccountConfirmation') || 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.' }}
        </p>

        <div class="mt-4">
          <UInput
            v-model="deleteConfirmText"
            :placeholder="$t('profile.typeConfirmation') || 'Type DELETE to confirm'"
            class="mb-4"
          />
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton
              color="gray"
              variant="soft"
              @click="confirmDeleteAccount = false"
            >
              {{ $t('profile.cancel') || 'Cancel' }}
            </UButton>

            <UButton
              color="error"
              :disabled="deleteConfirmText !== 'DELETE'"
              @click="deleteAccount"
            >
              {{ $t('profile.deleteAccountPermanently') || 'Delete Account Permanently' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UPage>
</template>
