import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
  googleAuth: (data) => api.post('/auth/google', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getTrending: () => api.get('/products/trending'),
  getOnSale: () => api.get('/products/sale'),
  getRelated: (id) => api.get(`/products/${id}/related`),
  aiSearch: (q) => api.get('/products/ai-search', { params: { q } }),
  aiRecommend: (params) => api.get('/products/ai-recommendations', { params }),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  bulkUpload: (data) => api.post('/products/bulk-upload', data),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getByNumber: (num) => api.get(`/orders/${num}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  requestReturn: (id, data) => api.post(`/orders/${id}/return`, data),
  getDashboardStats: () => api.get('/orders/dashboard-stats'),
};

export const paymentAPI = {
  create: (data) => api.post('/payments', data),
  verify: (data) => api.post('/payments/verify', data),
  uploadScreenshot: (id, data) => api.post(`/payments/${id}/screenshot`, data),
  getAll: (params) => api.get('/payments', { params }),
  getUpiConfigs: () => api.get('/payments/upi-configs'),
  createUpiConfig: (data) => api.post('/payments/upi-configs', data),
  updateUpiConfig: (id, data) => api.put(`/payments/upi-configs/${id}`, data),
  deleteUpiConfig: (id) => api.delete(`/payments/upi-configs/${id}`),
  getRevenueReport: (params) => api.get('/payments/revenue-report', { params }),
};

export const couponAPI = {
  validate: (data) => api.post('/coupons/validate', data),
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  addAddress: (data) => api.post('/users/address', data),
  updateAddress: (id, data) => api.put(`/users/address/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/address/${id}`),
  addToWishlist: (id) => api.post(`/users/wishlist/${id}`),
  removeFromWishlist: (id) => api.delete(`/users/wishlist/${id}`),
  getStats: () => api.get('/users/stats'),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  create: (data) => api.post('/notifications', data),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export const bannerAPI = {
  getAll: () => api.get('/banners'),
  create: (data) => api.post('/banners', data),
  update: (id, data) => api.put(`/banners/${id}`, data),
  delete: (id) => api.delete(`/banners/${id}`),
};

export default api;
