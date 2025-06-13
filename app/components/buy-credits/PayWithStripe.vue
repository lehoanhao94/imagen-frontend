<template>
  <UCard
    class="bg-neutral-50 dark:bg-neutral-800 hover:opacity-80 cursor-pointer"
    :ui="{
      body: '!py-3',
    }"
    @click="handleStripePayment"
  >
    <div class="flex flex-col gap-2">
      <div
        class="text-base font-semibold text-center flex items-center justify-center gap-2"
      >
        <UIcon
          :name="loadings['createStripeOrder'] ? 'eos-icons:loading' : 'i-simple-icons-stripe'"
          class="size-6 text-blue-600"
        />
        {{ $t("stripe") }}
      </div>
      <div class="text-sm text-center text-neutral-600 dark:text-neutral-400">
        {{ $t("stripeDescription") }}
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const creditsStore = useCreditsStore();
const { loadings } = storeToRefs(creditsStore);
const handleStripePayment = () => {
  creditsStore.processStripePayment();
};
</script>
