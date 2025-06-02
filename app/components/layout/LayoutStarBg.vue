<script setup lang="ts">
interface Star {
  x: number
  y: number
  size: number
  id: string // Add unique ID for each star
}

interface ShootingStar {
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
  size: number
  duration: number
  delay: number
  active: boolean
  angle: number
}

const props = withDefaults(defineProps<{
  starCount?: number
  color?: string
  speed?: 'slow' | 'normal' | 'fast'
  size?: { min: number, max: number }
}>(), {
  starCount: 300,
  color: 'var(--ui-primary)',
  speed: 'normal',
  size: () => ({
    min: 1,
    max: 2
  })
})

// Generate random star positions and sizes
const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, index) => ({
    x: Math.floor(Math.random() * 2000),
    y: Math.floor(Math.random() * 2000),
    size: typeof props.size === 'number'
      ? props.size
      : Math.random() * (props.size.max - props.size.min) + props.size.min,
    id: `star-${Math.random().toString(36).substring(2, 9)}-${index}` // Add unique ID
  }))
}

// Generate stars at the edges of the screen for continuous flow effect
const generateEdgeStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, index) => {
    // Determine which edge to place the star (0: top, 1: right, 2: bottom, 3: left)
    const edge = Math.floor(Math.random() * 4)
    let x, y

    switch (edge) {
      case 0: // top
        x = Math.floor(Math.random() * 2000)
        y = -20 // Just above the viewport
        break
      case 1: // right
        x = 2020 // Just to the right of the viewport
        y = Math.floor(Math.random() * 2000)
        break
      case 2: // bottom
        x = Math.floor(Math.random() * 2000)
        y = 2020 // Just below the viewport
        break
      case 3: // left
        x = -20 // Just to the left of the viewport
        y = Math.floor(Math.random() * 2000)
        break
      default:
        x = Math.floor(Math.random() * 2000)
        y = -20
    }

    return {
      x,
      y,
      size: typeof props.size === 'number'
        ? props.size
        : Math.random() * (props.size.max - props.size.min) + props.size.min,
      id: `edge-star-${Math.random().toString(36).substring(2, 9)}-${index}`
    }
  })
}

// Define speed configurations once
const speedMap = {
  slow: { duration: 200, opacity: 0.5, ratio: 0.3 },
  normal: { duration: 150, opacity: 0.75, ratio: 0.3 },
  fast: { duration: 100, opacity: 1, ratio: 0.4 }
}

// Use a more efficient approach to generate and store stars
const stars = useState<{ slow: Star[], normal: Star[], fast: Star[] }>('stars', () => {
  return {
    slow: generateStars(Math.floor(props.starCount * speedMap.slow.ratio)),
    normal: generateStars(Math.floor(props.starCount * speedMap.normal.ratio)),
    fast: generateStars(Math.floor(props.starCount * speedMap.fast.ratio))
  }
})

// Compute star layers with different speeds and opacities
const starLayers = computed(() => [
  { stars: stars.value.fast, ...speedMap.fast },
  { stars: stars.value.normal, ...speedMap.normal },
  { stars: stars.value.slow, ...speedMap.slow }
])

