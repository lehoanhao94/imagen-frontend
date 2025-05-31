<script setup lang="ts">
const creditsStore = useCreditsStore()
const { quickTopUpList } = storeToRefs(creditsStore)
</script>

<template>
  <div class="">
    <div>
      <h2 class="text-xl font-bold mb-4">
        {{ $t('quickTopUp') }}
      </h2>
    </div>
    <UCarousel
      v-slot="{ item }"
      wheel-gestures
      :items="quickTopUpList"
      arrows
      :ui="{
        viewport: 'p-2 py-4',
        item: 'basis-[80%] sm:basis-[28%] max-w-[300px]'
      }"
    >
      <BuyCreditsQuickTopupCard
        class="rounded-lg"
        v-bind="item"
        @click="creditsStore.processBuyCredits(item.credits)"
      />
    </UCarousel>
  </div>
</template>
