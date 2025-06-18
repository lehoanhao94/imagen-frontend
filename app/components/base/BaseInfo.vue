<template>
  <div class="mt-2 grid grid-cols-12 gap-2">
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="col-span-12 sm:col-span-6"
    >
      <div class="text-[10px] font-light">
        {{ $t(row.key) }}
      </div>
      <div class="text-xs">
        <div v-if="row.value">
          {{ row.value }}
        </div>
        <div
          v-else
          class="font-thin italic"
        >
          {{ $t("None") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  properties: {
    type: Object,
    default: () => ({})
  }
})

const rows = computed(() => {
  return Object.keys(props.properties).map(key => ({
    key,
    value: props.properties[key]
  }))
})
</script>