// Generate shooting star
const generateShootingStar = (): ShootingStar => {
  // Random starting position from edges
  const edge = Math.floor(Math.random() * 4)
  let startX, startY, endX, endY

  switch (edge) {
    case 0: // From top-left to bottom-right
      startX = Math.random() * 200
      startY = Math.random() * 200
      endX = startX + 800 + Math.random() * 400
      endY = startY + 600 + Math.random() * 300
      break
    case 1: // From top-right to bottom-left
      startX = window.innerWidth - Math.random() * 200
      startY = Math.random() * 200
      endX = startX - 800 - Math.random() * 400
      endY = startY + 600 + Math.random() * 300
      break
    case 2: // From left to right
      startX = Math.random() * 100
      startY = Math.random() * window.innerHeight
      endX = startX + 1000 + Math.random() * 500
      endY = startY + (Math.random() - 0.5) * 400
      break
    case 3: // From right to left
      startX = window.innerWidth - Math.random() * 100
      startY = Math.random() * window.innerHeight
      endX = startX - 1000 - Math.random() * 500
      endY = startY + (Math.random() - 0.5) * 400
      break
    default:
      startX = 0
      startY = 0
      endX = 800
      endY = 600
  }

  // Calculate angle for tail rotation
  const deltaX = endX - startX
  const deltaY = endY - startY
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

  return {
    id: `shooting-star-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    startX,
    startY,
    endX,
    endY,
    size: 1 + Math.random() * 2,
    duration: 1.5 + Math.random() * 1.5, // 1.5-3 seconds
    delay: 0,
    active: true,
    angle // Add angle property
  }
}

// Shooting stars state
const shootingStars = ref<ShootingStar[]>([])

// Create shooting star periodically
const createShootingStar = () => {
  const newStar = generateShootingStar()
  shootingStars.value.push(newStar)

  // Remove shooting star after animation completes
  setTimeout(() => {
    const index = shootingStars.value.findIndex(star => star.id === newStar.id)
    if (index > -1) {
      shootingStars.value.splice(index, 1)
    }
  }, (newStar.duration + newStar.delay) * 1000 + 500) // Add 500ms buffer
}

// Setup shooting star interval
onMounted(() => {
  // Create shooting star every 3-8 seconds
  const createShootingStarInterval = () => {
    createShootingStar()
    const nextInterval = 3000 + Math.random() * 5000 // 3-8 seconds
    setTimeout(createShootingStarInterval, nextInterval)
  }

  // Start after initial delay
  setTimeout(createShootingStarInterval, 2000)
})
</script>

<template>
  <div class="absolute pointer-events-none z-[-1] inset-y-0 inset-x-5 sm:inset-x-7 lg:inset-x-9 overflow-hidden">
    <div class="stars size-full absolute inset-x-0 top-0">
      <div
        v-for="(layer, index) in starLayers"
        :key="index"
        class="star-layer"
        :style="{
          '--star-duration': `${layer.duration}s`,
          '--star-opacity': layer.opacity,
          '--star-color': color
        }"
      >
        <div
          v-for="(star, starIndex) in layer.stars"
          :key="starIndex"
          class="star absolute rounded-full"
          :style="{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'var(--star-color)',
            opacity: 'var(--star-opacity)'
          }"
        />
      </div>
    </div>

    <!-- Shooting Stars -->
    <div class="shooting-stars-container absolute inset-0">
      <div
        v-for="shootingStar in shootingStars"
        :key="shootingStar.id"
        class="shooting-star"
        :style="{
          '--start-x': `${shootingStar.startX}px`,
          '--start-y': `${shootingStar.startY}px`,
          '--end-x': `${shootingStar.endX}px`,
          '--end-y': `${shootingStar.endY}px`,
          '--duration': `${shootingStar.duration}s`,
          '--delay': `${shootingStar.delay}s`,
          '--size': `${shootingStar.size}px`,
          '--color': color,
          '--angle': `${shootingStar.angle}deg`
        }"
      >
        <div class="shooting-star-core" />
        <div class="shooting-star-tail" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stars {
  left: 50%;
  transform: translate(-50%);
  -webkit-mask-image: linear-gradient(
    180deg,
    rgba(217, 217, 217, 0) 0%,
    rgba(217, 217, 217, 0.8) 25%,
    #d9d9d9 50%,
    rgba(217, 217, 217, 0.8) 75%,
    rgba(217, 217, 217, 0) 100%
  );
  mask-image: linear-gradient(
    180deg,
    rgba(217, 217, 217, 0) 0%,
    rgba(217, 217, 217, 0.8) 25%,
    #d9d9d9 50%,
    rgba(217, 217, 217, 0.8) 75%,
    rgba(217, 217, 217, 0) 100%
  );
  -webkit-mask-size: cover;
  mask-size: cover;
}

.star-layer {
  animation: risingStarsAnimation linear infinite;
  animation-duration: var(--star-duration);
  will-change: transform;
}

@keyframes risingStarsAnimation {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2000px);
  }
}

/* Shooting Star Styles */
.shooting-stars-container {
  overflow: hidden;
}

.shooting-star {
  position: absolute;
  left: var(--start-x);
  top: var(--start-y);
  width: var(--size);
  height: var(--size);
  animation: shootingStarMove var(--duration) linear var(--delay) forwards;
  will-change: transform;
}

.shooting-star-core {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 0%,
    var(--color) 30%,
    var(--color) 70%,
    transparent 100%
  );
  border-radius: 50%;
  box-shadow:
    0 0 4px rgba(255, 255, 255, 0.8),
    0 0 8px var(--color),
    0 0 16px var(--color),
    0 0 24px rgba(255, 255, 255, 0.4),
    0 0 32px var(--color);
  animation: shootingStarGlow var(--duration) ease-out var(--delay) forwards;
}

.shooting-star-tail {
  position: absolute;
  width: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.9) 0%,
    var(--color) 15%,
    rgba(255, 255, 255, 0.6) 40%,
    var(--color) 60%,
    rgba(255, 255, 255, 0.3) 80%,
    transparent 100%
  );
  top: 50%;
  left: 100%;
  transform: translateY(-50%) rotate(var(--angle));
  transform-origin: left center;
  animation: shootingStarTail var(--duration) ease-out var(--delay) forwards;
  filter: blur(0.8px);
  border-radius: 2px;
}

.shooting-star-tail::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.4) 0%,
    var(--color) 20%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  filter: blur(1.5px);
  border-radius: 3px;
}

.shooting-star-tail::after {
  content: '';
  position: absolute;
  top: 0.5px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.8) 30%,
    rgba(255, 255, 255, 0.4) 70%,
    transparent 100%
  );
  filter: blur(0.2px);
}

@keyframes shootingStarMove {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(var(--end-x) - var(--start-x)),
      calc(var(--end-y) - var(--start-y))
    );
    opacity: 0;
  }
}

@keyframes shootingStarGlow {
  0% {
    transform: scale(0.3);
    opacity: 0;
    filter: brightness(0.5);
  }
  5% {
    transform: scale(0.8);
    opacity: 0.6;
    filter: brightness(1.2);
  }
  15% {
    transform: scale(1.2);
    opacity: 1;
    filter: brightness(1.5);
  }
  25% {
    transform: scale(1);
    opacity: 1;
    filter: brightness(1.3);
  }
  75% {
    transform: scale(1);
    opacity: 1;
    filter: brightness(1.1);
  }
  90% {
    transform: scale(0.9);
    opacity: 0.8;
    filter: brightness(0.9);
  }
  100% {
    transform: scale(0.6);
    opacity: 0;
    filter: brightness(0.5);
  }
}

@keyframes shootingStarTail {
  0% {
    width: 0;
    opacity: 0;
    filter: brightness(0.5);
  }
  5% {
    width: 10px;
    opacity: 0.4;
    filter: brightness(0.8);
  }
  15% {
    width: 40px;
    opacity: 0.9;
    filter: brightness(1.3);
  }
  30% {
    width: 80px;
    opacity: 1;
    filter: brightness(1.2);
  }
  60% {
    width: 120px;
    opacity: 1;
    filter: brightness(1.1);
  }
  80% {
    width: 160px;
    opacity: 0.8;
    filter: brightness(0.9);
  }
  95% {
    width: 200px;
    opacity: 0.3;
    filter: brightness(0.7);
  }
  100% {
    width: 220px;
    opacity: 0;
    filter: brightness(0.5);
  }
}
</style>
