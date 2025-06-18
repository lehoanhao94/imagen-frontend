export interface SafetyFilterOption {
  label: string
  value: string
}

export function useSafetyFilterOptions() {
  const { t } = useI18n()

  const safetyFilterOptions = computed<SafetyFilterOption[]>(() => [
    { label: t('safetyFilter.blockLowAndAbove'), value: 'BLOCK_LOW_AND_ABOVE' },
    { label: t('safetyFilter.blockMediumAndAbove'), value: 'BLOCK_MEDIUM_AND_ABOVE' },
    { label: t('safetyFilter.blockOnlyHigh'), value: 'BLOCK_ONLY_HIGH' },
    { label: t('safetyFilter.blockNone'), value: 'BLOCK_NONE' }
  ])

  const getSafetyFilterLabel = (value: string): string | undefined => {
    return safetyFilterOptions.value.find(option => option.value === value)?.label
  }

  const getSafetyFilterItem = (value: string): SafetyFilterOption | undefined => {
    return safetyFilterOptions.value.find(option => option.value === value)
  }

  return {
    safetyFilterOptions,
    getSafetyFilterLabel,
    getSafetyFilterItem
  }
}