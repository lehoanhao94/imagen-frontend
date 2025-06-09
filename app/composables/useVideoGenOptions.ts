export const useVideoGenOptions = () => {
  // Duration options for video generation
  const durationOptions = [
    { label: '2 seconds', value: 2 },
    { label: '3 seconds', value: 3 },
    { label: '5 seconds', value: 5 },
    { label: '8 seconds', value: 8 },
    { label: '10 seconds', value: 10 }
  ]

  // Default duration
  const duration = ref(5)

  // Person generation options
  const personGenerationOptions = [
    { label: 'Allow', value: 'allow' },
    { label: 'Don\'t Allow', value: 'dont_allow' }
  ]

  // Default person generation
  const personGeneration = ref('dont_allow')

  // Aspect ratio options
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
    // Duration
    duration,
    durationOptions,
    
    // Person generation
    personGeneration,
    personGenerationOptions,
    
    // Aspect ratio
    aspectRatio,
    aspectRatioOptions,
    
    // Enhance prompt
    enhancePrompt
  }
}
