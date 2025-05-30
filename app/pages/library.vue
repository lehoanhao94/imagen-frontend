<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';

/**
 * Library page with infinite scroll functionality
 * 
 * Features:
 * - Loads initial set of items
 * - Detects when user scrolls to bottom of page
 * - Loads additional items and appends to existing list
 * - Shows loading indicator while fetching
 * - Maintains original data order (old data first, new data appended)
 */
const initialData = [
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/ae43823c-9b34-43ec-89d8-a561b2d817cf/generations/09b9108b-e6c3-4300-a31d-4a5a6012e2e1/Leonardo_Phoenix_10_create_an_illustration_of_A_woman_wearing_2.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/b6c8b211-6345-4cc4-a86b-efa3673506e3/generations/022ef9ef-7435-4580-ada9-bfc39ee325c3/Leonardo_Phoenix_10_A_sophisticated_lady_in_a_forest_green_tea_0.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/846c2e73-4c2d-4138-afa2-c2f6feecf304/generations/240454cc-405d-4c9d-89bf-8e265324a9cf/Leonardo_Phoenix_10_An_illustration_of_a_graceful_female_figur_0.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/c675554b-c126-47eb-936a-7ee76290f5e3/generations/27d15640-a5a9-4dbc-a9bc-40fd28f82d10/Leonardo_Phoenix_10_Create_an_image_of_a_majestic_tortoise_in_3.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/dc4608ba-6fc1-415e-ad8f-8dde28127c66/generations/6313bb9e-0ba2-4e65-a72d-561b348e2100/Leonardo_Phoenix_10_Vibrant_and_highly_detailed_photograph_of_2.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  }
];

// More sample data for pagination
const moreData = [
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/f33d9042-22f3-4fbb-96ef-923567ea1ed9/generations/50b0bcd7-58f9-4a2c-a8c7-6a5a356bd852/Leonardo_Phoenix_10_Create_a_minimalist_and_elegant_vintageins_2.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/9a6d696b-3a81-4d92-bc5c-7a17fa079e18/generations/d4e3a995-ef53-4bc0-941a-7f0c9ef5d21f/Leonardo_Phoenix_10_A_weathered_rusty_old_train_its_carriages_3.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/4315e00c-057a-48d6-908a-01aa2c0bd0ad/generations/aa62988f-090e-49bb-9cda-b5b31476e22c/Leonardo_Phoenix_10_depict_water_color_style_semi_anime_japan_3.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/f33d9042-22f3-4fbb-96ef-923567ea1ed9/generations/50b0bcd7-58f9-4a2c-a8c7-6a5a356bd852/Leonardo_Phoenix_10_Create_a_minimalist_and_elegant_vintageins_2.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  },
  {
    imageUrl:
      'https://cdn.leonardo.ai/users/75e44a4e-fca9-4a82-9199-1be4ff04737f/generations/0cd41ddd-aa9d-43aa-acac-92bee7d0e84f/segments/3:3:1/Leonardo_Phoenix_10_3D_cartoonstyle_image_of_a_printed_photogr_0.jpg?w=512',
    title: 'Create an illustration of A woman wearing a white tank top shirt',
    prompt:
      'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
    preset: 'Imagen 3',
    style: 'Dynamic',
    resolution: '832x1472'
  }
];

// Reactive state
const libraries = ref(initialData);
const page = ref(1);
const isLoading = ref(false);
const hasMoreData = ref(true);

// Mock API fetch function
const fetchMoreLibraryItems = async () => {
  if (!hasMoreData.value || isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would fetch from your API with pagination:
    // const response = await fetch(`/api/library?page=${page.value}&limit=10`);
    // const newData = await response.json();
    
    // Mock response based on page
    if (page.value === 1) {
      // Append new data to existing data (preserving order)
      libraries.value = [...libraries.value, ...moreData];
      page.value++;
    } else {
      // For demo purposes, we'll stop loading after second page
      hasMoreData.value = false;
    }
    
    // In a real implementation, you would check if there's more data available:
    // if (newData.length < limit) {
    //   hasMoreData.value = false;
    // }
  } catch (error) {
    console.error('Error fetching more library items:', error);
    // Show error to user
    alert('Failed to load more items. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

// Intersection observer for infinite scroll
let observer: IntersectionObserver | null = null;

const observeLastElement = (entries: IntersectionObserverEntry[]) => {
  const entry = entries[0];
  if (entry && entry.isIntersecting && !isLoading.value) {
    fetchMoreLibraryItems();
  }
};

// Setup scroll observer on component mount
onMounted(() => {
  observer = new IntersectionObserver(observeLastElement, {
    threshold: 0.5,
    rootMargin: '0px 0px 200px 0px' // Load more when within 200px of bottom
  });
  
  // Setup scroll event for fallback
  window.addEventListener('scroll', checkScrollPosition);
});

// Clean up on unmount
onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  window.removeEventListener('scroll', checkScrollPosition);
});

// Update observer target when the libraries array changes
watch(libraries, () => {
  nextTick(() => {
    const loadingTrigger = document.getElementById('loading-trigger');
    if (loadingTrigger && observer) {
      observer.disconnect();
      observer.observe(loadingTrigger);
    }
  });
});

// Debounce function to improve scroll performance
const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return function(...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

// Fallback scroll detection with debouncing
const checkScrollPosition = debounce(() => {
  if (isLoading.value || !hasMoreData.value) return;
  
  const scrollPosition = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  // Load more when user scrolls to 90% of the page
  if (scrollPosition >= documentHeight * 0.9) {
    fetchMoreLibraryItems();
  }
}, 200); // 200ms debounce;
</script>

<template>
  <UPage>
    <UContainer class="pt-30">
      <UPageColumns>
        <Motion
          v-for="(image, index) in libraries"
          :key="index"
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: index * 0.1
          }"
        >
          <AIToolImageLibraryCard
            :key="index"
            orientation="vertical"
            v-bind="image"
          />
        </Motion>
      </UPageColumns>
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <UIcon name="i-lucide-loader" class="animate-spin text-primary h-8 w-8 mr-2" />
        <span class="text-primary">Loading more items...</span>
      </div>
      
      <!-- End of list indicator for intersection observer -->
      <div 
        id="loading-trigger" 
        class="h-1 w-full" 
        v-if="hasMoreData && !isLoading"
        aria-hidden="true"
      ></div>
      
      <!-- End message when all data is loaded -->
      <div v-if="!hasMoreData" class="text-center py-8 text-gray-500">
        You've reached the end of the library
      </div>
    </UContainer>
  </UPage>
</template>
