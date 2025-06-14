<template>
  <UPage>
    <UContainer>
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-1 text-sm text-muted-foreground">
          <li>
            <NuxtLink
              to="/"
              class="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <UIcon name="i-lucide-home" class="w-4 h-4 mr-2" />
              {{ $t("common.home") }}
            </NuxtLink>
          </li>
          <li>
            <div class="flex items-center">
              <UIcon
                name="i-lucide-chevron-right"
                class="w-4 h-4 text-muted-foreground"
              />
              <span class="ml-1 text-sm font-medium text-primary md:ml-2">{{
                $t("orders.title")
              }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Error message -->
      <div v-if="hasError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
        <div class="flex items-center">
          <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-red-500 mr-2" />
          <p class="text-red-700">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t("orders.title") }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t("orders.description") }}
        </p>
      </div>

      <!-- Orders Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <template v-for="(ordersData, index) in ordersWithPage" :key="`page-${ordersData.page}`">
          <Motion
            v-for="(order, orderIndex) in ordersData.orders"
            :key="`order-${order.id}`"
            :initial="{
              scale: 1.1,
              opacity: 0,
              filter: 'blur(20px)',
            }"
            :animate="{
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
            }"
            :transition="{
              duration: 0.6,
              delay: orderIndex * 0.1,
            }"
          >
            <OrderCard :data="order" />
          </Motion>
        </template>

        <!-- Loading skeletons -->
        <Motion
          v-if="loadings.fetchMoreOrders || loadings.fetchOrders"
          v-for="n in 6"
          :key="`skeleton-${n}`"
          class="w-full rounded-lg"
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)',
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
          }"
          :transition="{
            duration: 0.6,
            delay: n * 0.1,
          }"
        >
          <USkeleton
            class="w-full h-48"
            :style="{
              borderRadius: '0.5rem',
            }"
          />
        </Motion>
      </div>

      <!-- Empty state -->
      <div
        v-if="!isLoading && ordersData.length === 0 && !hasError"
        class="text-center py-12"
      >
        <UIcon name="i-lucide-shopping-cart" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ $t("orders.empty.title") }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t("orders.empty.description") }}
        </p>
        <UButton
          to="/buy-credits"
          color="primary"
          variant="solid"
        >
          {{ $t("orders.empty.action") }}
        </UButton>
      </div>

      <!-- End of list indicator for intersection observer -->
      <div
        v-if="hasMoreData && !isLoading"
        id="loading-trigger"
        class="h-1 w-full"
        aria-hidden="true"
      />

      <!-- End message when all data is loaded -->
      <div v-if="!hasMoreData && ordersData.length > 0" class="text-center py-8 text-gray-500">
        {{ $t("orders.endOfList") }}
      </div>
    </UContainer>
  </UPage>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from "vue";
import OrderCard from "~/components/orders/OrderCard.vue";

const { t } = useI18n();

/**
 * Orders page with infinite scroll functionality
 */

// Use orders store for fetching order data
const ordersStore = useOrdersStore();

const { ordersWithPage, currentPage, hasMoreOrders, loadings } = storeToRefs(
  ordersStore
);

// Filter parameters for the API
const filterParams = ref({
  items_per_page: 12,
});

// Computed properties from store
const ordersData = computed(() => ordersStore.orders);
const isLoading = computed(
  () => ordersStore.loadings.fetchOrders || ordersStore.loadings.fetchMoreOrders
);
const hasMoreData = computed(() => ordersStore.hasMoreOrders);

// Error handling from store
const hasError = computed(() => !!ordersStore.errors.fetchOrders);
const errorMessage = computed(() => {
  const error = ordersStore.errors.fetchOrders;
  return (
    error?.response?.data?.message ||
    error?.message ||
    t("orders.errors.fetchFailed", "Failed to load orders. Please try again.")
  );
});

// Initial data fetch
const fetchInitialData = async () => {
  await ordersStore.fetchOrders(filterParams.value);
};

// Infinite scroll observer
let observer: IntersectionObserver | null = null;

const setupInfiniteScroll = () => {
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    async (entries) => {
      const target = entries[0];
      if (target && target.isIntersecting && hasMoreData.value && !isLoading.value) {
        await ordersStore.fetchMoreOrders(filterParams.value);
        // Wait for DOM update then setup observer again
        await nextTick();
        setupInfiniteScroll();
      }
    },
    {
      rootMargin: "200px",
    }
  );

  const loadingTrigger = document.getElementById("loading-trigger");
  if (loadingTrigger) {
    observer.observe(loadingTrigger);
  }
};

// Watch for hasMoreData changes to setup/cleanup observer
watch(hasMoreData, (newValue) => {
  if (newValue) {
    nextTick(() => {
      setupInfiniteScroll();
    });
  } else if (observer) {
    observer.disconnect();
  }
});

// Lifecycle hooks
onMounted(async () => {
  await fetchInitialData();
  // Setup infinite scroll after initial data is loaded
  await nextTick();
  setupInfiniteScroll();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// Meta tags
definePageMeta({
  title: "orders.meta.title",
  description: "orders.meta.description",
  middleware: "auth",
});

useSeoMeta({
  title: () => t("orders.meta.title"),
  description: () => t("orders.meta.description"),
});
</script>