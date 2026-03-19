export interface DieselRefuel {
  id: string
  vehicleId: string
  tankId: string
  liters: number
  odometer: number
  createdAt: string
  vehicle: {
    id: string
    plate: string
    model: string
    brand: string
    year: number
    odometer: number
    createdAt: string
  }
  tank: {
    id: string
    name: string
    capacity: number
    level: number
  }
}

export interface DieselChartPoint {
  day: string
  liters: number
}

export interface DieselConsumptionCardData {
  totalLiters: number
  chartData: DieselChartPoint[]
}