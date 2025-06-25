<script setup lang="ts">
const creditsStore = useCreditsStore()
const { buyCreditProduct, creditUnitPrice } = storeToRefs(creditsStore)

const value = ref(buyCreditProduct.value.base_credit)

const estimatedPrice = computed(() => {
  return (
    (value.value / buyCreditProduct.value.base_credit)
    * creditUnitPrice.value
  )
})
</script>

<template>
  <div class="">
    <div>
      <h2 class="text-xl font-bold mb-4">
        {{ $t('customTopUp') }}
      </h2>
    </div>
    <div class="flex flex-col gap-4 justify-center items-center sm:max-w-lg mx-auto">
      <UFormField
        :label="$t('numberOfCredits')"
        class="w-full"
      >
        <UInputNumber
          v-model="value"
          size="xl"
          class="w-full"
          :step="buyCreditProduct.base_credit"
          :min="buyCreditProduct.base_credit"
        />
      </UFormField>
      <UButton
        size="xl"
        color="primary"
        block
        @click="creditsStore.processBuyCredits(value)"
      >
        ${{ estimatedPrice }} - {{ $t("Top up now") }}
      </UButton>
    </div>
  </div>
</template>
