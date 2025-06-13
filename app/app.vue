<script setup lang="ts">
import * as locales from '@nuxt/ui-pro/locale'
import { useNavLinks } from '~/utils/links'
import { useProductStore } from '~/stores/product'

const authStore = useAuthStore()
const appStore = useAppStore()
const productStore = useProductStore()
const { locale, localeForI18n } = storeToRefs(appStore)
const { locale: i18nLocale } = useI18n()

// Use the new i18n-aware nav links composable
const translatedNavLinks = useNavLinks()

const colorMode = useColorMode()

const color = computed(() =>
  colorMode.value === 'dark' ? '#020618' : '#f5f5f7'
)

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
    }
  ],
  htmlAttrs: {
    lang: locale.value
  }
})

useSeoMeta({
  titleTemplate: 'ImagenPro AI - %s',
  ogImage:
    'https://assets.hub.nuxt.com/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3BvcnRmb2xpby10ZW1wbGF0ZS5udXh0LmRldiIsImlhdCI6MTc0NTkzNDczMX0.XDWnQoyVy3XVtKQD6PLQ8RFUwr4yr1QnVwPxRrjCrro.jpg?theme=light',
  twitterImage:
    'https://assets.hub.nuxt.com/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3BvcnRmb2xpby10ZW1wbGF0ZS5udXh0LmRldiIsImlhdCI6MTc0NTkzNDczMX0.XDWnQoyVy3XVtKQD6PLQ8RFUwr4yr1QnVwPxRrjCrro.jpg?theme=light',
  twitterCard: 'summary_large_image'
})

const [{ data: navigation }, { data: files }] = await Promise.all([
  useAsyncData(
    'navigation',
    () => {
      return Promise.all([queryCollectionNavigation('blog')])
    },
    {
      transform: data => data.flat()
    }
  ),
  useLazyAsyncData(
    'search',
    () => {
      return Promise.all([queryCollectionSearchSections('blog')])
    },
    {
      server: false,
      transform: data => data.flat()
    }
  )
])

onMounted(() => {
  authStore.userMe()
  productStore.fetchProducts()
  i18nLocale.value = (locale.value as any) || 'en'
})

// Add a watcher to update i18n locale when app store locale changes
watch(locale, (newLocale) => {
  i18nLocale.value = newLocale as any
})
</script>

<template>
  <UApp :locale="locales[localeForI18n as keyof typeof locales]">
    <div data-vaul-drawer-wrapper>
      <NuxtLayout>
        <UMain class="relative">
          <NuxtPage />
        </UMain>
      </NuxtLayout>
    </div>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        shortcut="meta_k"
        :links="translatedNavLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
