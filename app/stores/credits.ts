import { defineStore } from "pinia";
import { useProductStore } from "~/stores/product";

interface CryptomusOrderResponse {
  success: boolean;
  order_id: string;
  order_uuid: string;
  approval_url: string;
  message: string;
  error_code: string;
}

export const useCreditsStore = defineStore("creditsStore", {
  state: () => ({
    locale: "en",
    showDrawer: false,
    numberOfCreditsWanted: 0,
    isLoading: false,
    loadings: {} as Record<string, boolean>,
  }),
  getters: {
    buyCreditProduct() {
      const product = useProductStore().buyCreditProduct;
      return product || {};
    },
    creditUnitPrice(): number {
      return this.buyCreditProduct.price_divide_100;
    },
    quickTopUpList(): any {
      return [1, 2, 5, 7, 10, 12, 15, 17, 20].map((num) => ({
        credits: num * this.buyCreditProduct.base_credit,
        price: num * this.creditUnitPrice,
        quantity: num,
      }));
    },
  },

  actions: {
    processBuyCredits(numOfCredits: number) {
      this.numberOfCreditsWanted = numOfCredits;
      this.showDrawer = true;
    },

    async processStripePayment() {
      try {
        this.loadings.createStripeOrder = true;
        const { apiService } = useAPI();
        const toast = useToast();

        // Calculate quantity based on the credits wanted and base credit product
        const quantity = Math.ceil(
          this.numberOfCreditsWanted / this.buyCreditProduct.base_credit
        );

        // use the selected credit product ID
        const product = this.buyCreditProduct;
        const requestPayload = { product_id: product.id, quantity };

        const response = await apiService.post(
          "/order/stripe/create",
          requestPayload
        );

        if (response.data.success && response.data.approval_url) {
          // Open approval URL in new window
          // window.open(response.data.approval_url, "_blank");
          const newWindow = popupCenter(600, 700, response.data.approval_url);

          if (window.focus) newWindow?.focus();

          const interval = setInterval(() => {
            if (newWindow?.closed) {
              clearInterval(interval);
              const authStore = useAuthStore();
              // Refresh user credits after payment is completed
              setTimeout(() => {
                authStore.userMe();
              }, 3000);
            }
          }, 500);

          // Close the drawer
          this.showDrawer = false;

          // Show success message
          toast.add({
            id: "stripe-success",
            title: "Payment Initiated",
            description:
              "Stripe payment window opened. Please complete your payment.",
            color: "success",
          });
        } else {
          // Handle API error response
          toast.add({
            id: "stripe-error",
            title: "Payment Error",
            description:
              response.data.message || "Failed to initiate Stripe payment",
            color: "error",
          });
        }
      } catch (error: any) {
        const toast = useToast();
        toast.add({
          id: "stripe-error",
          title: "Payment Error",
          description:
            error.response?.data?.message || "Failed to process Stripe payment",
          color: "error",
        });
      } finally {
        this.loadings.createStripeOrder = false;
      }
    },

    async createCryptoOrder() {
      this.isLoading = true;
      const toast = useToast();

      try {
        const { apiService } = useAPI();

        // Calculate quantity based on the number of credit packages being purchased
        const quantity = Math.ceil(
          this.numberOfCreditsWanted / this.buyCreditProduct.base_credit
        );

        // use the selected credit product ID
        const product = this.buyCreditProduct;
        const payload = { product_id: product.id, quantity };

        const response = await apiService.post(
          "/order/cryptomus/create",
          payload
        );
        const responseData: CryptomusOrderResponse = response.data;

        // Handle API response
        if (responseData.success) {
          const newWindow = popupCenter(600, 700, response.data.approval_url);

          if (window.focus) newWindow?.focus();

          const interval = setInterval(() => {
            if (newWindow?.closed) {
              clearInterval(interval);
              const authStore = useAuthStore();
              // Refresh user credits after payment is completed
              setTimeout(() => {
                authStore.userMe();
              }, 3000);
            }
          }, 500);
          this.showDrawer = false;
          toast.add({
            id: "crypto-order-success",
            title: "Success",
            description:
              "Crypto payment order created successfully. Please complete the payment in the new window.",
            color: "success",
          });
        } else {
          toast.add({
            id: "crypto-order-error",
            title: "Payment Error",
            description:
              responseData.message ||
              "Failed to create crypto payment order. Please try again.",
            color: "error",
          });
        }
        return responseData;
      } catch (error: any) {
        console.error("🚀 ~ createCryptoOrder error:", error);

        toast.add({
          id: "crypto-order-error",
          title: "Payment Error",
          description:
            error.response?.data?.message ||
            error.message ||
            "Failed to create crypto payment order. Please try again.",
          color: "error",
        });

        return null;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
