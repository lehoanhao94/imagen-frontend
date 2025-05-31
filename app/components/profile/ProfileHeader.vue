<template>
  <div class="">
    <div
      class="relative border dark:border-gray-800 h-60 w-full overflow-hidden rounded-t-2xl"
    >
      <!-- Video background -->
      <video
        id="myVideo"
        autoplay
        muted
        loop
        class="video-background"
      >
        <source
          src="https://cdn.leonardo.ai/users/530d2601-152b-4c3c-8f05-b6465819104d/generations/fb9828c6-64ac-446b-913d-4e06eb269a91/fb9828c6-64ac-446b-913d-4e06eb269a91.mp4"
          type="video/mp4"
        >
      </video>

      <!-- Overlay mờ -->
      <div class="video-overlay" />

      <!-- Content có thể thêm vào đây -->
      <div
        class="relative z-10 h-full flex items-center justify-center flex-col"
      >
        <!-- Nội dung khác có thể được thêm vào đây -->
        <div class="text-3xl mx-auto">
          {{ $t('profile') }}
        </div>
      </div>
    </div>
    <div class="relative w-full flex overflow-visible justify-center -mt-6 z-10">
      <ProfileMenu />
      <!-- <div class="w-24 h-24 mx-auto absolute -top-10">
        <BaseLogo
          id="main-logo"
          :loading="false"
          :class="{ 'logo-loading animate__pulse': false }"
          class="animate__animated animate__infinite"
        />
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.video-background {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  z-index: 1;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 2;
}

/* Dark mode overlay */
.dark .video-overlay {
  background: rgba(0, 0, 0, 0.7);
}
</style>
