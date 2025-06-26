<script setup lang="ts">
useSeoMeta({
  title: 'Integration - Imagen',
  description: 'Manage your API keys and integrations',
  ogTitle: 'Integration - Imagen',
  ogDescription: 'Manage your API keys and integrations'
})

const { t } = useI18n()

const items = [
  {
    label: t('integration.apiKeys') || 'API Keys',
    description: t('integration.apiKeysDescription') || 'Manage your API keys for programmatic access',
    icon: 'i-lucide-key',
    to: '/profile/integration/api-keys'
  },
  {
    label: t('integration.webhook') || 'Webhook',
    description: t('integration.webhookDescription') || 'Configure webhook URL for notifications',
    icon: 'i-lucide-webhook',
    to: '/profile/integration/webhook'
  }
]
</script>

<template>
  <UPage class="min-h-screen dark:bg-neutral-900/80">
    <ProfileHeader class="px-2" />

    <UContainer class="py-8">
      <div class="space-y-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ $t('integration.title') || 'Integration' }}
          </h1>
          <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {{ $t('integration.subtitle') || 'Manage your API keys and integration settings' }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <UCard
            v-for="item in items"
            :key="item.to"
            class="hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateTo(item.to)"
          >
            <template #header>
              <div class="flex items-center space-x-4">
                <UIcon
                  :name="item.icon"
                  class="w-8 h-8 text-primary"
                />
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ item.label }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </template>

            <div class="flex justify-end pt-4">
              <UButton
                :to="item.to"
                variant="outline"
                size="sm"
              >
                {{ $t('common.manage') || 'Manage' }}
                <UIcon
                  name="i-lucide-arrow-right"
                  class="ml-2 w-4 h-4"
                />
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </UPage>
</template>
