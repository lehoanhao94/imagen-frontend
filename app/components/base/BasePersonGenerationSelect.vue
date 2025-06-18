<script setup lang="ts">
interface PersonGenerationSelectProps {
  modelValue: string
}

const props = defineProps<PersonGenerationSelectProps>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()

const personGenerationOptions = [
  { label: t('personGeneration.dontAllow'), value: 'DONT_ALLOW' },
  { label: t('personGeneration.allowAdult'), value: 'ALLOW_ADULT' },
  { label: t('personGeneration.allowAll'), value: 'ALLOW_ALL' }
]

const updateValue = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <USelectMenu
    :model-value="props.modelValue"
    :options="personGenerationOptions"
    option-attribute="label"
    value-attribute="value"
    size="sm"
    icon="hugeicons:user-settings"
    class="min-w-40 hover:bg-default focus:bg-default data-[state=open]:bg-default"
    :ui="{
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
      content: 'w-48'
    }"
    @update:model-value="updateValue"
  />
</template>
