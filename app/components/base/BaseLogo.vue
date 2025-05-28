<script lang="ts" setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    class="circulate"
    :class="{ 'loading-active': loading }"
  >
    <div
      class="circle border-2 dark:border-gray-400 w-24 h-24"
      :class="{ 'loading-rotate': loading }"
    >
      <div
        class="wave _one"
        :class="{ 'loading-wave': loading }"
      />
      <div
        class="wave _two"
        :class="{ 'loading-wave': loading }"
      />
      <div
        class="wave _three"
        :class="{ 'loading-wave': loading }"
      />
      <div
        class="reflection"
        :class="{ 'loading-reflection': loading }"
      />

      <!-- Image elements being processed inside the ball -->
      <div
        class="image-element photo photo1"
        :class="{ 'loading-photo': loading }"
      />
      <div
        class="image-element photo photo2"
        :class="{ 'loading-photo': loading }"
      />
      <div
        class="image-element photo photo3"
        :class="{ 'loading-photo': loading }"
      />
      <div
        class="image-element photo photo4"
        :class="{ 'loading-photo': loading }"
      />

      <!-- Particles to enhance the processing effect -->
      <div
        class="particles"
        :class="{ 'loading-particles': loading }"
      >
        <div
          v-for="n in 8"
          :key="n"
          class="particle"
          :class="[`p${n}`, { 'loading-particle': loading }]"
        />
      </div>

      <!-- Energy glow effect -->
      <div
        class="energy-glow"
        :class="{ 'loading-glow': loading }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Define the gradient angle custom property */
@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0turn;
  inherits: false;
}

.circulate {
  position: relative;
  z-index: 10;
  transition: all 0.5s ease-in-out;
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent; /* Đảm bảo nền trong suốt */
}

/* Loading state styles for the container */
.circulate.loading-active {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  z-index: 10001;
  transform: none;
  background: transparent; /* Đảm bảo nền trong suốt */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.circulate .circle {
  border-radius: 100%;
  background: white;
  /* Enhanced shadow for crystal ball effect */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 20px 60px rgba(0, 0, 0, 0.2),
    0 0 120px rgba(142, 45, 226, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.3);
  background: linear-gradient(
    135deg,
    rgba(35, 52, 93, 0.9),
    rgba(146, 22, 100, 0.9)
  );
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
  /* Glass effect */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  /* Add subtle glow */
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
  /* Add depth with a subtle 3D transform */
  transform: perspective(800px) rotateX(10deg);
  transition: transform 0.5s ease, border-color 0.3s ease, width 0.5s ease,
    height 0.5s ease;
  /* Default border style */
  border: 2px solid transparent;

  &:hover {
    transform: perspective(800px) rotateX(5deg) scale(1.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 20%,
      transparent 60%
    );
    border-radius: 100%;
    z-index: 2;
    pointer-events: none;
  }

  /* Gradient border animation when loading */
  &.loading-rotate {
    animation: 2s gradient-angle infinite linear;
    border: 2px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(
        135deg,
        rgba(35, 52, 93, 0.9),
        rgba(146, 22, 100, 0.9)
      ),
      conic-gradient(
        from var(--gradient-angle),
        #00cfff 0%,
        #a600ff 25%,
        #ff006e 50%,
        #ff8800 75%,
        #00cfff 100%
      );
    /* Increase size slightly when loading */
    width: 7rem !important;
    height: 7rem !important;
    transform: perspective(800px) rotateX(10deg) scale(1.1);
  }
}

.circulate .wave {
  opacity: 0.4;
  position: absolute;
  top: 3%;
  left: 50%;
  background: rgba(15, 16, 35, 0.56);
  width: 200px;
  height: 200px;
  margin-left: -100px;
  margin-top: -155px;
  transform-origin: 50% 48%;
  border-radius: 43%;
  animation: humming 2.5s infinite linear;
  /* Add glow to waves */
  filter: blur(1px);
}

.circulate .wave._three {
  animation: humming 5000ms infinite linear;
  opacity: 0.5;
  filter: blur(2px);
}

.circulate .wave._two {
  animation: humming 9000ms infinite linear;
  opacity: 0.8;
  background: rgba(15, 16, 35, 0.7);
  filter: blur(0.5px);
}

/* Faster wave rotation when loading */
.circulate .wave.loading-wave {
  animation-duration: 1.5s;
}

.circulate .wave._three.loading-wave {
  animation-duration: 3s;
}

.circulate .wave._two.loading-wave {
  animation-duration: 5s;
}

.circulate .box:after {
  content: "";
  display: block;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
  transform: translate3d(0, 0, 0);
}

/* Light reflection effect */
.circulate .reflection {
  position: absolute;
  width: 30%;
  height: 15%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  top: 15%;
  left: 15%;
  transform: rotate(-40deg);
  filter: blur(2px);
  animation: moveReflection 8s infinite ease-in-out;
  z-index: 3;
}

/* Enhanced reflection when loading */
.circulate .reflection.loading-reflection {
  background: rgba(255, 255, 255, 0.25);
  animation-duration: 4s;
  filter: blur(1.5px);
  width: 35%;
  height: 18%;
}

.circulate .title {
  position: absolute;
  left: 0;
  top: 20px;
  width: 100%;
  z-index: 1;
  line-height: 30px;
  text-align: center;
  transform: translate3d(0, 0, 0);
  color: white;
  text-transform: uppercase;
  font-family: "Playfair Display", serif;
  letter-spacing: 0.4em;
  font-size: 24px;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  text-indent: 0.3em;
}

@keyframes humming {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes moveReflection {
  0%,
  100% {
    opacity: 0.7;
    transform: rotate(-40deg) translateY(0);
  }
  50% {
    opacity: 0.9;
    transform: rotate(-35deg) translateY(5px);
  }
}

/* Image elements styles */
.circulate .image-element {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  z-index: 2;
  opacity: 0.7;
  filter: blur(0.5px);
}

.circulate .image-element.photo {
  width: 15px;
  height: 15px;
  border-radius: 2px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  opacity: 0.7;
}

.circulate .image-element.photo::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  z-index: 3;
}

.circulate .image-element.photo1 {
  top: 30%;
  left: 25%;
  background-color: #f5a623;
  background-image: linear-gradient(
    45deg,
    #f5a623 25%,
    #f8e71c 50%,
    #f5a623 75%
  );
  transform: scale(0.8) rotate(-5deg);
  animation: float 7s infinite ease-in-out, rotate 15s infinite linear,
    pulse 3s infinite alternate;
}

.circulate .image-element.photo2 {
  width: 12px;
  height: 18px;
  top: 60%;
  left: 60%;
  background-color: #7ed321;
  background-image: linear-gradient(
    45deg,
    #7ed321 25%,
    #b8e986 50%,
    #7ed321 75%
  );
  transform: scale(0.7) rotate(10deg);
  animation: float 8s infinite ease-in-out, rotate 12s infinite linear reverse,
    pulse 4s infinite alternate;
  animation-delay: 0.5s;
}

.circulate .image-element.photo3 {
  width: 14px;
  height: 14px;
  top: 40%;
  left: 55%;
  background-color: #bd10e0;
  background-image: linear-gradient(
    45deg,
    #bd10e0 25%,
    #d86eff 50%,
    #bd10e0 75%
  );
  transform: scale(0.75) rotate(-8deg);
  animation: float 6s infinite ease-in-out, rotate 18s infinite linear,
    pulse 5s infinite alternate;
  animation-delay: 1s;
}

.circulate .image-element.photo4 {
  width: 16px;
  height: 12px;
  top: 25%;
  left: 45%;
  background-color: #4a90e2;
  background-image: linear-gradient(
    45deg,
    #4a90e2 25%,
    #50e3c2 50%,
    #4a90e2 75%
  );
  transform: scale(0.65) rotate(15deg);
  animation: float 9s infinite ease-in-out, rotate 20s infinite linear reverse,
    pulse 6s infinite alternate;
  animation-delay: 1.5s;
}

/* Particles styles */
.circulate .particles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.circulate .particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  filter: blur(1px);
}

