<template>
  <div
    ref="containerRef"
    class="pixel-reveal-container relative"
  >
    <canvas
      ref="canvasRef"
      class="w-full object-contain"
      :class="[
        revealComplete ? 'cursor-pointer hover:opacity-90 transition-opacity' : '',
        customClass
      ]"
      @click="revealComplete && $emit('click')"
    />
    <img
      ref="imageRef"
      :src="src"
      class="hidden"
      :alt="alt"
      @load="onImageLoad"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  pixelSize: {
    type: Number,
    default: 12 // Size of each pixel block (increased for more visible effect)
  },
  revealSpeed: {
    type: Number,
    default: 20 // Pixels to reveal per frame (reduced for more dramatic effect)
  },
  revealDelay: {
    type: Number,
    default: 0 // Delay before starting the reveal effect (ms)
  },
  customClass: {
    type: String,
    default: ''
  },
  revealPattern: {
    type: String as () => 'random' | 'center' | 'top-down' | 'left-right',
    default: 'center'
  }
})

const emit = defineEmits(['loaded', 'reveal-complete', 'click', 'processing'])
const { t } = useI18n()

// Refs
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const revealComplete = ref(false)
const isImageLoaded = ref(false)

// Animation state
let animationFrameId: number | null = null
const revealedPixels: Set<number> = new Set()
let totalPixels = 0
let pixelIndices: number[] = []
let ctx: CanvasRenderingContext2D | null = null
let startTime = 0
const ANIMATION_DURATION = 2000 // 1 second in milliseconds

// Computed
const pixelSizeActual = computed(() => {
  return Math.max(2, Math.min(props.pixelSize, 20)) // Limit between 2 and 20
})

// Watch for src changes to reset and restart the effect
watch(() => props.src, () => {
  resetReveal()
  isImageLoaded.value = false
  revealComplete.value = false

  // If image is already in cache, it might not trigger onload
  if (imageRef.value?.complete) {
    onImageLoad()
  }
}, { immediate: false })

// Initialize canvas and start reveal effect when image loads
function onImageLoad() {
  isImageLoaded.value = true

  // Wait for the next tick to ensure the canvas is ready
  setTimeout(() => {
    initCanvas()

    // Start the reveal effect after the specified delay
    setTimeout(() => {
      startReveal()
    }, props.revealDelay)
  }, 0)

  emit('loaded', { message: t('pixelReveal.loading') })
}

// Initialize the canvas with the image dimensions
function initCanvas() {
  if (!canvasRef.value || !imageRef.value || !containerRef.value) return

  const canvas = canvasRef.value
  const container = containerRef.value

  // Set canvas dimensions to match container width while preserving image aspect ratio
  canvas.width = container.clientWidth

  // Calculate height based on image aspect ratio to maintain proportions
  const img = imageRef.value
  const aspectRatio = img.naturalWidth / img.naturalHeight
  canvas.height = canvas.width / aspectRatio

  ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Calculate grid dimensions
  const gridWidth = Math.ceil(canvas.width / pixelSizeActual.value)
  const gridHeight = Math.ceil(canvas.height / pixelSizeActual.value)
  totalPixels = gridWidth * gridHeight

  // Create array of pixel indices
  pixelIndices = Array.from({ length: totalPixels }, (_, i) => i)

  // Apply different reveal patterns based on the prop
  const centerX = Math.floor(gridWidth / 2)
  const centerY = Math.floor(gridHeight / 2)

  switch (props.revealPattern) {
    case 'random':
      // Completely random pattern
      shuffleArray(pixelIndices)
      break

    case 'center':
      // Reveal from center outward (spiral pattern)
      pixelIndices.sort((a, b) => {
        const aX = a % gridWidth
        const aY = Math.floor(a / gridWidth)
        const bX = b % gridWidth
        const bY = Math.floor(b / gridWidth)

        const distA = Math.sqrt(Math.pow(aX - centerX, 2) + Math.pow(aY - centerY, 2))
        const distB = Math.sqrt(Math.pow(bX - centerX, 2) + Math.pow(bY - centerY, 2))

        // Add some randomness to avoid perfect circles
        return (distA + Math.random() * 3) - (distB + Math.random() * 3)
      })
      break

    case 'top-down':
      // Reveal from top to bottom with some randomness
      pixelIndices.sort((a, b) => {
        const aY = Math.floor(a / gridWidth)
        const bY = Math.floor(b / gridWidth)
        return (aY + Math.random() * 2) - (bY + Math.random() * 2)
      })
      break

    case 'left-right':
      // Reveal from left to right with some randomness
      pixelIndices.sort((a, b) => {
        const aX = a % gridWidth
        const bX = b % gridWidth
        return (aX + Math.random() * 2) - (bX + Math.random() * 2)
      })
      break
  }

  // Reset revealed pixels
  revealedPixels.clear()
}

