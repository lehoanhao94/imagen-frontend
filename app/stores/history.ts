import { defineStore } from "pinia";

interface HistoryDetail {
  id: number;
  uuid: string;
  user_id: number;
  voice: string;
  voice_id: string;
  speed: number;
  model: string;
  model_name: string;
  input_text: string;
  generate_result: any;
  input_file_path: string | null;
  type: string;
  used_credit: number;
  status: number;
  status_desc: string;
  status_percentage: number;
  error_message: string;
  rating: string;
  rating_content: string;
  custom_prompt: string;
  created_at: string;
  updated_at: string;
  file_size: number;
  file_password: string;
  expired_at: string | null;
  media_url: string;
  inference_type: string | null;
  name: string | null;
  speaker_name: string | null;
  created_by: string;
  is_premium_credit: boolean;
  is_emotion_failed: boolean;
  emotion: string | null;
  output_transcript: string;
  note: string | null;
  estimated_credit: number;
  ai_credit: number;
  output_format: string;
  output_channel: string;
  accent: string;
}

interface HistoriesResponse {
  result: HistoryDetail[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

interface FetchHistoriesParams {
  filter_by?: string | null;
  items_per_page?: number | null;
  page?: number | null;
}

export const useHistoryStore = defineStore("historyStore", {
  state: () => ({
    historyDetail: null as HistoryDetail | null,
    histories: [] as HistoryDetail[],
    historiesTotal: 0,
    currentPage: 1,
    hasMoreHistories: true,

    historiesWithPage: [
      {
        page: 1,
        histories: [] as HistoryDetail[],
      },
    ],

    loadings: {
      fetchHistoryDetail: false,
      fetchHistories: false,
      fetchMoreHistories: false,
    } as Record<string, boolean>,

    errors: {
      fetchHistoryDetail: null,
      fetchHistories: null,
    } as Record<string, any>,
  }),
  getters: {},
  actions: {
    async fetchHistoryDetail(uuid: string) {
      try {
        this.loadings.fetchHistoryDetail = true;
        this.errors.fetchHistoryDetail = null;

        const { apiService } = useAPI();
        const response = await apiService.get(`/history/${uuid}`);

        this.historyDetail = response.body || response.data;
        return response.body || response.data;
      } catch (error: any) {
        console.error("🚀 ~ fetchHistoryDetail error:", error);
        this.errors.fetchHistoryDetail = error;
        return null;
      } finally {
        this.loadings.fetchHistoryDetail = false;
      }
    },

    async fetchHistories(params: FetchHistoriesParams = {}, append = false) {
      try {
        const loadingKey = append ? "fetchMoreHistories" : "fetchHistories";
        this.loadings[loadingKey] = true;
        this.errors.fetchHistories = null;

        const { apiService } = useAPI();

        // Build query parameters with defaults
        const queryParams = new URLSearchParams();
        if (params.filter_by !== undefined)
          queryParams.append("filter_by", params.filter_by || "all");
        if (params.items_per_page !== undefined)
          queryParams.append(
            "items_per_page",
            String(params.items_per_page || 10)
          );
        if (params.page !== undefined)
          queryParams.append("page", String(params.page || 1));

        const response = await apiService.get(
          `/histories?${queryParams.toString()}`
        );
        const data: HistoriesResponse = response.body || response.data;

        if (append) {
          // Append new data for infinite scroll
          this.histories = [...this.histories, ...data.result];
        } else {
          // Replace data for initial load or refresh
          this.histories = data.result;
        }

        this.historiesTotal = data.total;
        this.currentPage = params.page || 1;
        this.hasMoreHistories = this.histories.length < data.total;

        // Update historiesWithPage
        const page = params.page || 1;
        const pageIndex = this.historiesWithPage.findIndex((item) => item.page === page);
        if (pageIndex !== -1 && this.historiesWithPage[pageIndex]) {
          // Update existing page (đảm bảo không undefined)
          this.historiesWithPage[pageIndex] = { page, histories: data.result };
        } else {
          // Add new page
          this.historiesWithPage.push({ page, histories: data.result });
        }

        return data;
      } catch (error: any) {
        console.error("🚀 ~ fetchHistories error:", error);
        this.errors.fetchHistories = error;
        return null;
      } finally {
        this.loadings.fetchHistories = false;
        this.loadings.fetchMoreHistories = false;
      }
    },

    async fetchMoreHistories(params: FetchHistoriesParams = {}) {
      if (!this.hasMoreHistories || this.loadings.fetchMoreHistories)
        return null;

      const nextPage = this.currentPage + 1;
      return await this.fetchHistories({ ...params, page: nextPage }, true);
    },
  },
});
