<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
    <!-- Order Header -->
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
          {{ data.order_product.name }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ $t('orders.orderId') }}: {{ data.id }}
        </p>
      </div>
      <UBadge
        :color="getStatusColor(data.status)"
        variant="subtle"
        size="sm"
      >
        {{ getStatusText(data.status) }}
      </UBadge>
    </div>

    <!-- Order Details -->
    <div class="space-y-2 text-sm">
      <!-- Amount -->
      <div class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">{{ $t('orders.amount') }}:</span>
        <span class="font-medium text-gray-900 dark:text-white">
          ${{ formatAmount(data.amount_divide_100) }}
        </span>
      </div>

      <!-- Credits -->
      <div class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">{{ $t('orders.credits') }}:</span>
        <span class="font-medium text-gray-900 dark:text-white">
          {{ data.paid_credit.toLocaleString() }}
        </span>
      </div>

      <!-- Quantity -->
      <div class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">{{ $t('orders.quantity') }}:</span>
        <span class="font-medium text-gray-900 dark:text-white">
          {{ data.quantity }}
        </span>
      </div>

      <!-- Platform -->
      <div v-if="data.platform" class="flex justify-between items-center">
        <span class="text-gray-600 dark:text-gray-400">{{ $t('orders.platform') }}:</span>
        <span class="font-medium text-gray-900 dark:text-white">
          {{ data.platform }}
        </span>
      </div>
    </div>

    <!-- Order Footer -->
    <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{{ formatDate(data.created_at) }}</span>
        <span v-if="data.external_order_id">
          {{ $t('orders.externalId') }}: {{ data.external_order_id }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const props = defineProps<{
  data: OrderDetail;
}>();

const { t } = useI18n();

// Format amount from divided by 100 format
const formatAmount = (amountDivide100: number) => {
  return (amountDivide100 / 100).toFixed(2);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// Get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'success':
    case 'paid':
      return 'success';
    case 'pending':
    case 'processing':
      return 'warning';
    case 'failed':
    case 'cancelled':
    case 'error':
      return 'error';
    default:
      return 'neutral';
  }
};

// Get status text
const getStatusText = (status: string) => {
  return t(`orders.status.${status.toLowerCase()}`, status);
};
</script>