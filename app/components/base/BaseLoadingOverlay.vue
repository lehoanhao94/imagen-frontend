<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
const { loading } = storeToRefs(appStore)

// Luôn hiển thị logo trong overlay, không cần kiểm tra main-logo nữa
</script>

<template>
  <Transition name="fade">
    <div
      v-if="loading"
      class="loading-overlay fixed inset-0 z-[9999]"
    >
      <div class="backdrop fixed inset-0 bg-black/50 backdrop-blur-xl z-[9000]" />
    </div>
  </Transition>
</template>

<style scoped>
.loading-overlay {
  pointer-events: all;
}

.backdrop {
  animation: fadeIn 0.3s ease-in-out forwards;
}

.content {
  animation: scaleIn 0.3s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(15px);
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
