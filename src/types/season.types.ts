export interface Season {
  id: string
  name: string
  startDate: string
  endDate: string | null
  createdAt: string
}

export interface CreateSeasonPayload {
  name: string
  startDate: string
  endDate?: string | null
}

export interface UpdateSeasonPayload {
  name?: string
  startDate?: string
  endDate?: string | null
}