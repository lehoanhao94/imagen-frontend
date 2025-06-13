import VueMasonry from "vue-masonry-css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMasonry);
});
