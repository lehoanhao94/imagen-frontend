export function useStyles() {
  const style = useCookie<string>('llm-style', { default: () => 'Dynamic' })

  const styles = [
    '3D Render',
    'Acrylic',
    'Anime General',
    'Creative',
    'Dynamic',
    'Fashion',
    'Game Concept',
    'Graphic Design 3D',
    'Illustration',
    'None',
    'Portrait',
    'Portrait Cinematic',
    'Portrait Fashion',
    'Ray Traced',
    'Stock Photo',
    'Watercolor'
  ]

  return {
    styles,
    style
  }
}
