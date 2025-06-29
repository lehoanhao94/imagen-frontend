import { defineStore } from 'pinia'
import type { SpeechVoice } from '~/composables/useSpeechVoices'

interface DialogItem {
  speakerIndex: number
  input: string
}

interface SpeakerItem {
  name: string
  voice: {
    id: string
    name: string
  }
}

export const useDialogToSpeechStore = defineStore('dialogToSpeechStore', {
  persist: [
    {
      pick: ['voice1', 'voice2'],
      storage: localStorage
    }
  ],

  state: () => ({
    dialogs: [
      {
        speakerIndex: 0,
        input: ''
      }
    ] as DialogItem[],
    speakers: [
      {
        label: 'Voice 1',
        value: 'Voice 1',
        chip: {
          color: 'primary'
        }
      },
      {
        label: 'Voice 2',
        value: 'Voice 2',
        chip: {
          color: 'warning'
        }
      }
    ] as any[],

    // Voice settings for Voice 1 and Voice 2
    voice1: null as SpeechVoice | null,
    voice2: null as SpeechVoice | null,

    loadings: {
      generateSpeech: false
    } as Record<string, boolean>,

    errors: {
      generateSpeech: null
    } as Record<string, any>,

    custom_prompt: ''
  }),

  getters: {
    hasDialogs: state => state.dialogs.length > 0,
    hasSpeakers: state => state.speakers.length > 0,
    getSpeakerByIndex: state => (index: number) => {
      return state.speakers[index] || null
    },
    getVoiceByIndex: state => (index: number) => {
      if (index === 0) return state.voice1
      if (index === 1) return state.voice2
      return null
    },
    voicesFormatForApi(): any[] {
      return [
        {
          name: 'Voice 1',
          voice: {
            id: this.voice1?.id || '',
            name: this.voice1?.speaker_name || ''
          }
        },
        {
          name: 'Voice 2',
          voice: {
            id: this.voice2?.id || '',
            name: this.voice2?.speaker_name || ''
          }
        }
      ]
    },
    blocksFormatForApi(): any[] {
      return this.dialogs.map((dialog) => {
        const speaker = this.speakers[dialog.speakerIndex]
        console.log('🚀 ~ returnthis.dialogs.map ~ speaker:', speaker)

        if (!speaker) return null
        return {
          // input with speaker name
          input: `${speaker.label}: ${dialog.input}`
        }
      })
    }
  },

  actions: {
    // Voice management actions
    setVoice1(voice: SpeechVoice | null) {
      this.voice1 = voice
    },

    setVoice2(voice: SpeechVoice | null) {
      this.voice2 = voice
    },

    // Speaker management actions
    addSpeaker(speaker: SpeakerItem) {
      this.speakers.push(speaker)
    },

    removeSpeaker(index: number) {
      if (index >= 0 && index < this.speakers.length) {
        this.speakers.splice(index, 1)
        // Update dialog speaker indices if needed
        this.dialogs.forEach((dialog) => {
          if (dialog.speakerIndex > index) {
            dialog.speakerIndex -= 1
          } else if (dialog.speakerIndex === index) {
            // Reset to first speaker or -1 if no speakers
            dialog.speakerIndex = this.speakers.length > 0 ? 0 : -1
          }
        })
      }
    },

    updateSpeaker(index: number, speaker: SpeakerItem) {
      if (index >= 0 && index < this.speakers.length) {
        this.speakers[index] = speaker
      }
    },

    // Dialog management actions
    addDialog(dialog?: DialogItem) {
      const lastDialog = this.dialogs[this.dialogs.length - 1]
      const newDialog = dialog || {
        speakerIndex: lastDialog?.speakerIndex === 0 ? 1 : 0,
        input: ''
      }
      this.dialogs.push(newDialog)
    },

    removeDialog(index: number) {
      if (index >= 0 && index < this.dialogs.length) {
        this.dialogs.splice(index, 1)
      }
    },

    updateDialog(index: number, dialog: DialogItem) {
      if (index >= 0 && index < this.dialogs.length) {
        this.dialogs[index] = dialog
      }
    },

    clearDialogs() {
      this.dialogs = []
    },

    clearSpeakers() {
      this.speakers = []
    },

    clearAll() {
      this.dialogs = []
      this.speakers = []
    },

    // Generate speech for all dialogs
    async generateDialogSpeech(payload: {
      model: string
      emotion?: string
      speed?: number
      output_format?: string
      output_channel?: string
      custom_prompt?: string
      model_name?: string
    }) {
      try {
        this.loadings.generateSpeech = true
        this.errors.generateSpeech = null

        // Prepare request payload for /tts-multi-speaker API
        const requestPayload = {
          voices: this.voicesFormatForApi,
          model_name: payload.model_name || '',
          model: payload.model || 'tts-flash',
          speed: payload.speed || 1,
          blocks: this.blocksFormatForApi,
          output_format: payload.output_format?.value || 'mp3',
          emotion: payload.emotion || '',
          custom_prompt: payload.custom_prompt || '',
          output_channel: payload.output_channel?.value || 'mono'
        }

        // Call the API
        const { apiService } = useAPI()
        const response = await apiService.post(
          '/tts-multi-speaker',
          requestPayload
        )

        return response.data
      } catch (error) {
        console.error('Dialog to speech generation failed:', error)
        this.errors.generateSpeech = error
        return null
      } finally {
        this.loadings.generateSpeech = false
      }
    }
  }
})
