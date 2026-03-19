import { api } from "./api"

export const seasonService = {

  getSeasons: () => api.get("/seasons"),

  getSeasonById: (id: string) => api.get(`/seasons/${id}`),

  createSeason: (payload: {
    name: string
    startDate: string
    endDate?: string | null
  }) => api.post("/seasons", payload),

  updateSeason: (
    id: string,
    payload: {
      name?: string
      startDate?: string
      endDate?: string | null
    }
  ) => api.patch(`/seasons/${id}`, payload),

  deleteSeason: (id: string) => api.delete(`/seasons/${id}`)
}