"use client"

import { memo, useMemo } from "react"
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

function MonthlyChart({ data }: any) {
  const chartData = useMemo(
    () =>
      data.labels.map((label: string, i: number) => ({
        name: label,
        income: data.income[i],
        expenses: data.expenses[i],
      })),
    [data],
  )

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h3 className="text-sm text-gray-600 font-semibold mb-4">
        Consumo / Evolução
      </h3>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#16a34a"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default memo(MonthlyChart)