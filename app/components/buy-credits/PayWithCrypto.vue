<template>
  <UCard
    class="bg-neutral-50 dark:bg-neutral-800 hover:opacity-80 cursor-pointer"
    :ui="{
      body: '!py-3'
    }"
  >
    <div class="flex flex-col gap-2">
      <div class="text-base font-semibold text-center flex items-center justify-center gap-2">
        <UIcon
          name="i-lucide-bitcoin"
          class="size-6 text-amber-500"
        />
        {{ $t('payWithCrypto') }}
      </div>
      <div class="text-sm text-center text-neutral-600 dark:text-neutral-400">
        {{ $t('cryptoDescription') }}
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
// Component for crypto payment option
</script>
