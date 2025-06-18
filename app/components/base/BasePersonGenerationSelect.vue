<script setup lang="ts">
interface PersonGenerationSelectProps {
  modelValue: any
}

const props = defineProps<PersonGenerationSelectProps>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { personGenerationOptions, getPersonGenerationLabel } = usePersonGenerationOptions()

const updateValue = (value: any) => {
  emit('update:modelValue', value)
}

const selectedLabel = computed(() => {
  return getPersonGenerationLabel(props.modelValue)
})
</script>

<template>
  <USelectMenu
    :model-value="props.modelValue"
    :items="personGenerationOptions"
    value-key="value"
    size="sm"
    icon="material-symbols-light:person-pin"
    class="min-w-40 hover:bg-default focus:bg-default data-[state=open]:bg-default"
    :ui="{
      trailingIcon:
        'group-data-[state=open]:rotate-180 transition-transform duration-200',
      content: 'w-48'
    }"
    @update:model-value="updateValue"
  >
    <template #default>
      {{ selectedLabel }}
    </template>
  </USelectMenu>
</template>
