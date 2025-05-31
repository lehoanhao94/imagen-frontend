<template>
  <UDrawer
    v-model:open="showDrawer"
    inset
    title="Checkout"
    description="Confirm your order then choose your payment method."
    :ui="{ container: 'max-w-xl mx-auto' }"
  >
    <template #body>
      <div class="space-y-6">
        <!-- Deposit Detail Section -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Deposit detail</h3>
          <div class="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-neutral-600 dark:text-neutral-400">Credits:</span>
              <span class="font-medium">{{ formatNumber(numberOfCreditsWanted) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-neutral-600 dark:text-neutral-400">Price per unit:</span>
              <span class="font-medium">${{ unitPrice }}</span>
            </div>
            <UDivider />
            <div class="flex justify-between items-center text-lg font-semibold">
              <span>Total credits:</span>
              <span>{{ formatNumber(numberOfCreditsWanted) }}</span>
            </div>
            <div class="flex justify-between items-center text-lg font-semibold">
              <span>Total price:</span>
              <span>${{ totalPrice }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Section -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Payment</h3>
          <div class="space-y-3">
            <PayWithCrypto />
            <PayWithCard />
            <PayWithPaypal />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        label="Submit"
        color="neutral"
        class="justify-center"
      />
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        class="justify-center"
        @click="showDrawer = false"
      />
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
const creditsStore = useCreditsStore()
const { showDrawer, numberOfCreditsWanted, creditUnitPrice, buyCreditProduct }
  = storeToRefs(creditsStore)

// Calculate unit price based on how credits are priced
const unitPrice = computed(() => {
  return (creditUnitPrice.value / buyCreditProduct.value.base_credit).toFixed(3)
})

// Calculate total price for the selected credits
const totalPrice = computed(() => {
  return ((numberOfCreditsWanted.value / buyCreditProduct.value.base_credit) * creditUnitPrice.value).toFixed(2)
})
</script>
