import { api } from "./api"

export const stockService = {
  getItems: () => api.get("/estoque/item"),

  getItemById: (id: string) => api.get(`/estoque/item/${id}`),

  createItem: (payload: {
    name: string
    description?: string
    unit: string
    minimumStock: number
  }) => api.post("/estoque/item", payload),

  updateItem: (
    id: string,
    payload: {
      name?: string
      description?: string
      unit?: string
      minimumStock?: number
    }
  ) => api.patch(`/estoque/item/${id}`, payload),

  deleteItem: (id: string) => api.delete(`/estoque/item/${id}`),

  entry: (payload: {
    itemId: string
    quantity: number
    reason: string
  }) => api.post("/estoque/entry", payload),

  exit: (payload: {
    itemId: string
    quantity: number
    reason: string
  }) => api.post("/estoque/exit", payload),

  adjust: (payload: {
    itemId: string
    quantity: number
    reason: string
  }) => api.post("/estoque/adjust", payload)
}