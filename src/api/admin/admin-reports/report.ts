// src/api/parkingReport.api.ts
import api from "../../axios";

export type RevenueType = "DAILY" | "MONTHLY" | "YEARLY";

export const parkingReportApi = {
  getParkingStatus: () =>
    api.get("/parking-reports/parking-status"),

  getRevenueChart: (params: {
    type: RevenueType;
    year?: number; // ✅ سال شمسی
  }) =>
    api.get("/parking-reports/revenue", { params }),

  getTodayRevenue: () =>
    api.get("/parking-reports/revenue-today"),

  getTodayExits: () =>
    api.get("/parking-reports/today-exit"),
};
