import { api } from "./api"

export const plantingService = {
  getPlantings: () => api.get("/plantings"),

  getPlantingById: (id: string) => api.get(`/plantings/${id}`),

  createPlanting: (payload: {
    areaId: string
    cropId: string
    seasonId: string
    plantingDate: string
    inputs: {
      itemId: string
      quantity: number
    }[]
  }) => api.post("/plantings", payload)
}