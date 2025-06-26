<template>
  <div class="p-6 space-y-6">
    <h2 class="text-xl font-bold">HistoryWrapper Status Badge Demo</h2>
    
    <!-- Example 1: Normal status (status = 1) -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Example 1: Normal Status (status = 1)</h3>
      <HistoryWrapper 
        type="image"
        style="Dynamic"
        :status="1"
      >
        <UPageCard class="h-40 flex items-center justify-center">
          <div class="text-center">
            <UIcon name="lucide:image" class="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p>Normal Image Generation</p>
            <p class="text-sm text-gray-500">Status: Success</p>
          </div>
        </UPageCard>
      </HistoryWrapper>
    </div>

    <!-- Example 2: Processing status (status = 2) -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Example 2: Processing Status (status = 2)</h3>
      <HistoryWrapper 
        type="video"
        :status="2"
      >
        <UPageCard class="h-40 flex items-center justify-center">
          <div class="text-center">
            <UIcon name="lucide:video" class="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p>Video Generation in Progress</p>
            <p class="text-sm text-gray-500">Status: Processing</p>
          </div>
        </UPageCard>
      </HistoryWrapper>
    </div>

    <!-- Example 3: Error status (status = 3) - Shows red error badge -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Example 3: Error Status (status = 3) - Shows Error Badge</h3>
      <HistoryWrapper 
        type="speech"
        style="Premium"
        :status="3"
      >
        <UPageCard class="h-40 flex items-center justify-center">
          <div class="text-center">
            <UIcon name="lucide:mic" class="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p>Speech Generation Failed</p>
            <p class="text-sm text-gray-500">Status: Error</p>
          </div>
        </UPageCard>
      </HistoryWrapper>
    </div>

    <!-- Example 4: Multiple error examples -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Example 4: Multiple Error Examples</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HistoryWrapper 
          type="image"
          style="Realistic"
          :status="3"
        >
          <UPageCard class="h-32 flex items-center justify-center">
            <div class="text-center">
              <UIcon name="lucide:image-off" class="w-6 h-6 mx-auto mb-1 text-red-500" />
              <p class="text-sm">Image Failed</p>
            </div>
          </UPageCard>
        </HistoryWrapper>

        <HistoryWrapper 
          type="video"
          :status="3"
        >
          <UPageCard class="h-32 flex items-center justify-center">
            <div class="text-center">
              <UIcon name="lucide:video-off" class="w-6 h-6 mx-auto mb-1 text-red-500" />
              <p class="text-sm">Video Failed</p>
            </div>
          </UPageCard>
        </HistoryWrapper>

        <HistoryWrapper 
          type="speech"
          :status="3"
        >
          <UPageCard class="h-32 flex items-center justify-center">
            <div class="text-center">
              <UIcon name="lucide:mic-off" class="w-6 h-6 mx-auto mb-1 text-red-500" />
              <p class="text-sm">Speech Failed</p>
            </div>
          </UPageCard>
        </HistoryWrapper>
      </div>
    </div>

    <!-- Example 5: Comparison of all statuses -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">Example 5: Status Comparison</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
          <h4 class="font-medium text-green-600">Status 1: Success</h4>
          <HistoryWrapper 
            type="image"
            style="Dynamic"
            :status="1"
          >
            <UPageCard class="h-24 flex items-center justify-center bg-green-50">
              <UIcon name="lucide:check-circle" class="w-6 h-6 text-green-500" />
            </UPageCard>
          </HistoryWrapper>
        </div>

        <div class="space-y-2">
          <h4 class="font-medium text-blue-600">Status 2: Processing</h4>
          <HistoryWrapper 
            type="video"
            :status="2"
          >
            <UPageCard class="h-24 flex items-center justify-center bg-blue-50">
              <UIcon name="lucide:loader" class="w-6 h-6 text-blue-500 animate-spin" />
            </UPageCard>
          </HistoryWrapper>
        </div>

        <div class="space-y-2">
          <h4 class="font-medium text-red-600">Status 3: Error (with badge)</h4>
          <HistoryWrapper 
            type="speech"
            style="Premium"
            :status="3"
          >
            <UPageCard class="h-24 flex items-center justify-center bg-red-50">
              <UIcon name="lucide:x-circle" class="w-6 h-6 text-red-500" />
            </UPageCard>
          </HistoryWrapper>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 class="font-semibold mb-2">Badge Behavior:</h4>
      <ul class="space-y-1 text-sm">
        <li>• <strong>Status 1 (Success):</strong> Shows only type and style badges</li>
        <li>• <strong>Status 2 (Processing):</strong> Shows only type and style badges</li>
        <li>• <strong>Status 3 (Error):</strong> Shows type, style, and red error badge with alert icon</li>
        <li>• <strong>Error badge:</strong> Red background with white text and alert circle icon</li>
        <li>• <strong>Hover behavior:</strong> All badges hide on hover to show overlay content</li>
      </ul>
    </div>

    <!-- Props Documentation -->
    <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h4 class="font-semibold mb-2">HistoryWrapper Props:</h4>
      <div class="space-y-1 text-sm">
        <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">type: string</code> - Required. The type of content (image, video, speech)</div>
        <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">style: string</code> - Optional. The style/preset used</div>
        <div><code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">status: number</code> - Optional. Default: 1. Status code (1=success, 2=processing, 3=error)</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this demo
</script>
