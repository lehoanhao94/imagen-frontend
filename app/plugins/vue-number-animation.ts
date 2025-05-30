import NumberAnimation from 'vue-number-animation'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(NumberAnimation)
})
