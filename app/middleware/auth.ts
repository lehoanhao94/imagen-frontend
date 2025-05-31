export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Kiểm tra xem user đã đăng nhập chưa
  if (!authStore.isAuthenticated) {
    // Nếu chưa đăng nhập, redirect về trang login
    return navigateTo('/auth/login')
  }

  // Kiểm tra xem account đã được verify chưa (tùy chọn)
  if (authStore.isNotVerifyAccount) {
    // Có thể redirect về trang verify account hoặc hiển thị thông báo
    // Tạm thời cho phép truy cập nhưng có thể thêm logic khác ở đây
    console.warn('Account not verified yet')
  }
})
