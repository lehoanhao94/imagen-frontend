<script setup lang="ts">
const integrationStore = useIntegrationStore()
const toast = useToast()
const { t } = useI18n()

useSeoMeta({
  title: 'API Keys - Imagen',
  description: 'Manage your API keys for programmatic access',
  ogTitle: 'API Keys - Imagen',
  ogDescription: 'Manage your API keys for programmatic access'
})

// State
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const selectedApiKey = ref<any>(null)
const newApiKeyName = ref('')
const copiedKeyId = ref<string | null>(null)

// Load API keys on mount
onMounted(() => {
  integrationStore.fetchApiKeys()
})

// Methods
function createApiKey() {
  if (!newApiKeyName.value.trim()) {
    toast.add({
      title: t('error.required') || 'Error',
      description: t('apiKeys.nameRequired') || 'API key name is required',
      color: 'error'
    })
    return
  }

  integrationStore.createApiKey({ name: newApiKeyName.value.trim() }).then((result) => {
    if (result) {
      toast.add({
        title: t('success.created') || 'Success',
        description: t('apiKeys.created') || 'API key created successfully',
        color: 'success'
      })
      showCreateModal.value = false
      newApiKeyName.value = ''
    } else {
      toast.add({
        title: t('error.general') || 'Error',
        description: integrationStore.errors.createApiKey || t('apiKeys.createError') || 'Failed to create API key',
        color: 'error'
      })
    }
  })
}

function confirmDeleteApiKey(apiKey: any) {
  selectedApiKey.value = apiKey
  showDeleteModal.value = true
}

function deleteApiKey() {
  if (!selectedApiKey.value) return

  integrationStore.deleteApiKey({ id: selectedApiKey.value.id }).then((result) => {
    if (result !== null) {
      toast.add({
        title: t('success.deleted') || 'Success',
        description: t('apiKeys.deleted') || 'API key deleted successfully',
        color: 'success'
      })
      showDeleteModal.value = false
      selectedApiKey.value = null
    } else {
      toast.add({
        title: t('error.general') || 'Error',
        description: integrationStore.errors.deleteApiKey || t('apiKeys.deleteError') || 'Failed to delete API key',
        color: 'error'
      })
    }
  })
}

async function copyApiKey(apiKey: any) {
  try {
    await navigator.clipboard.writeText(apiKey.api_key)
    copiedKeyId.value = apiKey.id
    toast.add({
      title: t('success.copied') || 'Copied',
      description: t('apiKeys.copied') || 'API key copied to clipboard',
      color: 'success'
    })

    // Clear the copied state after 2 seconds
    setTimeout(() => {
      copiedKeyId.value = null
    }, 2000)
  } catch {
    toast.add({
      title: t('error.general') || 'Error',
      description: t('apiKeys.copyError') || 'Failed to copy API key',
      color: 'error'
    })
  }
}

