<template>
  <div class="magic-image-container relative">
    <canvas
      ref="canvas"
      class="w-full h-full"
    />
    <div
      v-if="loading"
      class="loading-overlay absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white"
    >
      <span class="text-lg mb-2">{{ loadingText }}</span>
      <div class="progress-container w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          class="progress-bar h-full bg-primary"
          :style="{ width: `${loadingProgress}%` }"
        />
      </div>
    </div>
    <div
      v-if="showControls"
      class="controls absolute bottom-4 left-1/2 transform -translate-x-1/2"
    >
      <UButton
        :disabled="isTransforming"
        @click="triggerTransformation"
      >
        {{ isTransforming ? 'Transforming...' : 'Transform' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { createNoise3D, createNoise4D } from 'simplex-noise'

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  particleCount: {
    type: Number,
    default: 20000
  },
  particleSize: {
    type: Number,
    default: 0.15
  },
  particleSizeRange: {
    type: Array,
    default: () => [0.08, 0.25]
  },
  transformationDuration: {
    type: Number,
    default: 3000
  },
  autoTransform: {
    type: Boolean,
    default: false
  },
  showControls: {
    type: Boolean,
    default: true
  }
})

// Expose methods to parent component
const emit = defineEmits(['transformationComplete'])

// Method to be called when the image is ready to transform
function startTransformation() {
  if (!isTransforming.value) {
    triggerTransformation()
  }
}

const canvas = ref(null)
const loading = ref(true)
const loadingText = ref('Initializing particles...')
const loadingProgress = ref(0)
const isTransforming = ref(false)

// Three.js variables
let scene, camera, renderer, controls, clock
let composer, bloomPass
let particlesGeometry, particlesMaterial, particleSystem
let currentPositions, sourcePositions, targetPositions, randomPositions
let particleSizes, particleOpacities, particleEffectStrengths
let noise3D, noise4D
let animationFrameId = null
let imageTexture = null

// Temporary vectors for calculations
const tempVec = new THREE.Vector3()
const sourceVec = new THREE.Vector3()
const targetVec = new THREE.Vector3()
const randomVec = new THREE.Vector3()
const noiseOffset = new THREE.Vector3()
const swirlAxis = new THREE.Vector3()

// Configuration
const CONFIG = {
  particleCount: props.particleCount,
  particleSizeRange: props.particleSizeRange,
  transformationDuration: props.transformationDuration,
  noiseFrequency: 0.1,
  noiseTimeScale: 0.04,
  noiseMaxStrength: 2.8,
  swirlFactor: 4.0,
  bloomStrength: 1.3,
  bloomRadius: 0.5,
  bloomThreshold: 0.05,
  idleFlowStrength: 0.5, // Increased for more movement in idle state
  idleFlowSpeed: 0.12, // Increased for faster movement
  idleRotationSpeed: 0.02,
  morphSizeFactor: 0.5,
  morphBrightnessFactor: 0.6,
  initialNoiseScale: 0.08, // Scale for initial noise pattern
  initialNoiseSpeed: 0.15 // Speed for initial noise animation
}

// Animation state
const transformState = { progress: 0.0 }
let transformationTimeline = null

onMounted(async () => {
  await initScene()
  animate()

  if (props.autoTransform) {
    setTimeout(() => {
      triggerTransformation()
    }, 1000)
  }
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  // Clean up resources
  if (particlesGeometry) particlesGeometry.dispose()
  if (particlesMaterial) particlesMaterial.dispose()
  if (imageTexture) imageTexture.dispose()
  if (renderer) renderer.dispose()
})

watch(() => props.imageUrl, async () => {
  if (scene && particleSystem) {
    // Load new image when URL changes
    await loadImageAsTexture(props.imageUrl)
    generateTargetPositionsFromImage()
  }
})

