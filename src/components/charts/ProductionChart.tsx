"use client"

import Link from "next/link"
import { memo, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

function ProductionChart({ data }: any) {
  const chartData = useMemo(
    () =>
      data?.labels?.map((label: string, i: number) => ({
        name: label,
        value: data.data[i],
      })) ?? [],
    [data],
  )

  if (!chartData.length) {
    return (
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm text-gray-600 font-semibold">Produção</h3>

          <Link
            href="/producao"
            className="text-sm font-medium text-[#0e6a3a] hover:underline"
          >
            Ver todos...
          </Link>
        </div>

        <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">
          Nenhum dado disponível
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm text-gray-600 font-semibold">Produção</h3>

        <button className="text-sm text-green-600 hover:underline">
          Ver detalhes
        </button>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#e5e7eb" />

          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />

          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            formatter={(value) => [
              `${Number(value ?? 0).toLocaleString("pt-BR")} kg`,
              "Produção",
            ]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          />

          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            fill="#0e6a3a"
            maxBarSize={42}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default memo(ProductionChart)