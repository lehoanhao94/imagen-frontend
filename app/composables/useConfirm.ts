export interface ConfirmOptions {
  title: string
  description?: string
  icon?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
}

export function useConfirm() {
  const isOpen = ref(false)
  const options = ref<ConfirmOptions | null>(null)

  const openConfirm = (confirmOptions: ConfirmOptions) => {
    options.value = confirmOptions
    isOpen.value = true
  }

  const closeConfirm = () => {
    isOpen.value = false
    options.value = null
  }

  const handleConfirm = async () => {
    if (options.value?.onConfirm) {
      await options.value.onConfirm()
    }
    closeConfirm()
  }

  const handleCancel = () => {
    closeConfirm()
  }

  return {
    isOpen: readonly(isOpen),
    options: readonly(options),
    openConfirm,
    closeConfirm,
    handleConfirm,
    handleCancel
  }
}
