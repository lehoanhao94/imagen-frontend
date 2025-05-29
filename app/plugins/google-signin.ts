import GoogleSignInPlugin from 'vue3-google-signin'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  nuxtApp.vueApp.use(GoogleSignInPlugin, {
    clientId: runtimeConfig.public.NUXT_GOOGLE_CLIENT_ID
  })
})
