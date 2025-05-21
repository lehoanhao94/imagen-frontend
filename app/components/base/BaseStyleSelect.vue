<script setup lang="ts">
const { styles, style } = useStyles()
const { t } = useI18n()

const translatedStyles = computed(() => {
  return styles.map(styleItem => ({
    value: styleItem,
    label: t(styleItem || 'none')
  }))
})
</script>

<template>
  <USelectMenu
    v-model="style"
    :items="translatedStyles"
    value-key="value"
    size="sm"
    icon="ic:baseline-style"
    class="min-w-40 hover:bg-default focus:bg-default data-[state=open]:bg-default"
    :ui="{
      trailingIcon:
        'group-data-[state=open]:rotate-180 transition-transform duration-200',
      content: 'w-48'
    }"
  />
</template>
