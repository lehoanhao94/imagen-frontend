<script setup lang="ts">
import { en, vi, ja, zh_cn } from '@nuxt/ui/locale'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const appStore = useAppStore()
const { locale, localeForI18n } = storeToRefs(appStore)

const { footer } = useAppConfig()

const { locale: i18nLocale, setLocale } = useI18n()
watch(i18nLocale, (newLocale: string) => {
  // zh-CN -> zh_cn
  locale.value = newLocale
  setLocale(localeForI18n.value)
})
</script>

<template>
  <UFooter
    class="z-10 bg-default"
    :ui="{ left: 'text-xs' }"
  >
    <template #left>
      <div class="flex gap-2 items-center">
        <div>
          {{ $t('copyright', { year: new Date().getFullYear() }) }}
        </div>
      </div>
    </template>

    <template #right>
      <div class="flex gap-2 items-center">
        <ULocaleSelect
          v-model="i18nLocale"
          :locales="[en, ja, vi, zh_cn]"
          variant="ghost"
          size="xs"
          :ui="{
            content: 'w-40'
          }"
        />
        <USeparator
          orientation="vertical"
          class="h-4"
        />
        <UColorModeSelect
          size="xs"
          variant="ghost"
        />
        <USeparator
          orientation="vertical"
          class="h-4"
        />
      </div>
      <template v-if="footer?.links">
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
