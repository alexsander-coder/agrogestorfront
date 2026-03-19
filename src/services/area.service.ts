import { api } from "./api"

export const areaService = {
  getAreas: () => api.get("/areas"),

  createArea: (payload: {
    name: string
    size: number
  }) => api.post("/areas/area", payload)
}