async function initScene() {
  updateLoadingProgress(0, 'Setting up scene...')

  // Initialize basic Three.js components
  clock = new THREE.Clock()
  noise3D = createNoise3D(() => Math.random())
  noise4D = createNoise4D(() => Math.random())

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000308, 0.03)

  updateLoadingProgress(10, 'Creating camera...')

  // Set up camera
  const container = canvas.value.parentElement
  const aspect = container.clientWidth / container.clientHeight
  camera = new THREE.PerspectiveCamera(70, aspect, 0.1, 1000)
  camera.position.set(0, 0, 15)
  camera.lookAt(scene.position)

  updateLoadingProgress(20, 'Setting up renderer...')

  // Set up renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  updateLoadingProgress(30, 'Setting up controls...')

  // Set up fixed camera without controls
  // We're removing OrbitControls as per requirement
  // The camera will be fixed, no zoom or rotation allowed
  camera.position.set(0, 0, 15)
  camera.lookAt(0, 0, 0)

  updateLoadingProgress(40, 'Setting up post-processing...')

  // Set up post-processing
  composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    CONFIG.bloomStrength,
    CONFIG.bloomRadius,
    CONFIG.bloomThreshold
  )
  composer.addPass(bloomPass)

  updateLoadingProgress(50, 'Loading image...')

  // Load the image
  await loadImageAsTexture(props.imageUrl)

  updateLoadingProgress(70, 'Creating particle system...')

  // Set up particle system
  await setupParticleSystem()

  updateLoadingProgress(90, 'Adding event listeners...')

  // Add event listeners
  window.addEventListener('resize', onWindowResize)

  updateLoadingProgress(100, 'Ready!')
  loading.value = false
}

async function loadImageAsTexture(url) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader()
    loader.load(
      url,
      (texture) => {
        imageTexture = texture
        resolve(texture)
      },
      undefined,
      (error) => {
        console.error('Error loading image:', error)
        reject(error)
      }
    )
  })
}

function updateLoadingProgress(progress, text = null) {
  loadingProgress.value = progress
  if (text) {
    loadingText.value = text
  }
}

function onWindowResize() {
  if (!canvas.value) return

  const container = canvas.value.parentElement
  const width = container.clientWidth
  const height = container.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  composer.setSize(width, height)
}

function createPointTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32

  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)')
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.4)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, 32, 32)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

