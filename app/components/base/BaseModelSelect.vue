<script setup lang="ts">
interface ModelSelectProps {
  modelValue: any
  models: any[]
}

const props = defineProps<ModelSelectProps>()
const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const updateModel = (value: any) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <USelectMenu
    :model-value="props.modelValue"
    :items="props.models"
    size="sm"
    icon="hugeicons:ai-chip"
    class="min-w-40 hover:bg-default focus:bg-default data-[state=open]:bg-default"
    :ui="{
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
      content: 'w-48'
    }"
    @update:model-value="updateModel"
  />
</template>
