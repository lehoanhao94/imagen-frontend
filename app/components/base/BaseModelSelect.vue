<script setup lang="ts">
interface ModelSelectProps {
  model: any
  models: any[]
}

const props = defineProps<ModelSelectProps>()
const model = defineModel<any>()
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="props.models"
    size="sm"
    icon="hugeicons:ai-chip"
    class="min-w-40 hover:bg-default focus:bg-default data-[state=open]:bg-default"
    :ui="{
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
      content: 'w-48'
    }"
  />
</template>
