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
    <div class="flex flex-col gap-2 justify-center items-center">
      <UFormField
        :label="$t('numberOfCredits')"
        :help="`~ ${estimatedPrice} $`"
      >
        <UInputNumber
          v-model="value"
          size="xl"
          class="w-fit"
          :step="buyCreditProduct.base_credit"
          :min="buyCreditProduct.base_credit"
        />
      </UFormField>
    </div>
  </div>
</template>
