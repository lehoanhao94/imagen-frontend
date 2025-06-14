import { defineStore } from "pinia";

export const useTextToSpeechStore = defineStore("textToSpeechStore", {
  state: () => ({
    textToSpeechResult: null as any,

    loadings: {
      textToSpeech: false,
    } as Record<string, boolean>,

    errors: {
      textToSpeech: null,
    } as Record<string, any>,

    prompt: "",
  }),

  actions: {
    async textToSpeech(payload: {
      input: string;
      model: string;
      emotion?: string;
      speed?: number;
      output_format?: string;
      output_channel?: string;
      voices?: any[];
      custom_prompt?: string;
      vibe_id?: number;
      accent?: string;
      model_name?: string;
      name?: string;
    }) {
      console.log("🚀 ~ file: text-to-speech.ts ~ line 112 ~ payload", payload);

      const appStore = useAppStore();
      this.textToSpeechResult = null;
      appStore.loading = true;
      const toast = useToast();

      try {
        this.loadings.textToSpeech = true;
        this.errors.textToSpeech = null;

        // Create request payload
        const requestData = {
          model: payload.model,
          voices: payload.voices || [],
          speed: payload.speed || 1,
          input: payload.input,
          output_format: payload.output_format || "mp3",
          emotion: payload.emotion,
          custom_prompt: payload.custom_prompt,
          vibe_id: payload.vibe_id,
          output_channel: payload.output_channel || "mono",
          accent: payload.accent,
          model_name: payload.model_name,
          name: payload.name,
        };

        // Make the API call
        const { apiService } = useAPI();
        const response = await apiService.post("/text-to-speech", requestData);

        this.textToSpeechResult = response;

        // Show success notification
        const nuxtApp = useNuxtApp();
        const t = nuxtApp.$i18n.t;
        toast.add({
          id: "speech-success",
          title:
            t("Speech Generation Complete") || "Speech Generation Complete",
          description:
            t(
              "Your request has been submitted. Results will be notified later"
            ) ||
            "Your request has been submitted. Results will be notified later",
          color: "success",
        });

        return response;
      } catch (error: any) {
        console.log("🚀 ~ textToSpeech error:", error);

        const { $i18n } = useNuxtApp();
        const t = $i18n.t;
        toast.add({
          id: "speech-error",
          title: t("Error") || "Error",
          description:
            error.response?.data?.detail ||
            error.message ||
            "Speech generation failed. Please try again.",
          color: "error",
        });

        this.errors.textToSpeech = error;
        return null;
      } finally {
        appStore.loading = false;
        this.loadings.textToSpeech = false;
      }
    },

    clearResult() {
      this.textToSpeechResult = null;
    },

    setPrompt(prompt: string) {
      this.prompt = prompt;
    },
  },
});
