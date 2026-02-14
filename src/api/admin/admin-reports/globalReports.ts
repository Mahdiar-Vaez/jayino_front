import api from "../../axios";

export const reportsApi = {
  // ... (موجود)
  getDailyIncome: (date: string) =>
    api.get('/parking/reports/daily-income', { params: { date } }),
  getTotalIncome: () => api.get('/parking/reports/total-income'),
  getVehicleCounts: () => api.get('/parking/reports/vehicle-counts'),
  getPeakHours: () => api.get('/parking/reports/peak-hours'),
  getPaymentMethodIncome: () => api.get('/parking/reports/payment-method'),

  // جدید: دریافت لیست گزارش‌های روزانه
  getDailyReports: (params?: { page?: number; limit?: number; sort?: string }) =>
    api.get('/daily-reports', { params }),

  // جدید: بستن روز جاری
  closeDay: () => api.post('/daily-reports/end-day'),
};