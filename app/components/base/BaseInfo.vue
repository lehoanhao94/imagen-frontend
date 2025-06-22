<template>
  <div class="mt-2 grid grid-cols-12 gap-2">
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="col-span-12 sm:col-span-6"
    >
      <div class="text-[10px] font-light">
        <USkeleton
          v-if="row.loading"
          class="h-4 w-20"
        />
        <div v-else>
          {{ $t(row.key || "None") }}
        </div>
      </div>
      <div class="text-xs">
        <USkeleton
          v-if="row.loading"
          class="h-6 w-30 mt-2"
        />
        <div v-else-if="row.value">
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
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const rows = computed(() => {
  if (props.loading) {
    return Array(6).fill({
      loading: true
    })
  }
  return Object.keys(props.properties).map(key => ({
    key,
    value: props.properties[key]
  }))
})
</script>
