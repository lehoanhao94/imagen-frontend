<script setup lang="ts">
interface HistoryFilterSelectProps {
  modelValue: string
}

const props = defineProps<HistoryFilterSelectProps>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()

// Filter options for history
const historyFilterOptions = [
  {
    label: t('historyFilter.all'),
    value: 'all'
  },
  {
    label: t('historyFilter.imagen'),
    value: 'image'
  },
  {
    label: t('historyFilter.videoGen'),
    value: 'video'
  },
  {
    label: t('historyFilter.speechGen'),
    value: 'tts-text'
  }
]

const updateValue = (value: string) => {
  emit('update:modelValue', value)
}

const selectedLabel = computed(() => {
  const option = historyFilterOptions.find(opt => opt.value === props.modelValue)
  return option?.label || t('historyFilter.all')
})
</script>

<template>
  <USelectMenu
    :model-value="props.modelValue"
    :items="historyFilterOptions"
    value-key="value"
    size="sm"
    icon="lucide:filter"
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
