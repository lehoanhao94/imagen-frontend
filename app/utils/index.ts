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

export const popupCenter = (width: number, height: number, url: string) => {
  const left = (screen.width - width) / 2
  const top = (screen.height - height) / 2
  const options = `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
  const newWindow = window.open(url, '_blank', options)
  if (newWindow) {
    newWindow.focus()
  }
  return newWindow
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
