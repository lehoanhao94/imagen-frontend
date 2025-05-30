<script setup lang="ts"></script>

<template>
  <UPageCard
    :title="title"
    description="non-expirable credits"
    icon="ic:twotone-generating-tokens"
    variant="soft"
    to="#"
  />
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
