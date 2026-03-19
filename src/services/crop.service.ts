import { api } from "./api"

export const cropService = {
  getCrops: () => api.get("/crops"),

  createCrop: (payload: {
    name: string
  }) => api.post("/crops", payload)
}