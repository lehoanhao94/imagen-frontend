<template>
  <div class="relative group">
    <div
      class="group-hover:hidden absolute top-2 right-2 flex flex-col items-end gap-1"
    >
      <span
        class="bg-gray-500/80 text-white text-[0.625rem] px-1.5 py-0.5 rounded z-10 text-xs font-semibold"
      >
        {{ $t(type || "") }}
      </span>
      <span
        v-if="style"
        class="bg-yellow-500/80 text-white text-[0.625rem] px-1.5 py-0.5 rounded z-10 text-xs font-semibold"
      >
        {{ style }}
      </span>
      <span
        v-if="status === 3"
        class="bg-red-500/90 text-white text-[0.625rem] px-1.5 py-0.5 rounded z-10 text-xs font-semibold flex items-center gap-1"
      >
        <UIcon
          name="lucide:alert-circle"
          class="w-3 h-3"
        />
        {{ $t("error") }}
      </span>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    required: true
  },
  style: {
    type: String,
    default: ''
  },
  status: {
    type: Number,
    default: 1
  }
})
</script>