async function setupParticleSystem() {
  // Create geometry for particles
  particlesGeometry = new THREE.BufferGeometry()

  // Generate random positions for initial state with noise pattern
  randomPositions = new Float32Array(CONFIG.particleCount * 3)

  // Create a more interesting noise pattern for initial state
  const noiseScale = 0.05
  for (let i = 0; i < CONFIG.particleCount; i++) {
    const i3 = i * 3

    // Use noise to create a more natural-looking distribution
    const angle = Math.random() * Math.PI * 2
    const radius = 10 * Math.random()
    const height = (Math.random() - 0.5) * 10

    // Add some noise variation
    const noiseValue = noise3D(
      Math.cos(angle) * noiseScale * 10,
      Math.sin(angle) * noiseScale * 10,
      height * noiseScale
    )

    // Position with noise influence
    randomPositions[i3] = Math.cos(angle) * radius * (1 + noiseValue * 0.5)
    randomPositions[i3 + 1] = Math.sin(angle) * radius * (1 + noiseValue * 0.5)
    randomPositions[i3 + 2] = height + noiseValue * 5
  }

  // Generate target positions from the image
  await generateTargetPositionsFromImage()

  // Set current positions to random positions initially
  currentPositions = new Float32Array(randomPositions)
  sourcePositions = new Float32Array(randomPositions)

  // Set position attribute
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))

  // Create attributes for particle appearance
  particleSizes = new Float32Array(CONFIG.particleCount)
  particleOpacities = new Float32Array(CONFIG.particleCount)
  particleEffectStrengths = new Float32Array(CONFIG.particleCount)

  for (let i = 0; i < CONFIG.particleCount; i++) {
    particleSizes[i] = THREE.MathUtils.randFloat(CONFIG.particleSizeRange[0], CONFIG.particleSizeRange[1])
    particleOpacities[i] = 1.0
    particleEffectStrengths[i] = 0.0
  }

  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
  particlesGeometry.setAttribute('opacity', new THREE.BufferAttribute(particleOpacities, 1))
  particlesGeometry.setAttribute('aEffectStrength', new THREE.BufferAttribute(particleEffectStrengths, 1))

  // Create colors for particles
  const colors = new Float32Array(CONFIG.particleCount * 3)
  updateColorArray(colors)
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // Create material with custom shaders
  particlesMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: createPointTexture() }
    },
    vertexShader: `
      attribute float size;
      attribute float opacity;
      attribute float aEffectStrength;
      varying vec3 vColor;
      varying float vOpacity;
      varying float vEffectStrength;

      void main() {
        vColor = color;
        vOpacity = opacity;
        vEffectStrength = aEffectStrength;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

        float sizeScale = 1.0 - vEffectStrength * ${CONFIG.morphSizeFactor.toFixed(2)};
        gl_PointSize = size * sizeScale * (400.0 / -mvPosition.z);

        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      varying float vOpacity;
      varying float vEffectStrength;

      void main() {
        float alpha = texture2D(pointTexture, gl_PointCoord).a;
        if (alpha < 0.05) discard;

        vec3 finalColor = vColor * (1.0 + vEffectStrength * ${CONFIG.morphBrightnessFactor.toFixed(2)});

        gl_FragColor = vec4(finalColor, alpha * vOpacity);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    transparent: true,
    vertexColors: true
  })

  // Create particle system and add to scene
  particleSystem = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particleSystem)
}

async function generateTargetPositionsFromImage() {
  if (!imageTexture) return

  // Create a canvas to extract pixel data
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // Set canvas dimensions to match image
  const imgWidth = imageTexture.image.width
  const imgHeight = imageTexture.image.height
  canvas.width = imgWidth
  canvas.height = imgHeight

  // Draw image to canvas
  ctx.drawImage(imageTexture.image, 0, 0)

  // Get image data
  const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight)
  const pixels = imageData.data

  // Create target positions array
  targetPositions = new Float32Array(CONFIG.particleCount * 3)

  // Calculate aspect ratio to maintain image proportions
  const aspectRatio = imgWidth / imgHeight
  const scale = 10 // Scale factor for the image size
  const width = aspectRatio > 1 ? scale : scale * aspectRatio
  const height = aspectRatio > 1 ? scale / aspectRatio : scale

  // Sample pixels and create positions
  const pixelSkip = Math.max(1, Math.floor(Math.sqrt((imgWidth * imgHeight) / CONFIG.particleCount)))
  let particleIndex = 0

  for (let y = 0; y < imgHeight && particleIndex < CONFIG.particleCount; y += pixelSkip) {
    for (let x = 0; x < imgWidth && particleIndex < CONFIG.particleCount; x += pixelSkip) {
      const i = (y * imgWidth + x) * 4

      // Skip transparent or very dark pixels
      const alpha = pixels[i + 3]
      const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3

      if (alpha > 128 && brightness > 20) {
        const i3 = particleIndex * 3

        // Map pixel coordinates to 3D space
        const nx = (x / imgWidth - 0.5) * width
        const ny = (0.5 - y / imgHeight) * height // Flip Y to match 3D coordinates

        // Use brightness for Z depth (brighter pixels come forward)
        const nz = (brightness / 255) * 2

        targetPositions[i3] = nx
        targetPositions[i3 + 1] = ny
        targetPositions[i3 + 2] = nz

        particleIndex++
      }
    }
  }

  // Fill remaining particles if needed
  while (particleIndex < CONFIG.particleCount) {
    const i3 = particleIndex * 3
    targetPositions[i3] = (Math.random() - 0.5) * width
    targetPositions[i3 + 1] = (Math.random() - 0.5) * height
    targetPositions[i3 + 2] = (Math.random() - 0.5) * 2
    particleIndex++
  }
}

function updateColorArray(colors) {
  // Create a gradient of colors based on position
  for (let i = 0; i < CONFIG.particleCount; i++) {
    const i3 = i * 3

    // Get normalized position
    tempVec.fromArray(currentPositions, i3)
    const dist = tempVec.length() / 10 // Normalize by max distance

    // Create color based on position
    let hue, saturation, lightness

    // Use noise for variation
    const noiseValue = (noise3D(tempVec.x * 0.2, tempVec.y * 0.2, tempVec.z * 0.2) + 1) * 0.5

    // Create a fire-like gradient
    hue = THREE.MathUtils.mapLinear(dist, 0, 1, 0, 60) // Red to yellow
    saturation = 0.9
    lightness = 0.5 + noiseValue * 0.3

    const color = new THREE.Color().setHSL(hue / 360, saturation, lightness)
    color.toArray(colors, i3)
  }
}

function triggerTransformation() {
  if (isTransforming.value) return

  isTransforming.value = true

  // Store current positions as source
  sourcePositions.set(currentPositions)

  // Reset transformation state
  transformState.progress = 0

  // Create animation timeline
  if (transformationTimeline) {
    transformationTimeline.pause()
  }

  // Use anime.js for animation
  import('animejs').then((anime) => {
    transformationTimeline = anime.default({
      targets: transformState,
      progress: 1,
      duration: CONFIG.transformationDuration,
      easing: 'cubicBezier(0.4, 0.0, 0.2, 1.0)',
      complete: () => {
        isTransforming.value = false

        // Update current positions to target
        currentPositions.set(targetPositions)
        particlesGeometry.attributes.position.needsUpdate = true

        // Reset effect strengths
        particleEffectStrengths.fill(0.0)
        particlesGeometry.attributes.aEffectStrength.needsUpdate = true

        // Update source positions
        sourcePositions.set(targetPositions)

        // Update colors
        updateColorArray(particlesGeometry.attributes.color.array)
        particlesGeometry.attributes.color.needsUpdate = true
      }
    })
  })
}

function animate() {
  animationFrameId = requestAnimationFrame(animate)

  if (!scene || !camera || !renderer) return

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = clock.getDelta()

  // No controls to update since we removed OrbitControls

  const positions = particlesGeometry.attributes.position.array
  const effectStrengths = particlesGeometry.attributes.aEffectStrength.array

  if (isTransforming.value) {
    updateTransformationAnimation(positions, effectStrengths, elapsedTime, deltaTime)
  } else {
    updateIdleAnimation(positions, effectStrengths, elapsedTime, deltaTime)
  }

  particlesGeometry.attributes.position.needsUpdate = true

  if (isTransforming.value || particlesGeometry.attributes.aEffectStrength.needsUpdate) {
    particlesGeometry.attributes.aEffectStrength.needsUpdate = true
  }

  composer.render(deltaTime)
}

function updateTransformationAnimation(positions, effectStrengths, elapsedTime, deltaTime) {
  const t = transformState.progress
  const effectStrength = Math.sin(t * Math.PI)
  const currentSwirl = effectStrength * CONFIG.swirlFactor * deltaTime * 50
  const currentNoise = effectStrength * CONFIG.noiseMaxStrength

  for (let i = 0; i < CONFIG.particleCount; i++) {
    const i3 = i * 3

    // Get source and target positions
    sourceVec.fromArray(sourcePositions, i3)
    targetVec.fromArray(targetPositions, i3)

    // Interpolate between source and target
    tempVec.lerpVectors(sourceVec, targetVec, t)

    // Add swirl effect
    if (currentSwirl > 0.01) {
      const swirlVec = new THREE.Vector3()
      swirlVec.subVectors(tempVec, sourceVec)

      // Create random rotation axis
      swirlAxis.set(
        noise3D(i * 0.02, elapsedTime * 0.1, 0),
        noise3D(0, i * 0.02, elapsedTime * 0.1 + 5),
        noise3D(elapsedTime * 0.1 + 10, 0, i * 0.02)
      ).normalize()

      // Apply rotation
      swirlVec.applyAxisAngle(swirlAxis, currentSwirl * (0.5 + Math.random() * 0.5))
      tempVec.copy(sourceVec).add(swirlVec)
    }

    // Add noise effect
    if (currentNoise > 0.01) {
      const noiseTime = elapsedTime * CONFIG.noiseTimeScale
      noiseOffset.set(
        noise4D(tempVec.x * CONFIG.noiseFrequency, tempVec.y * CONFIG.noiseFrequency, tempVec.z * CONFIG.noiseFrequency, noiseTime),
        noise4D(tempVec.x * CONFIG.noiseFrequency + 100, tempVec.y * CONFIG.noiseFrequency + 100, tempVec.z * CONFIG.noiseFrequency + 100, noiseTime),
        noise4D(tempVec.x * CONFIG.noiseFrequency + 200, tempVec.y * CONFIG.noiseFrequency + 200, tempVec.z * CONFIG.noiseFrequency + 200, noiseTime)
      )
      tempVec.addScaledVector(noiseOffset, currentNoise)
    }

    // Update position
    positions[i3] = tempVec.x
    positions[i3 + 1] = tempVec.y
    positions[i3 + 2] = tempVec.z

    // Update effect strength
    effectStrengths[i] = effectStrength
  }
}

function updateIdleAnimation(positions, effectStrengths, elapsedTime, deltaTime) {
  // Add more dynamic movement in idle state
  const freq = CONFIG.noiseFrequency * 0.8 // Increased frequency for more detail
  const timeScaled = elapsedTime * CONFIG.idleFlowSpeed
  const breathScale = 1.0 + Math.sin(elapsedTime * 0.2) * 0.05 // Increased breathing effect
  let needsEffectStrengthReset = false

  // Use noise time to create a more dynamic effect
  const noiseTime = elapsedTime * CONFIG.initialNoiseSpeed

  for (let i = 0; i < CONFIG.particleCount; i++) {
    const i3 = i * 3

    // For initial noise effect, we'll use a more chaotic pattern
    // instead of always moving toward the target image
    const useNoisePattern = Math.random() < 0.7 // 70% of particles use noise pattern

    if (useNoisePattern) {
      // Create a noise-based position
      const angle = noise3D(i * 0.01, noiseTime * 0.1, 0) * Math.PI * 2
      const radius = 8 + noise3D(0, i * 0.01, noiseTime * 0.1) * 4
      const height = noise3D(noiseTime * 0.1, 0, i * 0.01) * 8

      // Set target position based on noise
      tempVec.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        height
      )
    } else {
      // Get position from target image for some particles
      sourceVec.fromArray(targetPositions, i3)
      tempVec.copy(sourceVec).multiplyScalar(breathScale)
    }

    // Add flow effect with stronger influence
    const flowVec = new THREE.Vector3(
      noise4D(tempVec.x * freq, tempVec.y * freq, tempVec.z * freq, timeScaled),
      noise4D(tempVec.x * freq + 10, tempVec.y * freq + 10, tempVec.z * freq + 10, timeScaled),
      noise4D(tempVec.x * freq + 20, tempVec.y * freq + 20, tempVec.z * freq + 20, timeScaled)
    )
    tempVec.addScaledVector(flowVec, CONFIG.idleFlowStrength)

    // Smoothly interpolate current position with faster transition
    const currentVec = new THREE.Vector3().fromArray(positions, i3)
    currentVec.lerp(tempVec, 0.08) // Increased from 0.05 for faster movement

    // Update position
    positions[i3] = currentVec.x
    positions[i3 + 1] = currentVec.y
    positions[i3 + 2] = currentVec.z

    // Reset effect strength if needed
    if (effectStrengths[i] !== 0.0) {
      effectStrengths[i] = 0.0
      needsEffectStrengthReset = true
    }
  }

  if (needsEffectStrengthReset) {
    particlesGeometry.attributes.aEffectStrength.needsUpdate = true
  }
}
</script>

<style scoped>
.magic-image-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #000;
  overflow: hidden;
}

.loading-overlay {
  z-index: 10;
}

.progress-container {
  overflow: hidden;
  border-radius: 9999px;
}

.progress-bar {
  transition: width 0.3s ease;
}

.controls {
  z-index: 5;
}
</style>
