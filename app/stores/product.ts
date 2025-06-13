import { defineStore } from "pinia";

interface Product {
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

export const useProductStore = defineStore("productStore", {
  state: () => ({
    products: [] as Product[],
  }),
  getters: {
    buyCreditProduct: (state) => {
      return state.products.find((product) => product.type === 2) || null;
    },
  },
  actions: {
    async fetchProducts() {
      const { apiService } = useAPI();
      const response = await apiService.get("/products");
      const data = response.data;
      if (data.success) {
        this.products = data.result;
      }
      return this.products;
    },
  },
});
