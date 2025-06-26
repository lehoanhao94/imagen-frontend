import { defineStore } from 'pinia'

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
  state: () => ({
    dialogs: [] as DialogItem[],
    speakers: [] as SpeakerItem[],

    loadings: {
      generateSpeech: false
    } as Record<string, boolean>,

    errors: {
      generateSpeech: null
    } as Record<string, any>
  }),

  getters: {
    hasDialogs: state => state.dialogs.length > 0,
    hasSpeakers: state => state.speakers.length > 0,
    getSpeakerByIndex: state => (index: number) => {
      return state.speakers[index] || null
    }
  },

  actions: {
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
    addDialog(dialog: DialogItem) {
      this.dialogs.push(dialog)
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
      vibe_id?: number
      accent?: string
      model_name?: string
      name?: string
    }) {
      try {
        this.loadings.generateSpeech = true
        this.errors.generateSpeech = null

        // Convert dialogs and speakers to the format expected by textToSpeech
        const voices = this.dialogs.map((dialog) => {
          const speaker = this.getSpeakerByIndex(dialog.speakerIndex)
          return {
            name: speaker?.name || `Speaker ${dialog.speakerIndex + 1}`,
            voice: speaker?.voice || { id: '', name: '' },
            input: dialog.input
          }
        })

        // Combine all dialog inputs
        const combinedInput = this.dialogs.map((dialog) => {
          const speaker = this.getSpeakerByIndex(dialog.speakerIndex)
          const speakerName = speaker?.name || `Speaker ${dialog.speakerIndex + 1}`
          return `${speakerName}: ${dialog.input}`
        }).join('\n\n')

        // Return the data to be used by the calling component
        return {
          input: combinedInput,
          voices,
          ...payload
        }
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
