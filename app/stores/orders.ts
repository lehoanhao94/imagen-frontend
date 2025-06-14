import { defineStore } from "pinia";

interface OrderProduct {
  id: string;
  name: string;
  type: number;
  max_quantity: number;
  max_monthly_total_file: number;
  max_file_size: number;
  price_divide_100: number;
  base_credit: number;
  bonus_credit: number;
  special_bonus_credit: number;
  days_of_valid: number;
  paypal_plan_id: string;
  features: string[];
}

interface OrderDetail {
  id: string;
  uuid: string;
  user_id: number;
  order_product: OrderProduct;
  status: string;
  external_order_id: string;
  amount: number;
  amount_divide_100: number;
  quantity: number;
  paid_credit: number;
  type: string;
  platform: string;
  device_type: string;
  created_at: string;
  updated_at: string;
}

interface OrdersResponse {
  success: boolean;
  total: number;
  result: OrderDetail[];
}

interface FetchOrdersParams {
  items_per_page?: number | null;
  page?: number | null;
}

export const useOrdersStore = defineStore("ordersStore", {
  state: () => ({
    orders: [] as OrderDetail[],
    ordersTotal: 0,
    currentPage: 1,
    hasMoreOrders: true,

    ordersWithPage: [
      {
        page: 1,
        orders: [] as OrderDetail[],
      },
    ],

    loadings: {
      fetchOrders: false,
      fetchMoreOrders: false,
    } as Record<string, boolean>,

    errors: {
      fetchOrders: null,
    } as Record<string, any>,
  }),
  getters: {},
  actions: {
    async fetchOrders(params: FetchOrdersParams = {}, append = false) {
      try {
        const loadingKey = append ? "fetchMoreOrders" : "fetchOrders";
        this.loadings[loadingKey] = true;
        this.errors.fetchOrders = null;

        const { apiService } = useAPI();

        // Build query parameters with defaults
        const queryParams = new URLSearchParams();
        if (params.items_per_page !== undefined)
          queryParams.append(
            "items_per_page",
            String(params.items_per_page || 10)
          );
        if (params.page !== undefined)
          queryParams.append("page", String(params.page || 1));

        const response = await apiService.get(
          `/orders?${queryParams.toString()}`
        );
        const data: OrdersResponse = (response as any).body || (response as any).data;

        if (append) {
          // Append new data for infinite scroll
          this.orders = [...this.orders, ...data.result];
        } else {
          // Replace data for initial load or refresh
          this.orders = data.result;
        }

        this.ordersTotal = data.total;
        this.currentPage = params.page || 1;
        this.hasMoreOrders = this.orders.length < data.total;

        // Update ordersWithPage
        const page = params.page || 1;
        const pageIndex = this.ordersWithPage.findIndex((item) => item.page === page);
        if (pageIndex !== -1 && this.ordersWithPage[pageIndex]) {
          // Update existing page
          this.ordersWithPage[pageIndex] = { page, orders: data.result };
        } else {
          // Add new page
          this.ordersWithPage.push({ page, orders: data.result });
        }

        return data;
      } catch (error: any) {
        console.error("🚀 ~ fetchOrders error:", error);
        this.errors.fetchOrders = error;
        return null;
      } finally {
        this.loadings.fetchOrders = false;
        this.loadings.fetchMoreOrders = false;
      }
    },

    async fetchMoreOrders(params: FetchOrdersParams = {}) {
      if (!this.hasMoreOrders || this.loadings.fetchMoreOrders)
        return null;

      const nextPage = this.currentPage + 1;
      return await this.fetchOrders({ ...params, page: nextPage }, true);
    },
  },
});