<script setup lang="ts">
interface VideoType {
  id: string
  title: string
  description: string
  icon: string
}

interface VideoTypeSelectProps {
  modelValue?: VideoType | null
}

const props = defineProps<VideoTypeSelectProps>()
const emit = defineEmits<{
  'update:modelValue': [value: VideoType]
}>()

const { t } = useI18n()

const videoTypes: VideoType[] = [
  {
    id: 'advertising-marketing',
    title: t('videoTypes.advertisingMarketing.title'),
    description: t('videoTypes.advertisingMarketing.description'),
    icon: 'lucide:megaphone'
  },
  {
    id: 'social-media-content',
    title: t('videoTypes.socialMediaContent.title'),
    description: t('videoTypes.socialMediaContent.description'),
    icon: 'lucide:smartphone'
  },
  {
    id: 'personal-entertainment',
    title: t('videoTypes.personalEntertainment.title'),
    description: t('videoTypes.personalEntertainment.description'),
    icon: 'lucide:clapperboard'
  },
  {
    id: 'education-training',
    title: t('videoTypes.educationTraining.title'),
    description: t('videoTypes.educationTraining.description'),
    icon: 'lucide:graduation-cap'
  },
  {
    id: 'corporate-communication',
    title: t('videoTypes.corporateCommunication.title'),
    description: t('videoTypes.corporateCommunication.description'),
    icon: 'lucide:building-2'
  },
  {
    id: 'personalized-videos',
    title: t('videoTypes.personalizedVideos.title'),
    description: t('videoTypes.personalizedVideos.description'),
    icon: 'lucide:user-heart'
  },
  {
    id: 'time-cost-savings',
    title: t('videoTypes.timeCostSavings.title'),
    description: t('videoTypes.timeCostSavings.description'),
    icon: 'lucide:clock'
  }
]

const selectedType = ref<VideoType | null>(props.modelValue || null)

const selectType = (type: VideoType) => {
  selectedType.value = type
  emit('update:modelValue', type)
}

watch(() => props.modelValue, (newValue) => {
  selectedType.value = newValue || null
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <UCard
      v-for="type in videoTypes"
      :key="type.id"
      class="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
      :class="{
        'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950': selectedType?.id === type.id,
        'hover:bg-gray-50 dark:hover:bg-gray-800': selectedType?.id !== type.id
      }"
      @click="selectType(type)"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon
            :name="type.icon"
            class="w-6 h-6 text-primary-500"
          />
          <h3
            class="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2"
          >
            {{ type.title }}
          </h3>
        </div>
      </template>

      <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
        {{ type.description }}
      </p>

      <template #footer>
        <div class="flex justify-end">
          <UIcon
            v-if="selectedType?.id === type.id"
            name="lucide:check-circle"
            class="w-5 h-5 text-primary-500"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
