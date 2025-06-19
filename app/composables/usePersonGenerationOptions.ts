export interface PersonGenerationOption {
  label: string
  value: string
}

export function usePersonGenerationOptions() {
  const { t } = useI18n()

  const personGenerationOptions = computed<PersonGenerationOption[]>(() => [
    { label: t('personGeneration.dontAllow'), value: 'DONT_ALLOW' },
    { label: t('personGeneration.allowAdult'), value: 'ALLOW_ADULT' },
    { label: t('personGeneration.allowAll'), value: 'ALLOW_ALL' }
  ])

  const getPersonGenerationLabel = (value: string): string | undefined => {
    return personGenerationOptions.value.find(option => option.value === value)?.label
  }

  const getPersonGenerationItem = (value: string): PersonGenerationOption | undefined => {
    return personGenerationOptions.value.find(option => option.value === value)
  }

  return {
    personGenerationOptions,
    getPersonGenerationLabel,
    getPersonGenerationItem
  }
}