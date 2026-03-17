"use client"

import { memo, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

function FinanceChart({ data }: any) {

  const chartData = useMemo(
    () =>
      data.labels.map((label: string, i: number) => ({
        name: label,
        entradas: data.income?.[i] || data.data?.[i] || 0,
        saidas: data.expenses?.[i] || 0,
      })),
    [data],
  )

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <div className="flex justify-between mb-4">
        <h3 className="text-sm font-semibold">Movimentações Financeiras</h3>
        <span className="text-sm text-green-600 cursor-pointer">Ver todas</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          <Tooltip />

          <Bar dataKey="entradas" fill="#16a34a" radius={[6, 6, 0, 0]} />
          <Bar dataKey="saidas" fill="#ef4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default memo(FinanceChart)