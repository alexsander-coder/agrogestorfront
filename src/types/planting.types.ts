export interface PlantingInputItem {
  id: string
  plantingId: string
  itemId: string
  quantity: number
  item: {
    id: string
    name: string
    description: string | null
    unit: string
    stock: number
    minimumStock: number
    createdAt: string
    updatedAt: string
  }
}

export interface PlantingArea {
  id: string
  name: string
  size: number
}

export interface PlantingCrop {
  id: string
  name: string
}

export interface PlantingSeason {
  id: string
  name: string
  startDate: string
  endDate: string | null
  createdAt: string
}

export interface PlantingHarvest {
  id: string
  plantingId: string
  quantity: number
  harvestDate: string
} null

export interface Planting {
  id: string
  areaId: string
  cropId: string
  seasonId: string
  plantingDate: string
  area: PlantingArea
  crop: PlantingCrop
  season: PlantingSeason
  inputs: PlantingInputItem[]
  harvest: PlantingHarvest
}

export interface CreatePlantingPayload {
  areaId: string
  cropId: string
  seasonId: string
  plantingDate: string
  inputs: {
    itemId: string
    quantity: number
  }[]
}