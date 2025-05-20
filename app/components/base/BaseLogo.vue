<script lang="ts" setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

// Reference to the logo element
const logoRef = ref<HTMLElement | null>(null)

// Number of stars to display when loading
const starCount = 30 // Increased for more continuous effect
</script>

<template>
  <div
    ref="logoRef"
    class="circulate"
    :class="{ 'loading-active': loading }"
  >
    <!-- Stars that fly out from the ball when loading is true -->
    <div
      v-if="loading"
      class="stars-container"
    >
      <div
        v-for="n in starCount"
        :key="`star-${n}`"
        class="star"
        :class="`star-${(n % 12) + 1}`"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>

    <div
      class="circle mx-auto border-2 dark:border-gray-400 w-24 h-24"
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
  transition: transform 0.3s ease, border-color 0.3s ease;
  /* Default border style */
  border: 2px solid transparent;

  &:hover {
    transform: perspective(800px) rotateX(5deg) scale(1.40);
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

/* Stars styles and animations */
.stars-container {
  position: absolute; /* Changed from fixed to absolute to prevent scroll issues */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 5;
  pointer-events: none;
  overflow: visible; /* Allow stars to be visible outside container */
}

.star {
  position: absolute;
  opacity: 0;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
  animation: starFlyOut 1s ease-out infinite, twinkle 1s ease-in-out infinite; /* Faster animation */
  animation-fill-mode: forwards;
  transform-origin: center center;
  /* Position all stars at the center of the logo initially */
  top: 50%;
  left: 50%;
  /* Adjust for the star's size to truly center it */
  transform: translate(-50%, -50%);
}

/* Different orbit paths for stars */
.star-1, .star-5, .star-9 {
  animation-name: starFlyOut1, twinkle;
}

.star-2, .star-6, .star-10 {
  animation-name: starFlyOut2, twinkle;
}

.star-3, .star-7, .star-11 {
  animation-name: starFlyOut3, twinkle;
}

.star-4, .star-8, .star-12 {
  animation-name: starFlyOut4, twinkle;
}

/* Additional directions for more stars - with faster durations */
.star:nth-child(12n+1) { animation-name: starFlyOut1, twinkle; animation-duration: 4s, 1s; } /* Reduced from 8s to 4s */
.star:nth-child(12n+2) { animation-name: starFlyOut2, twinkle; animation-duration: 4.5s, 1s; } /* Reduced from 9s to 4.5s */
.star:nth-child(12n+3) { animation-name: starFlyOut3, twinkle; animation-duration: 5s, 1s; } /* Reduced from 10s to 5s */
.star:nth-child(12n+4) { animation-name: starFlyOut4, twinkle; animation-duration: 5.5s, 1s; } /* Reduced from 11s to 5.5s */
.star:nth-child(12n+5) { animation-name: starFlyOut5, twinkle; animation-duration: 4.5s, 1s; } /* Reduced from 9s to 4.5s */
.star:nth-child(12n+6) { animation-name: starFlyOut6, twinkle; animation-duration: 5s, 1s; } /* Reduced from 10s to 5s */
.star:nth-child(12n+7) { animation-name: starFlyOut7, twinkle; animation-duration: 5.5s, 1s; } /* Reduced from 11s to 5.5s */
.star:nth-child(12n+8) { animation-name: starFlyOut8, twinkle; animation-duration: 6s, 1s; } /* Reduced from 12s to 6s */
.star:nth-child(12n+9) { animation-name: starFlyOut9, twinkle; animation-duration: 5s, 1s; } /* Reduced from 10s to 5s */
.star:nth-child(12n+10) { animation-name: starFlyOut10, twinkle; animation-duration: 5.5s, 1s; } /* Reduced from 11s to 5.5s */
.star:nth-child(12n+11) { animation-name: starFlyOut11, twinkle; animation-duration: 6s, 1s; } /* Reduced from 12s to 6s */
.star:nth-child(12n+12) { animation-name: starFlyOut12, twinkle; animation-duration: 6.5s, 1s; } /* Reduced from 13s to 6.5s */

.star svg {
  width: 100%;
  height: 100%;
}

/* Different colors for stars */
.star-1, .star-5, .star-9 {
  color: #ffde59; /* Yellow */
}

.star-2, .star-6, .star-10 {
  color: #ff7eb6; /* Pink */
}

.star-3, .star-7, .star-11 {
  color: #7ed7ff; /* Light blue */
}

.star-4, .star-8, .star-12 {
  color: #b6ffce; /* Light green */
}

/* Timing and size for each star - reduced delays for faster appearance */
.star-1 {
  animation-delay: 0s;
  width: 12px;
  height: 12px;
}

.star-2 {
  animation-delay: 0.05s; /* Reduced from 0.1s */
  width: 10px;
  height: 10px;
}

.star-3 {
  animation-delay: 0.1s; /* Reduced from 0.2s */
  width: 14px;
  height: 14px;
}

.star-4 {
  animation-delay: 0.15s; /* Reduced from 0.3s */
  width: 11px;
  height: 11px;
}

.star-5 {
  animation-delay: 0.2s; /* Reduced from 0.4s */
  width: 9px;
  height: 9px;
}

.star-6 {
  animation-delay: 0.25s; /* Reduced from 0.5s */
  width: 13px;
  height: 13px;
}

.star-7 {
  animation-delay: 0.3s; /* Reduced from 0.6s */
  width: 10px;
  height: 10px;
}

.star-8 {
  animation-delay: 0.35s; /* Reduced from 0.7s */
  width: 12px;
  height: 12px;
}

.star-9 {
  animation-delay: 0.4s; /* Reduced from 0.8s */
  width: 8px;
  height: 8px;
}

.star-10 {
  animation-delay: 0.45s; /* Reduced from 0.9s */
  width: 11px;
  height: 11px;
}

.star-11 {
  animation-delay: 0.5s; /* Reduced from 1.0s */
  width: 9px;
  height: 9px;
}

.star-12 {
  animation-delay: 0.55s; /* Reduced from 1.1s */
  width: 10px;
  height: 10px;
}

/* Staggered delays for continuous effect - reduced for faster appearance */
.star:nth-child(n+13):nth-child(-n+24) {
  animation-delay: 0.6s; /* Reduced from 1.2s */
}

.star:nth-child(n+25) {
  animation-delay: 1.2s; /* Reduced from 2.4s */
}

/* Base animation for stars flying out in circular paths - faster and further */
@keyframes starFlyOut1 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1) rotate(0deg);
    filter: drop-shadow(0 0 2px currentColor);
  }
  3% { /* Reduced from 5% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(45deg);
    filter: drop-shadow(0 0 5px currentColor);
  }
  10% { /* Reduced from 15% - faster movement */
    opacity: 1;
    transform: translate(calc(-50% + 40px), calc(-50% - 30px)) scale(1) rotate(90deg); /* Increased distance */
    filter: drop-shadow(0 0 6px currentColor);
  }
  20% { /* Reduced from 30% - faster movement */
    opacity: 0.9;
    transform: translate(calc(-50% + 80px), calc(-50% - 50px)) scale(0.9) rotate(180deg); /* Increased distance */
    filter: drop-shadow(0 0 5px currentColor);
  }
  35% { /* Reduced from 45% - faster movement */
    opacity: 0.8;
    transform: translate(calc(-50% + 120px), calc(-50% - 30px)) scale(0.8) rotate(270deg); /* Increased distance */
    filter: drop-shadow(0 0 4px currentColor);
  }
  50% { /* Reduced from 60% - faster movement */
    opacity: 0.7;
    transform: translate(calc(-50% + 160px), calc(-50% + 20px)) scale(0.7) rotate(360deg); /* Increased distance */
    filter: drop-shadow(0 0 3px currentColor);
  }
  65% { /* Reduced from 75% - faster movement */
    opacity: 0.6;
    transform: translate(calc(-50% + 140px), calc(-50% + 60px)) scale(0.6) rotate(450deg); /* Increased distance */
    filter: drop-shadow(0 0 2px currentColor);
  }
  80% { /* Reduced from 90% - faster movement */
    opacity: 0.5;
    transform: translate(calc(-50% + 100px), calc(-50% + 100px)) scale(0.5) rotate(540deg); /* Increased distance */
    filter: drop-shadow(0 0 1px currentColor);
  }
  100% {
    opacity: 0.4;
    transform: translate(calc(-50% + 40px), calc(-50% + 80px)) scale(0.4) rotate(630deg); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

@keyframes starFlyOut2 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1) rotate(0deg);
    filter: drop-shadow(0 0 2px currentColor);
  }
  3% { /* Reduced from 5% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(-45deg);
    filter: drop-shadow(0 0 5px currentColor);
  }
  10% { /* Reduced from 15% - faster movement */
    opacity: 1;
    transform: translate(calc(-50% - 40px), calc(-50% - 30px)) scale(1) rotate(-90deg); /* Increased distance */
    filter: drop-shadow(0 0 6px currentColor);
  }
  20% { /* Reduced from 30% - faster movement */
    opacity: 0.9;
    transform: translate(calc(-50% - 80px), calc(-50% - 50px)) scale(0.9) rotate(-180deg); /* Increased distance */
    filter: drop-shadow(0 0 5px currentColor);
  }
  35% { /* Reduced from 45% - faster movement */
    opacity: 0.8;
    transform: translate(calc(-50% - 120px), calc(-50% - 30px)) scale(0.8) rotate(-270deg); /* Increased distance */
    filter: drop-shadow(0 0 4px currentColor);
  }
  50% { /* Reduced from 60% - faster movement */
    opacity: 0.7;
    transform: translate(calc(-50% - 160px), calc(-50% + 20px)) scale(0.7) rotate(-360deg); /* Increased distance */
    filter: drop-shadow(0 0 3px currentColor);
  }
  65% { /* Reduced from 75% - faster movement */
    opacity: 0.6;
    transform: translate(calc(-50% - 140px), calc(-50% + 60px)) scale(0.6) rotate(-450deg); /* Increased distance */
    filter: drop-shadow(0 0 2px currentColor);
  }
  80% { /* Reduced from 90% - faster movement */
    opacity: 0.5;
    transform: translate(calc(-50% - 100px), calc(-50% + 100px)) scale(0.5) rotate(-540deg); /* Increased distance */
    filter: drop-shadow(0 0 1px currentColor);
  }
  100% {
    opacity: 0.4;
    transform: translate(calc(-50% - 40px), calc(-50% + 80px)) scale(0.4) rotate(-630deg); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

@keyframes starFlyOut3 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1) rotate(0deg);
    filter: drop-shadow(0 0 2px currentColor);
  }
  3% { /* Reduced from 5% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(30deg);
    filter: drop-shadow(0 0 5px currentColor);
  }
  10% { /* Reduced from 15% - faster movement */
    opacity: 1;
    transform: translate(calc(-50% + 50px), calc(-50%)) scale(1) rotate(60deg); /* Increased distance */
    filter: drop-shadow(0 0 6px currentColor);
  }
  20% { /* Reduced from 30% - faster movement */
    opacity: 0.9;
    transform: translate(calc(-50% + 100px), calc(-50% + 15px)) scale(0.9) rotate(120deg); /* Increased distance */
    filter: drop-shadow(0 0 5px currentColor);
  }
  35% { /* Reduced from 45% - faster movement */
    opacity: 0.8;
    transform: translate(calc(-50% + 150px), calc(-50% + 30px)) scale(0.8) rotate(180deg); /* Increased distance */
    filter: drop-shadow(0 0 4px currentColor);
  }
  50% { /* Reduced from 60% - faster movement */
    opacity: 0.7;
    transform: translate(calc(-50% + 130px), calc(-50% + 60px)) scale(0.7) rotate(240deg); /* Increased distance */
    filter: drop-shadow(0 0 3px currentColor);
  }
  65% { /* Reduced from 75% - faster movement */
    opacity: 0.6;
    transform: translate(calc(-50% + 90px), calc(-50% + 90px)) scale(0.6) rotate(300deg); /* Increased distance */
    filter: drop-shadow(0 0 2px currentColor);
  }
  80% { /* Reduced from 90% - faster movement */
    opacity: 0.5;
    transform: translate(calc(-50% + 40px), calc(-50% + 70px)) scale(0.5) rotate(360deg); /* Increased distance */
    filter: drop-shadow(0 0 1px currentColor);
  }
  100% {
    opacity: 0.4;
    transform: translate(calc(-50% - 30px), calc(-50% + 40px)) scale(0.4) rotate(420deg); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

@keyframes starFlyOut4 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1) rotate(0deg);
    filter: drop-shadow(0 0 2px currentColor);
  }
  3% { /* Reduced from 5% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(-30deg);
    filter: drop-shadow(0 0 5px currentColor);
  }
  10% { /* Reduced from 15% - faster movement */
    opacity: 1;
    transform: translate(calc(-50%), calc(-50% + 50px)) scale(1) rotate(-60deg); /* Increased distance */
    filter: drop-shadow(0 0 6px currentColor);
  }
  20% { /* Reduced from 30% - faster movement */
    opacity: 0.9;
    transform: translate(calc(-50% - 15px), calc(-50% + 100px)) scale(0.9) rotate(-120deg); /* Increased distance */
    filter: drop-shadow(0 0 5px currentColor);
  }
  35% { /* Reduced from 45% - faster movement */
    opacity: 0.8;
    transform: translate(calc(-50% - 30px), calc(-50% + 150px)) scale(0.8) rotate(-180deg); /* Increased distance */
    filter: drop-shadow(0 0 4px currentColor);
  }
  50% { /* Reduced from 60% - faster movement */
    opacity: 0.7;
    transform: translate(calc(-50% - 60px), calc(-50% + 130px)) scale(0.7) rotate(-240deg); /* Increased distance */
    filter: drop-shadow(0 0 3px currentColor);
  }
  65% { /* Reduced from 75% - faster movement */
    opacity: 0.6;
    transform: translate(calc(-50% - 90px), calc(-50% + 90px)) scale(0.6) rotate(-300deg); /* Increased distance */
    filter: drop-shadow(0 0 2px currentColor);
  }
  80% { /* Reduced from 90% - faster movement */
    opacity: 0.5;
    transform: translate(calc(-50% - 70px), calc(-50% + 40px)) scale(0.5) rotate(-360deg); /* Increased distance */
    filter: drop-shadow(0 0 1px currentColor);
  }
  100% {
    opacity: 0.4;
    transform: translate(calc(-50% - 40px), calc(-50% - 30px)) scale(0.4) rotate(-420deg); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

@keyframes starFlyOut5 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    filter: drop-shadow(0 0 2px currentColor);
  }
  5% { /* Reduced from 10% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0 5px currentColor);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% - 200px), calc(-50%)) scale(0.8); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

@keyframes starFlyOut6 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    filter: drop-shadow(0 0 2px currentColor);
  }
  5% { /* Reduced from 10% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0 5px currentColor);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50%), calc(-50% - 200px)) scale(0.8); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

/* Add a twinkling effect to stars - faster and brighter */
@keyframes twinkle {
  0%, 100% {
    opacity: 0.7;
    filter: drop-shadow(0 0 3px currentColor);
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 10px currentColor); /* Increased glow */
  }
}

