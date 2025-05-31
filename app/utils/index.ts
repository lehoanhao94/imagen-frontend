export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number)
}

export const abbreviatedUnit = (number: number) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(number)
}

export const canUseFeature = (feature: string): boolean => {
  const runtimeConfig = useRuntimeConfig()
  const authStore = useAuthStore()
  return (
    runtimeConfig.public.features[
      feature as keyof typeof runtimeConfig.public.features
    ] === (true as boolean) || authStore.isSuperUser === true
  )
}
