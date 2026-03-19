"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface DieselRefuel {
  id: string
  liters: number
  odometer: number
  createdAt: string
}

interface DieselConsumptionCardProps {
  refuels: DieselRefuel[]
}

function getCurrentMonthInfo() {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

function buildChartData(refuels: DieselRefuel[]) {
  const { year, month } = getCurrentMonthInfo()
  const daysInMonth = new Date(year, month, 0).getDate()

  const litersByDay = new Map<number, number>()

  for (let day = 1; day <= daysInMonth; day++) {
    litersByDay.set(day, 0)
  }

  for (const item of refuels) {
    const date = new Date(item.createdAt)
    const day = date.getDate()

    litersByDay.set(day, (litersByDay.get(day) || 0) + item.liters)
  }

  return Array.from(litersByDay.entries()).map(([day, liters]) => ({
    day: String(day).padStart(2, "0"),
    liters,
  }))
}

function DieselConsumptionCard({ refuels }: DieselConsumptionCardProps) {
  const totalLiters = refuels.reduce((acc, item) => acc + item.liters, 0)
  const chartData = buildChartData(refuels)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm text-gray-600 font-semibold">
            Consumo de Diesel
          </h3>
          <p className="text-sm text-gray-500">Mês atual</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Total:</p>
          <p className="text-2x1 font-bold text-gray-700">
            {totalLiters.toLocaleString("pt-BR")} Litros
          </p>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="dieselFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#e5e7eb" />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <Tooltip
              formatter={(value) => [`${Number(value ?? 0)} L`, "Consumo"]}
              labelFormatter={(label) => `Dia ${label}`}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
              }}
            />

            <Area
              type="monotone"
              dataKey="liters"
              stroke="#15803d"
              strokeWidth={3}
              fill="url(#dieselFill)"
              dot={{ r: 4, fill: "#15803d" }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DieselConsumptionCard