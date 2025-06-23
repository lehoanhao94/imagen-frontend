export const useVideoGenOptions = () => {
  // Fixed duration at 8 seconds (no options needed)
  const duration = ref(8)

  // Default person generation
  const personGeneration = ref('DONT_ALLOW')

  // Aspect ratio options (kept for backward compatibility, but use videoDimensions instead)
  const aspectRatioOptions = [
    { label: '16:9 (Landscape)', value: '16:9' },
    { label: '9:16 (Portrait)', value: '9:16' },
    { label: '1:1 (Square)', value: '1:1' },
    { label: '4:3 (Standard)', value: '4:3' },
    { label: '3:4 (Portrait)', value: '3:4' }
  ]

  // Default aspect ratio
  const aspectRatio = ref('16:9')

  // Enhance prompt option
  const enhancePrompt = ref(true)

  return {
    // Duration (fixed at 8 seconds)
    duration,

    // Person generation
    personGeneration,
    // Aspect ratio (backward compatibility)
    aspectRatio,
    aspectRatioOptions,

    // Enhance prompt
    enhancePrompt
  }
}
