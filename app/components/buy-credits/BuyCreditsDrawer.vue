<template>
  <USlideover
    v-model:open="showDrawer"
    :title="$t('buyCredits.checkout')"
    :description="$t('buyCredits.checkoutDescription')"
  >
    <template #body>
      <div class="space-y-6 w-full">
        <!-- Order Detail Section -->
        <div>
          <h3 class="text-base font-semibold mb-4">
            {{ $t("buyCredits.orderDetail") }}
          </h3>
          <div
            class="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3"
          >
            <div class="flex justify-between items-center">
              <span class="text-neutral-600 dark:text-neutral-400">{{ $t("buyCredits.credits") }}:</span>
              <span class="font-medium">{{
                formatNumber(numberOfCreditsWanted)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-neutral-600 dark:text-neutral-400">{{ $t("buyCredits.pricePerUnit") }}:</span>
              <span class="font-medium">${{ unitPrice }}</span>
            </div>
            <UDivider />
            <div
              class="flex justify-between items-center text-base font-semibold"
            >
              <span>{{ $t("buyCredits.totalCredits") }}:</span>
              <span class="text-primary-600 text-lg">{{ formatNumber(numberOfCreditsWanted) }}</span>
            </div>
            <div
              class="flex justify-between items-center text-base font-semibold"
            >
              <span>{{ $t("buyCredits.totalPrice") }}:</span>
              <span class="text-primary-600 text-lg">${{ totalPrice }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Section -->
        <div>
          <h3 class="text-base font-semibold mb-4">
            {{ $t("buyCredits.payment") }}
          </h3>
          <div class="space-y-3">
            <PayWithCrypto />
            <!-- <PayWithCard /> -->
            <!-- <PayWithPaypal /> -->
            <PayWithStripe />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        :label="$t('buyCredits.cancel')"
        color="neutral"
        variant="outline"
        class="justify-center"
        block
        @click="showDrawer = false"
      />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
const creditsStore = useCreditsStore()
const { showDrawer, numberOfCreditsWanted, creditUnitPrice, buyCreditProduct }
  = storeToRefs(creditsStore)

// Calculate unit price based on how credits are priced
const unitPrice = computed(() => {
  return (creditUnitPrice.value / buyCreditProduct.value.base_credit).toFixed(
    6
  )
})

// Calculate total price for the selected credits
const totalPrice = computed(() => {
  return (
    (numberOfCreditsWanted.value / buyCreditProduct.value.base_credit)
    * creditUnitPrice.value
  ).toFixed(2)
})
</script>
