# API Stores Implementation Summary

This document provides an overview of the implemented Pinia stores for the Imagen Frontend application.

## Implemented Stores

### 1. Image to Image Store (`app/stores/image-to-image.ts`)
**Purpose:** Manage image-to-image transformation operations
**Endpoint:** `POST /image-to-image`

**State:**
- `imageToImageResult`: Stores transformation results
- `selectedImages`: Array of selected transformed images  
- `originalImage`: Source image for transformation
- `loadings`: Loading states for async operations
- `prompt`: Current transformation prompt
- `strength`: Transformation strength (0.1-1.0)

**Key Actions:**
- `imageToImage()`: Transform an image based on prompt
- `setOriginalImage()`: Set the source image
- `addImage()` / `removeImage()`: Manage selected images

**Getters:**
- `hasOriginalImage`: Check if source image is set
- `hasResults`: Check if transformation results exist
- `isLoading`: Check loading state

### 2. Models Store (`app/stores/models.ts`)
**Purpose:** Manage available AI models information
**Endpoints:** `GET /models`, `GET /models/{id}`

**State:**
- `models`: Array of available AI models
- `selectedModel`: Currently selected model
- `loadings`: Loading states
- `lastFetched`: Cache timestamp

**Key Actions:**
- `fetchModels()`: Get list of available models (with caching)
- `getModelDetails()`: Get detailed model information
- `selectModel()`: Select a model for use

**Getters:**
- `textToImageModels` / `imageToImageModels`: Filter by type
- `fastModels` / `highQualityModels`: Filter by performance
- `modelsByCost`: Sort by pricing
- `recommendedForPrototyping` / `recommendedForProduction`: Get recommended models

### 3. Image Variations Store (`app/stores/image-variations.ts`)
**Purpose:** Manage image variation generation
**Endpoint:** `POST /variations`

**State:**
- `variationsResult`: Variation generation results
- `selectedVariations`: Selected variation images
- `baseImage`: Source image for variations
- `variations`: Array of generated variations
- `variationCount`: Number of variations to generate

**Key Actions:**
- `createVariations()`: Generate variations of an image
- `generateImageVariations()`: Advanced variation workflow with multiple prompts
- `setBaseImage()`: Set source image

**Getters:**
- `hasBaseImage`: Check if base image is set
- `hasVariations`: Check if variations exist
- `totalVariations`: Count of variations

### 4. User Store (`app/stores/user.ts`)
**Purpose:** Manage user profile and preferences
**Endpoints:** `GET /user/profile`, `PUT /user/profile`, `PUT /user/preferences`, `GET /user/stats`

**State:**
- `profile`: User profile data
- `stats`: User statistics (images generated, credits used)
- `preferences`: User preferences (default model, style, etc.)

**Key Actions:**
- `fetchUserProfile()`: Get user profile data
- `updateUserProfile()`: Update profile information
- `updateUserPreferences()`: Update user preferences
- `fetchUserStats()`: Get usage statistics

**Getters:**
- `isPremiumUser`: Check if user has premium plan
- `creditsRemaining`: Get remaining credits
- `defaultModel`: Get user's default model preference

### 5. Image History Store (`app/stores/image-history.ts`)
**Purpose:** Manage generated image history and collections
**Endpoints:** `GET /user/images`, `POST /user/images`, `DELETE /user/images/{id}`, `GET /user/collections`, `POST /user/collections`

**State:**
- `images`: Array of generated images
- `collections`: Image collections/albums
- `selectedImages`: Selected image IDs
- `filters`: Filter options (type, model, date range, style)
- `pagination`: Pagination state

**Key Actions:**
- `fetchImages()`: Get user's image history
- `saveImage()`: Save a generated image
- `deleteImage()`: Delete an image
- `createCollection()`: Create image collection
- `toggleImageSelection()`: Manage image selection

**Getters:**
- `filteredImages`: Apply current filters
- `imagesByType`: Count images by generation type
- `selectedImagesData`: Get data for selected images

## Common Patterns

All stores follow these consistent patterns:

1. **Error Handling:** Uses toast notifications for user feedback
2. **Loading States:** Tracks async operation states
3. **TypeScript:** Full type definitions for all data structures
4. **Integration:** Works with existing composables (`useAPI`, `useToast`, `useNuxtApp`)
5. **State Management:** Follows Pinia best practices

## API Endpoints Covered

The stores implement actions for all documented API endpoints:

- ✅ `POST /text-to-image` (existing)
- ✅ `POST /image-to-image` (new)
- ✅ `POST /variations` (new)
- ✅ `GET /models` (new)
- ✅ `GET /models/{id}` (new)
- ✅ `GET /user/profile` (new)
- ✅ `PUT /user/profile` (new)
- ✅ `PUT /user/preferences` (new)
- ✅ `GET /user/stats` (new)
- ✅ `GET /user/images` (new)
- ✅ `POST /user/images` (new)
- ✅ `DELETE /user/images/{id}` (new)
- ✅ `GET /user/collections` (new)
- ✅ `POST /user/collections` (new)

## Usage Examples

```typescript
// Use Image to Image
const imageToImageStore = useImageToImageStore()
await imageToImageStore.imageToImage({
  image: 'base64_or_url',
  prompt: 'Transform to cyberpunk style',
  model: 'imagen-v3',
  strength: 0.8
})

// Get available models
const modelsStore = useModelsStore()
await modelsStore.fetchModels()
const fastModel = modelsStore.recommendedForPrototyping

// Create image variations
const variationsStore = useImageVariationsStore()
await variationsStore.createVariations({
  image: 'source_image_url',
  variations: 4
})

// Manage user preferences  
const userStore = useUserStore()
await userStore.updateUserPreferences({
  default_model: 'imagen-v3',
  auto_save_images: true
})

// View image history
const historyStore = useImageHistoryStore()
await historyStore.fetchImages()
historyStore.setTypeFilter('text-to-image')
```