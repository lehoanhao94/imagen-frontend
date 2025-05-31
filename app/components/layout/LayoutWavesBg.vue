<script setup lang="ts">
import { onMounted } from 'vue'

// Use the Nuxt color mode instead of VueUse to ensure consistency
const colorMode = useColorMode()

/**
 * You can pass in a random number generator object if you like.
 * It is assumed to have a random() method.
 */
const ClassicalNoise = function (r) {
  // Classic Perlin noise in 3D, for comparison
  if (r == undefined) r = Math
  this.grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1]
  ]
  this.p = []
  for (var i = 0; i < 256; i++) {
    this.p[i] = Math.floor(r.random() * 256)
  }
  // To remove the need for index wrapping, double the permutation table length
  this.perm = []
  for (var i = 0; i < 512; i++) {
    this.perm[i] = this.p[i & 255]
  }
}

ClassicalNoise.prototype.dot = function (g, x, y, z) {
  return g[0] * x + g[1] * y + g[2] * z
}

ClassicalNoise.prototype.mix = function (a, b, t) {
  return (1.0 - t) * a + t * b
}

ClassicalNoise.prototype.fade = function (t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)
}

// Classic Perlin noise, 3D version
ClassicalNoise.prototype.noise = function (x, y, z) {
  // Find unit grid cell containing point
  let X = Math.floor(x)
  let Y = Math.floor(y)
  let Z = Math.floor(z)

  // Get relative xyz coordinates of point within that cell
  x = x - X
  y = y - Y
  z = z - Z

  // Wrap the integer cells at 255 (smaller integer period can be introduced here)
  X = X & 255
  Y = Y & 255
  Z = Z & 255

  // Calculate a set of eight hashed gradient indices
  const gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12
  const gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12
  const gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12
  const gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12
  const gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12
  const gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12
  const gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12
  const gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12

  // The gradients of each corner are now:
  // g000 = grad3[gi000];
  // g001 = grad3[gi001];
  // g010 = grad3[gi010];
  // g011 = grad3[gi011];
  // g100 = grad3[gi100];
  // g101 = grad3[gi101];
  // g110 = grad3[gi110];
  // g111 = grad3[gi111];
  // Calculate noise contributions from each of the eight corners
  const n000 = this.dot(this.grad3[gi000], x, y, z)
  const n100 = this.dot(this.grad3[gi100], x - 1, y, z)
  const n010 = this.dot(this.grad3[gi010], x, y - 1, z)
  const n110 = this.dot(this.grad3[gi110], x - 1, y - 1, z)
  const n001 = this.dot(this.grad3[gi001], x, y, z - 1)
  const n101 = this.dot(this.grad3[gi101], x - 1, y, z - 1)
  const n011 = this.dot(this.grad3[gi011], x, y - 1, z - 1)
  const n111 = this.dot(this.grad3[gi111], x - 1, y - 1, z - 1)
  // Compute the fade curve value for each of x, y, z
  const u = this.fade(x)
  const v = this.fade(y)
  const w = this.fade(z)
  // Interpolate along x the contributions from each of the corners
  const nx00 = this.mix(n000, n100, u)
  const nx01 = this.mix(n001, n101, u)
  const nx10 = this.mix(n010, n110, u)
  const nx11 = this.mix(n011, n111, u)
  // Interpolate the four results along y
  const nxy0 = this.mix(nx00, nx10, v)
  const nxy1 = this.mix(nx01, nx11, v)
  // Interpolate the two last results along z
  const nxyz = this.mix(nxy0, nxy1, w)

  return nxyz
}
onMounted(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const perlin = new ClassicalNoise()
  const variation = 0.0025
  const amp = 200 // Reduced amplitude for better performance
  const variators: number[] = []

  // Reduced max_lines for better performance
  const max_lines = navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 15 : 25

  let canvasWidth: number
  let canvasHeight: number
  let start_y: number
  let animationId: number

  // Performance optimization: Pre-calculate colors
  const colorCache = new Map<string, string>()

  // Throttle resize events
  let resizeTimeout: NodeJS.Timeout

  for (let i = 0, u = 0; i < max_lines; i++, u += 0.02) {
    variators[i] = u
  }

  // Pre-calculate blue colors for better performance
  function getColorForWave(i: number, isDark: boolean): string {
    const cacheKey = `${i}-${isDark}`
    if (colorCache.has(cacheKey)) {
      return colorCache.get(cacheKey)!
    }

    const waveProgress = i / max_lines

    let color: string
    if (isDark) {
      // Dark mode: Light blue to deep blue gradient
      const lightness = 70 - (waveProgress * 30) // 70% to 40%
      const saturation = 60 + (waveProgress * 30) // 60% to 90%
      const alpha = 0.3 + (waveProgress * 0.4) // 0.3 to 0.7
      color = `hsla(210, ${saturation}%, ${lightness}%, ${alpha})`
    } else {
      // Light mode: Medium blue to dark blue gradient
      const lightness = 50 - (waveProgress * 25) // 50% to 25%
      const saturation = 70 + (waveProgress * 20) // 70% to 90%
      const alpha = 0.4 + (waveProgress * 0.5) // 0.4 to 0.9
      color = `hsla(210, ${saturation}%, ${lightness}%, ${alpha})`
    }

    colorCache.set(cacheKey, color)
    return color
  }

  function draw() {
    const isDark = colorMode.value === 'dark'

    // Blue-only shadow setup
    ctx.shadowColor = isDark ? 'rgba(100, 150, 255, 0.4)' : 'rgba(50, 100, 200, 0.3)'
    ctx.shadowBlur = 10 // Reduced blur for better performance

    // Simplified blend mode
    ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over'

    // Optimized drawing with reduced calculations
    for (let i = 0; i < max_lines; i += 2) { // Skip every other line for performance
      ctx.beginPath()
      ctx.moveTo(0, start_y)

      // Reduced point density for better performance
      for (let x = 0; x <= canvasWidth; x += 3) {
        const y = perlin.noise(x * variation + variators[i], x * variation, 0)
        ctx.lineTo(x, start_y + amp * y)
      }

      // Use cached colors
      const strokeStyle = getColorForWave(i, isDark)
      ctx.strokeStyle = strokeStyle
      ctx.lineWidth = isDark ? 1 : 1.5

      // Simplified glow effect
      if (i % 6 === 0) {
        ctx.shadowBlur = 15
      } else {
        ctx.shadowBlur = 5
      }

      ctx.stroke()
      variators[i] += 0.003 // Slower animation for smoother performance
    }

    // Reset blend mode
    ctx.globalCompositeOperation = 'source-over'
  }

  // Optimized animate function with adaptive frame rate
  let lastTime = 0
  const targetFPS = 30 // Reduced from 60fps for better performance
  const frameInterval = 1000 / targetFPS

  function animate(currentTime: number = 0) {
    // Throttle to target FPS
    if (currentTime - lastTime >= frameInterval) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      draw()
      lastTime = currentTime
    }

    animationId = requestAnimationFrame(animate)
  }

  // Throttled resize function
  function resizeCanvas() {
    canvasWidth = document.documentElement.clientWidth
    canvasHeight = document.documentElement.clientHeight

    canvas.setAttribute('width', canvasWidth.toString())
    canvas.setAttribute('height', canvasHeight.toString())

    start_y = canvasHeight / 2

    // Clear color cache on resize
    colorCache.clear()
  }

  function throttledResize() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    resizeTimeout = setTimeout(resizeCanvas, 100)
  }

  // Initialize
  function init() {
    resizeCanvas()
    animate()
    window.addEventListener('resize', throttledResize)
  }

  init()

  // Cleanup on unmount
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    window.removeEventListener('resize', throttledResize)
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
  }
})
</script>

<template>
  <div
    class="absolute pointer-events-none z-[-1] -inset-y-50 inset-x-0 sm:inset-x-0 lg:inset-x-0 overflow-hidden"
  >
    <canvas id="canvas" />
  </div>
</template>
