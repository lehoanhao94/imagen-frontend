export function useVideoDimensions() {
  const videoDimension = useCookie<string>('llm-video-dimens', { default: () => '16:9' })

  const videoDimensions = [
    {
      label: '16:9',
      value: '16:9',
      icon: 'material-symbols-light:crop-16-9-outline',
      classExample: 'aspect-[16/9] h-[70px] w-[126.67px]'
    },
    {
      label: '9:16',
      value: '9:16',
      icon: 'material-symbols:crop-9-16-outline',
      classExample: 'aspect-[9/16] h-[70px] w-[39.38px]'
    },
    {
      label: '1:1',
      value: '1:1',
      icon: 'ion:square-outline',
      classExample: 'aspect-square w-[70px] h-[70px]'
    },
    {
      label: '4:3',
      value: '4:3',
      icon: 'icon-park-outline:rectangle',
      classExample: 'aspect-[4/3] h-[70px] w-[93.33px]'
    },
    {
      label: '3:4',
      value: '3:4',
      icon: 'bx:rectangle',
      classExample: 'aspect-[3/4] h-[70px] w-[52.5px]'
    }
  ]
  return {
    videoDimension,
    videoDimensions
  }
}
