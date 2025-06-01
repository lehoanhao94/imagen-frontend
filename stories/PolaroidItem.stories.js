import PolaroidItem from '../app/components/PolaroidItem.vue'

const meta = {
  title: 'Components/PolaroidItem',
  component: PolaroidItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    index: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Index of the polaroid item (affects rotation)',
    },
    image: {
      control: 'object',
      description: 'Image object with src and alt properties',
    },
  },
  args: {
    index: 0,
    image: {
      src: 'https://picsum.photos/200/200',
      alt: 'Sample Image'
    }
  },
}

export default meta

export const Default = {
  args: {
    index: 0,
    image: {
      src: 'https://picsum.photos/200/200?random=1',
      alt: 'Beautiful Landscape'
    }
  }
}

export const EvenIndex = {
  args: {
    index: 0,
    image: {
      src: 'https://picsum.photos/200/200?random=2',
      alt: 'Mountain View'
    }
  }
}

export const OddIndex = {
  args: {
    index: 1,
    image: {
      src: 'https://picsum.photos/200/200?random=3',
      alt: 'Ocean Waves'
    }
  }
}

export const LongText = {
  args: {
    index: 0,
    image: {
      src: 'https://picsum.photos/200/200?random=4',
      alt: 'This is a very long caption that might wrap to multiple lines'
    }
  }
}