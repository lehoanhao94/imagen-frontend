<script setup lang="ts">
import { en, vi, ja, zh_cn, es, fr, de, pt } from '@nuxt/ui/locale'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const appStore = useAppStore()
const { locale, localeForI18n } = storeToRefs(appStore)

const { footer } = useAppConfig()

const { locale: i18nLocale, setLocale, t } = useI18n()
watch(i18nLocale, (newLocale: string) => {
  // zh-CN -> zh_cn
  locale.value = newLocale
  setLocale(localeForI18n.value)
})

// Compute translated footer links
const translatedFooterLinks = computed(() => {
  if (!footer?.links) return []

  return footer.links.map((link) => {
    const translatedLink = { ...link }

    // Translate labels based on the key
    if (link.label === 'Privacy') {
      translatedLink.label = t('footer.privacy')
      translatedLink['aria-label'] = t('footer.privacyPolicy')
    } else if (link.label === 'Terms') {
      translatedLink.label = t('footer.terms')
      translatedLink['aria-label'] = t('footer.termsOfService')
    } else if (link['aria-label']) {
      // Translate aria-labels for icon-only links
      if (link['aria-label'] === 'Text To Speech OpenAI') {
        translatedLink['aria-label'] = t('footer.textToSpeechOpenAI')
      } else if (link['aria-label'] === 'DoctransGPT') {
        translatedLink['aria-label'] = t('footer.doctransGPT')
      } else if (link['aria-label'] === 'Nuxt UI on Discord') {
        translatedLink['aria-label'] = t('footer.nuxtUIOnDiscord')
      } else if (link['aria-label'] === 'Youtube') {
        translatedLink['aria-label'] = t('footer.youtube')
      }
    }

    return translatedLink
  })
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
          {{ $t("copyright", { year: new Date().getFullYear() }) }}
        </div>
      </div>
    </template>

    <template #right>
      <div class="flex gap-2 items-center flex-col sm:flex-row">
        <div class="flex gap-2 items-center">
          <ULocaleSelect
            v-model="i18nLocale"
            :locales="[en, ja, vi, zh_cn, es, fr, de, pt]"
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
          <ClientOnly>
            <UColorModeSelect
              size="xs"
              variant="ghost"
            />
            <template #fallback>
              <div class="w-8 h-6" />
            </template>
          </ClientOnly>
          <USeparator
            orientation="vertical"
            class="h-4"
          />
        </div>
        <div class="flex gap-1 items-center">
          <template v-if="translatedFooterLinks.length">
            <UButton
              v-for="(link, index) of translatedFooterLinks"
              :key="index"
              v-bind="{
                size: 'xs',
                color: 'neutral',
                variant: 'ghost',
                ...link
              }"
            />
          </template>
        </div>
      </div>
    </template>
  </UFooter>
</template>
