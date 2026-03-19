export interface StockItem {
  id: string
  name: string
  description: string | null
  unit: string
  stock: number
  minimumStock: number
  createdAt: string
  updatedAt: string
}

export interface StockMovementPayload {
  itemId: string
  quantity: number
  reason: string
}

export interface CreateStockItemPayload {
  name: string
  description?: string
  unit: string
  minimumStock: number
}

export interface UpdateStockItemPayload {
  name?: string
  description?: string
  unit?: string
  minimumStock?: number
}