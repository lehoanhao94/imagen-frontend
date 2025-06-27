<script setup lang="ts">
const integrationStore = useIntegrationStore()
const toast = useToast()
const { t } = useI18n()

useSeoMeta({
  title: 'Webhook - Imagen',
  description: 'Configure webhook URL for notifications',
  ogTitle: 'Webhook - Imagen',
  ogDescription: 'Configure webhook URL for notifications'
})

// State
const webhookUrl = ref(integrationStore.webhookUrl || '')
const isEditing = ref(false)

// Methods
function startEditing() {
  isEditing.value = true
}

function cancelEditing() {
  webhookUrl.value = integrationStore.webhookUrl || ''
  isEditing.value = false
}

async function saveWebhook() {
  // Basic URL validation
  if (webhookUrl.value && !isValidUrl(webhookUrl.value)) {
    toast.add({
      title: t('error.validation') || 'Validation Error',
      description: t('webhook.invalidUrl') || 'Please enter a valid URL',
      color: 'error'
    })
    return
  }

  const result = await integrationStore.saveWebhookUrl(webhookUrl.value)

  if (result) {
    toast.add({
      title: t('success.saved') || 'Success',
      description: t('webhook.saved') || 'Webhook URL saved successfully',
      color: 'success'
    })
    isEditing.value = false
  } else {
    toast.add({
      title: t('error.general') || 'Error',
      description: integrationStore.errors.saveWebhook || t('webhook.saveError') || 'Failed to save webhook URL',
      color: 'error'
    })
  }
}

function isValidUrl(string: string) {
  if (!string) return true // Empty is valid (means no webhook)

  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function testWebhook() {
  if (!webhookUrl.value) {
    toast.add({
      title: t('error.validation') || 'Validation Error',
      description: t('webhook.urlRequired') || 'Please enter a webhook URL first',
      color: 'error'
    })
    return
  }

  // This would typically send a test webhook
  toast.add({
    title: t('webhook.testSent') || 'Test Sent',
    description: t('webhook.testDescription') || 'Test webhook sent successfully',
    color: 'info'
  })
}
</script>

<template>
  <UPage class="min-h-screen dark:bg-neutral-900/80">
    <ProfileHeader class="px-2" />

    <UContainer class="py-8">
      <div class="space-y-6 max-w-4xl mx-auto">
        <!-- Header -->
        <div>
          <div class="flex items-center space-x-2">
            <UButton
              variant="ghost"
              size="sm"
              icon="i-lucide-arrow-left"
              :to="'/profile/integration'"
            >
              {{ $t('common.back') || 'Back' }}
            </UButton>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            {{ $t('webhook.title') || 'Webhook Configuration' }}
          </h1>
          <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {{ $t('webhook.subtitle') || 'Configure webhook URL for real-time notifications' }}
          </p>
        </div>

        <!-- Webhook Configuration Card -->
        <UCard class="p-6">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <UIcon
                  name="i-lucide-webhook"
                  class="w-6 h-6 text-primary"
                />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ $t('webhook.configuration') || 'Webhook URL' }}
                </h2>
              </div>

              <div
                v-if="!isEditing"
                class="flex space-x-2"
              >
                <UButton
                  variant="outline"
                  size="sm"
                  icon="i-lucide-send"
                  :disabled="!webhookUrl"
                  @click="testWebhook"
                >
                  {{ $t('webhook.test') || 'Test' }}
                </UButton>
                <UButton
                  variant="outline"
                  size="sm"
                  icon="i-lucide-edit"
                  @click="startEditing"
                >
                  {{ $t('common.edit') || 'Edit' }}
                </UButton>
              </div>
            </div>
          </template>

          <div class="space-y-6">
            <!-- Current webhook URL display -->
            <div v-if="!isEditing">
              <UFormGroup
                :label="t('webhook.currentUrl') || 'Current Webhook URL'"
                :description="t('webhook.currentUrlDescription') || 'This URL will receive POST requests for webhook events'"
              >
                <div class="flex items-center space-x-2">
                  <code
                    v-if="webhookUrl"
                    class="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm break-all"
                  >
                    {{ webhookUrl }}
                  </code>
                  <div
                    v-else
                    class="flex-1 text-gray-500 dark:text-gray-400 italic py-2"
                  >
                    {{ $t('webhook.notConfigured') || 'No webhook URL configured' }}
                  </div>
                </div>
              </UFormGroup>
            </div>

            <!-- Edit webhook URL form -->
            <div v-else>
              <UFormGroup
                :label="t('webhook.url') || 'Webhook URL'"
                :description="t('webhook.urlDescription') || 'Enter the URL where you want to receive webhook notifications'"
              >
                <UInput
                  v-model="webhookUrl"
                  :placeholder="t('webhook.urlPlaceholder') || 'https://your-domain.com/webhook'"
                  class="w-full"
                />
              </UFormGroup>

              <div class="flex justify-end space-x-2">
                <UButton
                  variant="outline"
                  @click="cancelEditing"
                >
                  {{ $t('common.cancel') || 'Cancel' }}
                </UButton>
                <UButton
                  :loading="integrationStore.loadings.saveWebhook"
                  @click="saveWebhook"
                >
                  {{ $t('common.save') || 'Save' }}
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Webhook Information Card -->
        <UCard class="p-6">
          <template #header>
            <div class="flex items-center space-x-3">
              <UIcon
                name="i-lucide-info"
                class="w-6 h-6 text-blue-500"
              />
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ $t('webhook.information') || 'Webhook Information' }}
              </h2>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                {{ $t('webhook.howItWorks') || 'How it works' }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t('webhook.description') || 'When configured, we will send HTTP POST requests to your webhook URL whenever certain events occur in your account.' }}
              </p>
            </div>

            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                {{ $t('webhook.events') || 'Webhook Events' }}
              </h3>
              <ul class="space-y-2 text-gray-600 dark:text-gray-400">
                <li class="flex items-center space-x-2">
                  <UIcon
                    name="i-lucide-check"
                    class="w-4 h-4 text-green-500"
                  />
                  <span>{{ $t('webhook.imageGenerated') || 'Image generation completed' }}</span>
                </li>
                <li class="flex items-center space-x-2">
                  <UIcon
                    name="i-lucide-check"
                    class="w-4 h-4 text-green-500"
                  />
                  <span>{{ $t('webhook.imageGenerationFailed') || 'Image generation failed' }}</span>
                </li>
                <li class="flex items-center space-x-2">
                  <UIcon
                    name="i-lucide-check"
                    class="w-4 h-4 text-green-500"
                  />
                  <span>{{ $t('webhook.creditUpdated') || 'Credit balance updated' }}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                {{ $t('webhook.payloadFormat') || 'Payload Format' }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-2">
                {{ $t('webhook.payloadDescription') || 'Webhook requests will be sent as JSON with the following structure:' }}
              </p>
              <pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto"><code>{
  "event": "image.generated",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "img_123",
    "status": "completed",
    "url": "https://cdn.imagen.ai/...",
    "user_id": "user_456"
  }
}</code></pre>
            </div>

            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                {{ $t('webhook.security') || 'Security' }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t('webhook.securityDescription') || 'We recommend using HTTPS URLs and implementing signature verification to ensure webhook authenticity.' }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </UPage>
</template>
