<script setup lang="ts">
// Using $t() directly in the template
</script>

<template>
  <div class="tilt-wrapper">
    <div class="hero w-fit mx-auto">
      <div
        class="glow-text lg:text-5xl text-3xl transition-all duration-300 text-gray-50 dark:text-white dark:opacity-75 opacity-100"
        data-text="GeminiGen.AI"
      >
        GeminiGen.AI
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.label {
  font-weight: 500;
  color: #ffffff;
  opacity: 0.85;
  margin-bottom: 16px;
  text-align: center;
  transition: opacity 0.25s ease-out;
}

.glow-text {
  position: relative;
  letter-spacing: -0.015em;
  filter: brightness(1.1);
  z-index: 1;
  /* Safari-specific fixes */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.glow-text::before {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #00cfff, #a600ff, #ff006e, #ff8800);
  filter: blur(20px) brightness(0.8);
  border-radius: 100px;
  z-index: -1;
  pointer-events: none;
  background-size: 200% 200%;
  animation: gradientShift 12s ease-in-out infinite;
  /* Safari-specific fixes */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

.glow-text::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  letter-spacing: inherit;
  background: linear-gradient(90deg, #00cfff, #a600ff, #ff006e, #ff8800);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* Replace problematic mix-blend-mode with opacity for Safari */
  opacity: 0.8;
  filter: blur(10px) brightness(1.7);
  z-index: 0;
  pointer-events: none;
  background-size: 200% 200%;
  animation: gradientShift 12s ease-in-out infinite;
  /* Safari-specific fixes */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  /* Fallback for Safari text gradient issues */
  color: transparent;
}

/* Safari-specific fallback for gradient text */
@supports not (-webkit-background-clip: text) {
  .glow-text::after {
    background: none;
    color: #a600ff;
    -webkit-text-fill-color: #a600ff;
  }
}

/* Enhanced fallback for older Safari versions */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .glow-text::after {
    /* Ensure text gradient works on Safari */
    -webkit-text-stroke: 1px transparent;
    text-shadow: 0 0 20px rgba(166, 0, 255, 0.5);
  }
}

.dark .glow-text::after {
  filter: blur(3px) brightness(1.3);
  /* Adjust opacity for dark mode Safari compatibility */
  opacity: 0.9;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
