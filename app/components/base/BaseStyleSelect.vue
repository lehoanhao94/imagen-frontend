<script setup lang="ts">
const { styles, style } = useStyles()
</script>

<template>
  <USelectMenu
    v-model="style"
    :items="styles"
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
