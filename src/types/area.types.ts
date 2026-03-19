export interface Area {
  id: string
  name: string
  size: number
}

export interface CreateAreaPayload {
  name: string
  size: number
}