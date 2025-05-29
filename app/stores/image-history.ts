// Define a store to manage image history and gallery
import { defineStore } from 'pinia'

interface GeneratedImage {
  id: string
  url: string
  thumbnail_url?: string
  prompt: string
  negative_prompt?: string
  model: string
  width: number
  height: number
  style?: string
  created_at: string
  type: 'text-to-image' | 'image-to-image' | 'variation'
  parent_image_id?: string
  metadata: {
    steps: number
    guidance_scale: number
    seed: number
    strength?: number
  }
}

interface ImageCollection {
  id: string
  name: string
  description?: string
  images: GeneratedImage[]
  created_at: string
  updated_at: string
}

export const useImageHistoryStore = defineStore('imageHistoryStore', {
  state: () => ({
    images: [] as GeneratedImage[],
    collections: [] as ImageCollection[],
    selectedImages: [] as string[],
    currentCollection: null as ImageCollection | null,
    
    loadings: {
      fetchImages: false,
      fetchCollections: false,
      saveImage: false,
      deleteImage: false,
      createCollection: false
    } as Record<string, boolean>,

    filters: {
      type: 'all' as 'all' | 'text-to-image' | 'image-to-image' | 'variation',
      model: 'all' as string,
      dateRange: 'all' as 'all' | 'today' | 'week' | 'month',
      style: 'all' as string
    },

    pagination: {
      page: 1,
      limit: 20,
      total: 0
    }
  }),

  getters: {
    hasImages: (state) => state.images.length > 0,
    hasCollections: (state) => state.collections.length > 0,
    isLoading: (state) => Object.values(state.loadings).some(loading => loading),
    
    filteredImages: (state) => {
      let filtered = [...state.images]
      
      if (state.filters.type !== 'all') {
        filtered = filtered.filter(img => img.type === state.filters.type)
      }
      
      if (state.filters.model !== 'all') {
        filtered = filtered.filter(img => img.model === state.filters.model)
      }
      
      if (state.filters.style !== 'all') {
        filtered = filtered.filter(img => img.style === state.filters.style)
      }
      
      if (state.filters.dateRange !== 'all') {
        const now = new Date()
        const filterDate = new Date()
        
        switch (state.filters.dateRange) {
          case 'today':
            filterDate.setDate(now.getDate() - 1)
            break
          case 'week':
            filterDate.setDate(now.getDate() - 7)
            break
          case 'month':
            filterDate.setDate(now.getDate() - 30)
            break
        }
        
        filtered = filtered.filter(img => new Date(img.created_at) >= filterDate)
      }
      
      return filtered
    },

    selectedImagesData: (state) => 
      state.images.filter(img => state.selectedImages.includes(img.id)),

    imagesByType: (state) => {
      return {
        'text-to-image': state.images.filter(img => img.type === 'text-to-image').length,
        'image-to-image': state.images.filter(img => img.type === 'image-to-image').length,
        'variation': state.images.filter(img => img.type === 'variation').length
      }
    }
  },

  actions: {
    async fetchImages(page: number = 1) {
      this.loadings.fetchImages = true
      const toast = useToast()

      try {
        const { apiService } = useAPI()
        const response = await apiService.get('/user/images', {
          params: {
            page,
            limit: this.pagination.limit,
            type: this.filters.type !== 'all' ? this.filters.type : undefined,
            model: this.filters.model !== 'all' ? this.filters.model : undefined,
            date_range: this.filters.dateRange !== 'all' ? this.filters.dateRange : undefined
          }
        })

        if (page === 1) {
          this.images = response.data.images
        } else {
          this.images.push(...response.data.images)
        }
        
        this.pagination.page = page
        this.pagination.total = response.data.total

        return response.data
      } catch (error: any) {
        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'error',
          title: t('Error') || 'Error',
          description: error.response?.data?.detail || error.message,
          color: 'error'
        })
        return null
      } finally {
        this.loadings.fetchImages = false
      }
    },

    async saveImage(imageData: Omit<GeneratedImage, 'id' | 'created_at'>) {
      this.loadings.saveImage = true
      const toast = useToast()

      try {
        const { apiService } = useAPI()
        const response = await apiService.post('/user/images', imageData)

        // Add to local state
        this.images.unshift(response.data)
        this.pagination.total += 1

        return response.data
      } catch (error: any) {
        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'error',
          title: t('Error') || 'Error',
          description: error.response?.data?.detail || error.message,
          color: 'error'
        })
        return null
      } finally {
        this.loadings.saveImage = false
      }
    },

    async deleteImage(imageId: string) {
      this.loadings.deleteImage = true
      const toast = useToast()

      try {
        const { apiService } = useAPI()
        await apiService.delete(`/user/images/${imageId}`)

        // Remove from local state
        const index = this.images.findIndex(img => img.id === imageId)
        if (index !== -1) {
          this.images.splice(index, 1)
          this.pagination.total -= 1
        }

        // Remove from selected if it was selected
        this.removeFromSelection(imageId)

        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'success',
          title: t('Success') || 'Success',
          description: t('ImageDeleted') || 'Image deleted successfully',
          color: 'success'
        })

        return true
      } catch (error: any) {
        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'error',
          title: t('Error') || 'Error',
          description: error.response?.data?.detail || error.message,
          color: 'error'
        })
        return false
      } finally {
        this.loadings.deleteImage = false
      }
    },

    async fetchCollections() {
      this.loadings.fetchCollections = true

      try {
        const { apiService } = useAPI()
        const response = await apiService.get('/user/collections')

        this.collections = response.data
        return response.data
      } catch (error: any) {
        console.error('Failed to fetch collections:', error)
        return null
      } finally {
        this.loadings.fetchCollections = false
      }
    },

    async createCollection(name: string, description?: string, imageIds?: string[]) {
      this.loadings.createCollection = true
      const toast = useToast()

      try {
        const { apiService } = useAPI()
        const response = await apiService.post('/user/collections', {
          name,
          description,
          image_ids: imageIds
        })

        this.collections.push(response.data)

        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'success',
          title: t('Success') || 'Success',
          description: t('CollectionCreated') || 'Collection created successfully',
          color: 'success'
        })

        return response.data
      } catch (error: any) {
        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'error',
          title: t('Error') || 'Error',
          description: error.response?.data?.detail || error.message,
          color: 'error'
        })
        return null
      } finally {
        this.loadings.createCollection = false
      }
    },

    // Selection management
    toggleImageSelection(imageId: string) {
      const index = this.selectedImages.indexOf(imageId)
      if (index === -1) {
        this.selectedImages.push(imageId)
      } else {
        this.selectedImages.splice(index, 1)
      }
    },

    addToSelection(imageId: string) {
      if (!this.selectedImages.includes(imageId)) {
        this.selectedImages.push(imageId)
      }
    },

    removeFromSelection(imageId: string) {
      const index = this.selectedImages.indexOf(imageId)
      if (index !== -1) {
        this.selectedImages.splice(index, 1)
      }
    },

    selectAll() {
      this.selectedImages = this.filteredImages.map(img => img.id)
    },

    clearSelection() {
      this.selectedImages = []
    },

    // Filter management
    setTypeFilter(type: typeof this.filters.type) {
      this.filters.type = type
      this.pagination.page = 1
    },

    setModelFilter(model: string) {
      this.filters.model = model
      this.pagination.page = 1
    },

    setDateRangeFilter(dateRange: typeof this.filters.dateRange) {
      this.filters.dateRange = dateRange
      this.pagination.page = 1
    },

    setStyleFilter(style: string) {
      this.filters.style = style
      this.pagination.page = 1
    },

    clearFilters() {
      this.filters = {
        type: 'all',
        model: 'all',
        dateRange: 'all',
        style: 'all'
      }
      this.pagination.page = 1
    },

    // Helper actions
    getImageById(imageId: string): GeneratedImage | undefined {
      return this.images.find(img => img.id === imageId)
    },

    refreshImages() {
      return this.fetchImages(1)
    }
  }
})