@keyframes starFlyOut7 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    filter: drop-shadow(0 0 2px currentColor);
  }
  5% { /* Reduced from 10% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0 5px currentColor);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + 200px), calc(-50% + 200px)) scale(0.8); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

@keyframes starFlyOut8 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    filter: drop-shadow(0 0 2px currentColor);
  }
  5% { /* Reduced from 10% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0 5px currentColor);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% - 200px), calc(-50% + 200px)) scale(0.8); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

@keyframes starFlyOut9 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    filter: drop-shadow(0 0 2px currentColor);
  }
  5% { /* Reduced from 10% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0 5px currentColor);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + 180px), calc(-50% - 180px)) scale(0.8); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

@keyframes starFlyOut10 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    filter: drop-shadow(0 0 2px currentColor);
  }
  5% { /* Reduced from 10% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0 5px currentColor);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% - 180px), calc(-50% - 180px)) scale(0.8); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

@keyframes starFlyOut11 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    filter: drop-shadow(0 0 2px currentColor);
  }
  5% { /* Reduced from 10% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0 5px currentColor);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + 180px), calc(-50% + 180px)) scale(0.8); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}

@keyframes starFlyOut12 {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.1);
    filter: drop-shadow(0 0 2px currentColor);
  }
  5% { /* Reduced from 10% - faster initial appearance */
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: drop-shadow(0 0 5px currentColor);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% - 180px), calc(-50% + 180px)) scale(0.8); /* Increased distance */
    filter: drop-shadow(0 0 0px currentColor);
  }
}
</style>