.circulate .particle.p1 {
  top: 20%;
  left: 30%;
  animation: particleFloat 4s infinite ease-in-out;
}
.circulate .particle.p2 {
  top: 70%;
  left: 40%;
  animation: particleFloat 5s infinite ease-in-out;
  animation-delay: 0.3s;
}
.circulate .particle.p3 {
  top: 40%;
  left: 70%;
  animation: particleFloat 6s infinite ease-in-out;
  animation-delay: 0.6s;
}
.circulate .particle.p4 {
  top: 60%;
  left: 20%;
  animation: particleFloat 7s infinite ease-in-out;
  animation-delay: 0.9s;
}
.circulate .particle.p5 {
  top: 30%;
  left: 60%;
  animation: particleFloat 5s infinite ease-in-out;
  animation-delay: 1.2s;
}
.circulate .particle.p6 {
  top: 50%;
  left: 50%;
  animation: particleFloat 6s infinite ease-in-out;
  animation-delay: 1.5s;
}
.circulate .particle.p7 {
  top: 75%;
  left: 65%;
  animation: particleFloat 7s infinite ease-in-out;
  animation-delay: 1.8s;
}
.circulate .particle.p8 {
  top: 35%;
  left: 35%;
  animation: particleFloat 4s infinite ease-in-out;
  animation-delay: 2.1s;
}

/* Energy glow effect */
.circulate .energy-glow {
  position: absolute;
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 223, 186, 0.15) 20%,
    rgba(186, 255, 201, 0.1) 40%,
    rgba(186, 225, 255, 0.05) 60%,
    transparent 80%
  );
  border-radius: 50%;
  z-index: 1;
  animation: energyPulse 4s infinite alternate;
  filter: blur(5px);
  mix-blend-mode: screen;
}

/* Add a second energy glow for more dynamic effect */
.circulate .energy-glow::after {
  content: "";
  position: absolute;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  background: radial-gradient(
    circle at center,
    rgba(255, 186, 186, 0.15) 0%,
    rgba(255, 186, 255, 0.1) 30%,
    rgba(186, 186, 255, 0.05) 60%,
    transparent 80%
  );
  border-radius: 50%;
  animation: energyPulse 5s infinite alternate-reverse;
  filter: blur(4px);
  mix-blend-mode: screen;
}

/* Animation keyframes */
@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-5px) translateX(3px);
  }
  50% {
    transform: translateY(0) translateX(5px);
  }
  75% {
    transform: translateY(5px) translateX(2px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  from {
    opacity: 0.5;
    filter: blur(0.5px);
  }
  to {
    opacity: 0.8;
    filter: blur(1px);
  }
}

@keyframes particleFloat {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(8px) translateX(5px);
  }
}

@keyframes energyPulse {
  0% {
    opacity: 0.3;
    filter: blur(4px);
    transform: scale(0.9);
  }
  50% {
    opacity: 0.6;
    filter: blur(5px);
    transform: scale(1);
  }
  100% {
    opacity: 0.4;
    filter: blur(6px);
    transform: scale(0.95);
  }
}

/* Animation for the gradient border rotation */
@keyframes gradient-angle {
  to {
    --gradient-angle: 1turn;
  }
}
</style>