// Start the reveal animation
function startReveal() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  // Emit processing message
  emit('processing', { message: t('pixelReveal.processing') })

  // Record start time for duration calculation
  startTime = performance.now()

  animationFrameId = requestAnimationFrame(animateReveal)
}

// Reset the reveal effect
function resetReveal() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  revealedPixels.clear()

  if (canvasRef.value && ctx) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}

// Animate the reveal effect
function animateReveal(timestamp: number) {
  if (!ctx || !canvasRef.value || !imageRef.value) return

  const canvas = canvasRef.value
  const img = imageRef.value

  // Calculate elapsed time and progress (0 to 1)
  const elapsedTime = timestamp - startTime
  const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1)

  // Calculate how many pixels to reveal based on progress
  const totalPixelsToReveal = Math.floor(totalPixels * progress)
  const newPixelsToReveal = Math.min(
    props.revealSpeed,
    totalPixelsToReveal - revealedPixels.size
  )

  // Reveal new pixels
  for (let i = 0; i < newPixelsToReveal; i++) {
    if (revealedPixels.size >= totalPixels) break

    const pixelIndex = pixelIndices[revealedPixels.size]
    if (pixelIndex !== undefined) {
      revealedPixels.add(pixelIndex)

      // Calculate grid position
      const gridWidth = Math.ceil(canvas.width / pixelSizeActual.value)
      const x = (pixelIndex % gridWidth) * pixelSizeActual.value
      const y = Math.floor(pixelIndex / gridWidth) * pixelSizeActual.value

      // Draw the pixel from the image
      drawPixelFromImage(x, y)
    }
  }

  // Continue animation if not all pixels are revealed and animation time hasn't finished
  if (revealedPixels.size < totalPixels && progress < 1) {
    animationFrameId = requestAnimationFrame(animateReveal)
  } else {
    // Animation complete, draw the full image for better quality
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    revealComplete.value = true
    emit('reveal-complete', { message: t('pixelReveal.revealComplete') })
  }
}

// Draw a single pixel from the image
function drawPixelFromImage(x: number, y: number) {
  if (!ctx || !canvasRef.value || !imageRef.value) return

  const canvas = canvasRef.value
  const img = imageRef.value
  const pixelSize = pixelSizeActual.value

  // Calculate source and destination dimensions
  const dWidth = Math.min(pixelSize, canvas.width - x)
  const dHeight = Math.min(pixelSize, canvas.height - y)

  // Calculate source coordinates (proportional to the image)
  const sx = (x / canvas.width) * img.naturalWidth
  const sy = (y / canvas.height) * img.naturalHeight
  const sWidth = (dWidth / canvas.width) * img.naturalWidth
  const sHeight = (dHeight / canvas.height) * img.naturalHeight

  // Draw the pixel with a slight border to make the pixel effect more visible
  ctx.save()

  // Draw the actual image pixel
  ctx.drawImage(
    img,
    sx, sy, sWidth, sHeight,
    x, y, dWidth, dHeight
  )

  // Optional: Add a subtle grid effect to make pixels more visible
  if (pixelSize > 4) {
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.lineWidth = 0.5
    ctx.strokeRect(x, y, dWidth, dHeight)
  }

  ctx.restore()
}

// Utility function to shuffle an array
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Handle window resize
function handleResize() {
  if (isImageLoaded.value) {
    initCanvas()

    // If reveal was complete, immediately show the full image
    if (revealComplete.value && ctx && canvasRef.value && imageRef.value) {
      ctx.drawImage(imageRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height)
    } else {
      // Otherwise restart the reveal animation
      startReveal()
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.pixel-reveal-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
