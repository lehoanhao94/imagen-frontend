<script setup lang="ts">
import { ref } from 'vue'

import type { SelectMenuItem, ChipProps } from '@nuxt/ui'

const dialogToSpeechStore = useDialogToSpeechStore()
const { speakers } = storeToRefs(dialogToSpeechStore)

interface Props {
  speakerIndex?: number
  input?: string
  canRemove?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  speakerIndex: 0,
  input: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'remove': [index: number]
}>()

const { t } = useI18n()

const items = computed(() => {
  return speakers.value.map(speaker => ({
    ...speaker,
    label: t(speaker.label)
  }))
})

const speaker = computed({
  get: () => items.value[props.speakerIndex],
  set: (value: any) => {
    const index = items.value.findIndex(item => item.value === value.value)
    emit('update:modelValue', {
      speakerIndex: index,
      input: dialogInput.value
    })
  }
})

const dialogInput = computed({
  get: () => props.input,
  set: (value: string) => {
    emit('update:modelValue', {
      speakerIndex: props.speakerIndex,
      input: value
    })
  }
})
</script>

<template>
  <div class="group">
    <UFormField>
      <template #label>
        <USelectMenu
          v-model="speaker"
          create-item
          :items="items"
          variant="soft"
          size="xs"
          icon="fluent:person-voice-16-regular"
          :ui="{
            content: 'w-48'
          }"
          :search-input="false"
        >
          <template #leading="{ modelValue, ui }">
            <UChip
              v-if="modelValue"
              v-bind="modelValue.chip"
              inset
              standalone
              :size="ui.itemLeadingChipSize() as ChipProps['size']"
              :class="ui.itemLeadingChip()"
            />
          </template>
        </USelectMenu>
      </template>
      <template #hint>
        <UButton
          v-if="props.canRemove"
          color="neutral"
          variant="ghost"
          icon="iconamoon:trash-light"
          :label="$t('Remove')"
          size="xs"
          class="hidden group-hover:flex"
          @click="emit('remove', props.speakerIndex)"
        />
      </template>
      <UTextarea
        v-model="dialogInput"
        class="w-full"
        :placeholder="$t('Start typing dialog here...')"
        autoresize
      />
    </UFormField>
  </div>
</template>
