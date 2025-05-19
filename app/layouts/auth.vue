<template>
  <div class="h-screen flex justify-center px-4 py-10">
    <UButton
      icon="i-lucide-chevron-left"
      to="/"
      size="xl"
      color="neutral"
      variant="subtle"
      class="absolute left-8 top-8 rounded-full z-10"
    />

    <UPageCard
      variant="ghost"
      class="max-w-sm w-full"
    >
      <slot />
    </UPageCard>
    <LazyLayoutStarBg />
  </div>
</template>
