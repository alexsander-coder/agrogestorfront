"use client"

import { memo, useMemo } from "react"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts"

function ProductionChart({ data }: any) {

  const chartData = useMemo(
    () =>
      data.labels.map((label: string, i: number) => ({
        name: label,
        value: data.data[i],
      })),
    [data],
  )

  return (
    <div className="bg-white p-3 rounded-xl shadow-sm">
      <h3 className="text-sm font-medium mb-4">Produção</h3>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default memo(ProductionChart)