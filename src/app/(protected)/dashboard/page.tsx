"use client"

import { memo, useEffect, useState } from "react"
import { dashboardService } from "@/services/dashboard.service"

import ProductionChart from "@/components/charts/ProductionChart"
import FinanceChart from "@/components/charts/FinanceChart"
import MonthlyChart from "@/components/charts/MonthlyChart"
import OverviewCards from "@/components/dashboard/OverviewCards"

function DashboardPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const [prod, fin, monthly, overview] = await Promise.all([
        dashboardService.getProduction(),
        dashboardService.getFinance(),
        dashboardService.getMonthly(),
        dashboardService.getOverview()
      ])

      setData({
        production: prod.data,
        finance: fin.data,
        monthly: monthly.data,
        overview: overview.data
      })
    }

    load()
  }, [])

  if (!data) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        Carregando...
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header da página */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Visão geral da fazenda
        </p>
      </div>

      {/* Cards */}
      <OverviewCards data={data.overview} />

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* gráfico grande */}
        <div className="lg:col-span-2">
          <FinanceChart data={data.monthly} />
        </div>

        {/* gráfico lateral */}
        <MonthlyChart data={data.monthly} />

      </div>

      {/* gráfico inferior */}
      <ProductionChart data={data.production} />

    </div>
  )
}

export default memo(DashboardPage)