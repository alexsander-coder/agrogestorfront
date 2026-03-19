import type { DieselRefuel } from "@/types/dashboard.types"

export interface DieselChartData {
  totalLiters: number
  totalRefuels: number
  chartData: {
    day: string
    liters: number
  }[]
}

export function buildDieselChartData(
  refuels: DieselRefuel[],
  month: string
): DieselChartData {
  const [year, monthNumber] = month.split("-").map(Number)
  const daysInMonth = new Date(year, monthNumber, 0).getDate()

  const litersByDay = new Map<number, number>()

  for (let day = 1; day <= daysInMonth; day++) {
    litersByDay.set(day, 0)
  }

  let totalLiters = 0

  for (const refuel of refuels) {
    totalLiters += refuel.liters

    const date = new Date(refuel.createdAt)
    const day = date.getDate()

    litersByDay.set(day, (litersByDay.get(day) || 0) + refuel.liters)
  }

  const chartData = Array.from(litersByDay.entries()).map(([day, liters]) => ({
    day: String(day).padStart(2, "0"),
    liters
  }))

  return {
    totalLiters,
    totalRefuels: refuels.length,
    chartData
  }
}