import axios from 'axios'

const isRefreshingToken = false
const requestsPending = [] as any[]

const createAxios = (baseURL: string) => {
  const toast = useToast()
  const newInstance = axios.create({ baseURL })

  newInstance.interceptors.request.use((config: any) => {
    const authStore = useAuthStore()
    const accessToken = authStore.access_token
    const refreshToken = authStore.refresh_token
    if (['/login/refresh'].includes(config.url) && refreshToken) {
      config.headers['Authorization'] = 'Bearer ' + refreshToken
    } else if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken
    }
    return config
  })

  /**
    * @description if any of the API gets 401 status code, this method
    calls getAuthToken method to renew accessToken
    * updates the error configuration and retries all failed requests
    again
  */
  newInstance.interceptors.response.use(
    (config) => {
      return { ...config, body: config.data }
    },
    async (error) => {
      // const _errorResponse = error.response
      // const originalRequest = error.config
      // const status = _errorResponse.status
      const authStore = useAuthStore()
      // // check it is login/refresh request, logout
      // if (['/login/refresh'].includes(originalRequest.url)) {
      //   await authStore.logout()
      //   return Promise.reject(error)
      // }
      // // const { authService } = _useAPI()

      // switch (status) {
      //   case 401:
      //     if (['/logout'].includes(originalRequest.url)) {
      //       // if auth_code request fails, redirect to login page
      //       window.location.href = '/login?redirect=/mvno-mos/'
      //     } else if (['/login/refresh'].includes(originalRequest.url)) {
      //       await authStore.logout()
      //       return Promise.reject(error)
      //     } else {
      //       // retry with refrest token first
      //       if (!originalRequest._retry) {
      //         // save request if it is not refresh token request
      //         if (isRefreshingToken) {
      //           return new Promise(function (resolve) {
      //             requestsPending.push(function () {
      //               resolve(newInstance(originalRequest))
      //             })
      //           })
      //         }
      //         originalRequest._retry = true
      //         isRefreshingToken = true

      //         try {
      //           const refreshTokenRes = await authStore.refreshToken()

      //           if (refreshTokenRes) {
      //             originalRequest.headers['Authorization']
      //               = 'Bearer ' + refreshTokenRes.token
      //             return newInstance(originalRequest)
      //           } else {
      //             await authStore.logout()
      //           }
      //         } catch (refreshError) {
      //           isRefreshingToken = false
      //           await authStore.logout()
      //           return Promise.reject(refreshError)
      //         } finally {
      //           isRefreshingToken = false
      //           requestsPending.forEach(callback => callback())
      //           requestsPending = []
      //         }
      //       } else {
      //         await authStore.logout()
      //       }
      //     }

      //     authStore.logout()
      //     break
      //   case 404:
      //     break

      //   default:
      //     toast.add({
      //       id: 'error',
      //       title: 'エラー',
      //       description: 'エラーが発生しました。' + error.message,
      //       color: 'red'
      //     })
      //     break
      // }

      return Promise.reject(error)
    }
  )

  return newInstance
}

const _useAPI = () => {
  const runtimeConfig = useRuntimeConfig()
  const apiService = createAxios(runtimeConfig.public.api.imagenproService)
  return {
    apiService
  }
}

export const useAPI = _useAPI
