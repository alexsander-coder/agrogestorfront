import { api } from "./api"

export const dashboardService = {
  getProduction: () => api.get("/dashboard/charts/production"),
  getFinance: () => api.get("/dashboard/charts/finance"),
  getMonthly: () => api.get("/dashboard/charts/finance/monthly"),
  getOverview: () => api.get("/dashboard/overview")
}