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
  mix-blend-mode: color-burn;
  filter: blur(10px) brightness(1.7);
  z-index: 0;
  pointer-events: none;
  background-size: 200% 200%;
  animation: gradientShift 12s ease-in-out infinite;
}

.dark .glow-text::after {
  filter: blur(3px) brightness(1.3);
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