function maskApiKey(apiKey: string) {
  if (apiKey.length <= 8) return apiKey
  return apiKey.substring(0, 4) + '••••••••' + apiKey.substring(apiKey.length - 4)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <UPage class="min-h-screen dark:bg-neutral-900/80">
    <ProfileHeader class="px-2" />

    <UContainer class="py-8">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
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
              {{ $t('apiKeys.title') || 'API Keys' }}
            </h1>
            <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {{ $t('apiKeys.subtitle') || 'Manage your API keys for programmatic access' }}
            </p>
          </div>

          <UButton
            icon="i-lucide-plus"
            @click="showCreateModal = true"
          >
            {{ $t('apiKeys.create') || 'Create API Key' }}
          </UButton>
        </div>

        <!-- Loading state -->
        <div
          v-if="integrationStore.loadings.fetchApiKeys"
          class="flex justify-center py-12"
        >
          <UIcon
            name="i-lucide-loader-2"
            class="w-8 h-8 animate-spin"
          />
        </div>

        <!-- Error state -->
        <UAlert
          v-else-if="integrationStore.errors.fetchApiKeys"
          icon="i-lucide-alert-circle"
          color="error"
          variant="subtle"
          :title="t('error.general') || 'Error'"
          :description="integrationStore.errors.fetchApiKeys"
        />

        <!-- Empty state -->
        <UCard
          v-else-if="!integrationStore.hasApiKeys"
          class="text-center py-12"
        >
          <UIcon
            name="i-lucide-key"
            class="w-16 h-16 mx-auto text-gray-400 mb-4"
          />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('apiKeys.noKeys') || 'No API Keys' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ $t('apiKeys.noKeysDescription') || 'Create your first API key to get started with programmatic access' }}
          </p>
          <UButton
            icon="i-lucide-plus"
            @click="showCreateModal = true"
          >
            {{ $t('apiKeys.createFirst') || 'Create First API Key' }}
          </UButton>
        </UCard>

        <!-- API Keys list -->
        <div
          v-else
          class="space-y-4"
        >
          <UCard
            v-for="apiKey in integrationStore.apiKeys"
            :key="apiKey.id"
            class="p-6"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <UIcon
                    name="i-lucide-key"
                    class="w-5 h-5 text-primary"
                  />
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ apiKey.name }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ $t('apiKeys.createdAt') || 'Created' }}: {{ formatDate(apiKey.created_at) }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 flex items-center space-x-2">
                  <code class="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded font-mono text-sm">
                    {{ maskApiKey(apiKey.api_key) }}
                  </code>
                  <UButton
                    variant="outline"
                    size="sm"
                    :icon="copiedKeyId === apiKey.id ? 'i-lucide-check' : 'i-lucide-copy'"
                    @click="copyApiKey(apiKey)"
                  >
                    {{ copiedKeyId === apiKey.id ? (t('common.copied') || 'Copied') : (t('common.copy') || 'Copy') }}
                  </UButton>
                </div>
              </div>

              <div class="ml-4">
                <UButton
                  variant="outline"
                  color="error"
                  size="sm"
                  icon="i-lucide-trash-2"
                  @click="confirmDeleteApiKey(apiKey)"
                >
                  {{ $t('common.delete') || 'Delete' }}
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>

    <!-- Create API Key Modal -->
    <UModal v-model="showCreateModal">
      <UCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon
              name="i-lucide-plus"
              class="w-5 h-5"
            />
            <h2 class="text-xl font-semibold">
              {{ $t('apiKeys.createNew') || 'Create New API Key' }}
            </h2>
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup
            :label="t('apiKeys.name') || 'Name'"
            :description="t('apiKeys.nameDescription') || 'Give your API key a descriptive name'"
          >
            <UInput
              v-model="newApiKeyName"
              :placeholder="t('apiKeys.namePlaceholder') || 'e.g., My App API Key'"
              class="w-full"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-between w-full">
            <UButton
              variant="outline"
              @click="showCreateModal = false"
            >
              {{ $t('common.cancel') || 'Cancel' }}
            </UButton>

            <UButton
              :loading="integrationStore.loadings.createApiKey"
              @click="createApiKey"
            >
              {{ $t('apiKeys.create') || 'Create API Key' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Delete API Key Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon
              name="i-lucide-alert-triangle"
              class="w-5 h-5 text-error"
            />
            <h2 class="text-xl font-semibold">
              {{ $t('apiKeys.deleteConfirm') || 'Delete API Key' }}
            </h2>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400">
            {{ $t('apiKeys.deleteWarning') || 'Are you sure you want to delete this API key? This action cannot be undone.' }}
          </p>

          <div
            v-if="selectedApiKey"
            class="bg-gray-100 dark:bg-gray-800 p-3 rounded"
          >
            <p class="font-medium">
              {{ selectedApiKey.name }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ maskApiKey(selectedApiKey.api_key) }}
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between w-full">
            <UButton
              variant="outline"
              @click="showDeleteModal = false"
            >
              {{ $t('common.cancel') || 'Cancel' }}
            </UButton>

            <UButton
              color="error"
              :loading="integrationStore.loadings.deleteApiKey"
              @click="deleteApiKey"
            >
              {{ $t('common.delete') || 'Delete' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UPage>
</template>
