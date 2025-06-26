<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  speaker?: any
  input?: string
}

const props = withDefaults(defineProps<Props>(), {
  speaker: () => ({}),
  input: ''
})

const { t } = useI18n()

const items = ref(['Voice 1', 'Voice 2'])
const value = ref('Voice 1')

function onCreate(item: string) {
  items.value.push(item)

  value.value = item
}
</script>

<template>
  <div>
    <UFormField>
      <template #label>
        <USelectMenu
          v-model="value"
          create-item
          :items="items"
          variant="soft"
          size="xs"
          icon="fluent:person-voice-16-regular"
          :ui="{
            content: 'w-48'
          }"
          @create="onCreate"
        />
      </template>
      <template #hint>
        <UButton
          color="neutral"
          variant="ghost"
          icon="iconamoon:trash-light"
          :label="$t('Remove')"
          size="xs"
        />
      </template>
      <UTextarea
        class="w-full"
        :placeholder="$t('Start typing dialog here...')"
        autoresize
      />
    </UFormField>
  </div>
</template>
