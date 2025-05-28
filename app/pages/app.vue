<script setup lang="ts">
const appStore = useAppStore()

const { loading } = storeToRefs(appStore)
</script>

<template>
  <UPage>
    <div class="flex flex-col justify-center pt-30">
      <div class="logo-container w-20 h-20 mx-auto">
        <BaseLogo
          id="main-logo"
          :loading="loading"
          :class="{
            'logo-loading animate__pulse animate__infinite': loading
          }"
          class="animate__animated"
        />
      </div>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5
        }"
      >
        <BaseAppTitle
          class="justify-center text-center flex mx-auto text-6xl lg:w-[400px]"
        />
      </Motion>
      <UContainer class="mt-6 mb-4">
        <AIToolMenu />
      </UContainer>
      <NuxtPage />
    </div>
  </UPage>
</template>

<style scoped>
.logo-container {
  position: relative;
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  background: transparent; /* Đảm bảo nền trong suốt */
}

#main-logo {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 30;
  transform-origin: center center;
  will-change: transform, top, left, position;
  background: transparent; /* Đảm bảo nền trong suốt */
}

#main-logo.logo-loading {
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%) scale(1.05);
  z-index: 10000;
  animation: pulse 2s infinite ease-in-out;
  /* Ensure logo is visible */
  opacity: 1 !important;
  visibility: visible !important;
  /* Add shadow for better visibility */
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
  /* Đảm bảo không có ô vuông màu đen kỳ lạ phía sau */
  background: transparent !important;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1.05);
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
    background: transparent;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.3));
    background: transparent;
  }
}
</style>
