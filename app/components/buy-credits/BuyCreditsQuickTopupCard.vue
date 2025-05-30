<script setup lang="ts"></script>

<template>
  <div>
    <UCard
      class="bg-neutral-50 dark:bg-neutral-800 hover:opacity-80 cursor-pointer"
    >
      <div class="flex flex-col gap-2">
        <div
          class="text-2xl text-center items-center gap-2 justify-center flex flex-row"
        >
          <UIcon
            name="ic:twotone-generating-tokens"
            class="size-8 text-neutral-400 dark:text-neutral-500"
          />
          {{ title }}
        </div>
        <div class="text-sm text-center">
          {{ $t("non-expirable credits") }}
        </div>
        <div class="flex flex-col justify-center items-center gap-2">
          <UIcon
            name="i-lucide-arrow-down"
            class="size-5 text-neutral-400 dark:text-neutral-500"
          />
          <div class="text-xl">
            {{ price }}<small>$</small>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  credits: number
  price: number
  quantity: number
}>()

const title = computed(() => {
  return `+ ${abbreviatedUnit(props.credits)}`
})
</script>
