<script setup lang="ts">
const { imageDimensions, imageDimension } = useImageDimensions()
</script>

<template>
  <URadioGroup
    v-model="imageDimension"
    indicator="hidden"
    variant="card"
    :items="imageDimensions"
    size="xs"
    :ui="{
      fieldset: 'flex flex-wrap gap-2 flex-row',
      item: 'flex py-0 !px-0 items-center justify-center rounded-lg border border-muted/50 hover:bg-muted/50'
    }"
  >
    <template #label="{ item }">
      <UPopover
        mode="hover"
        arrow
        :content="{
          side: 'bottom',
          align: 'center'
        }"
      >
        <div class="flex flex-col items-center min-w-[40px] !py-1.5">
          <span class="text-xs">{{ item.label }}</span>
        </div>
        <template #content>
          <div class="p-2">
            <div
              :class="item.classExample"
              class="flex items-center justify-center rounded-md border border-white/20 bg-muted/50"
            >
              <UIcon
                name="ion:image"
                class="w-6 h-6 text-gray-500"
              />
            </div>
          </div>
        </template>
      </UPopover>
    </template>
  </URadioGroup>
</template>
