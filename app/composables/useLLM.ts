export function useLLM() {
  const models = [
    'Imagen 3',
    'Gemini 2.0 Flash'
  ]
  const model = useCookie<string>('llm-model', { default: () => 'Imagen 3' })

  return {
    models,
    model
  }
}
