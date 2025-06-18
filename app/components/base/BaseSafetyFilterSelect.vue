<script setup lang="ts">
interface SafetyFilterSelectProps {
  modelValue: any
}

const props = defineProps<SafetyFilterSelectProps>()
const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const { t } = useI18n()

const safetyFilterOptions = [
  { label: t('safetyFilter.blockLowAndAbove'), value: 'BLOCK_LOW_AND_ABOVE' },
  {
    label: t('safetyFilter.blockMediumAndAbove'),
    value: 'BLOCK_MEDIUM_AND_ABOVE'
  },
  { label: t('safetyFilter.blockOnlyHigh'), value: 'BLOCK_ONLY_HIGH' },
  { label: t('safetyFilter.blockNone'), value: 'BLOCK_NONE' }
]

const updateValue = (value: any) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <USelectMenu
    :model-value="props.modelValue"
    :items="safetyFilterOptions"
    value-key="value"
    size="sm"
    icon="hugeicons:security"
    class="min-w-40 hover:bg-default focus:bg-default data-[state=open]:bg-default"
    :ui="{
      trailingIcon:
        'group-data-[state=open]:rotate-180 transition-transform duration-200',
      content: 'w-48'
    }"
    @update:model-value="updateValue"
  />
</template>
