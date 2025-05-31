<template>
  <UDrawer
    v-model:open="showDrawer"
    inset
    title="Checkout"
    description="Confirm your order then choose your payment method."
    :ui="{ container: 'max-w-xl mx-auto' }"
  >
    <template #body>
      <div>
        <div>Deposit detail</div>

        <div>Payment</div>
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
const { showDrawer, numberOfCreditsWanted, creditUnitPrice }
  = storeToRefs(creditsStore)
</script>
