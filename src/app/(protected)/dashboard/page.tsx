"use client"

import { memo, useEffect, useState } from "react"
import { dashboardService } from "@/services/dashboard.service"

import ProductionChart from "@/components/charts/ProductionChart"
import FinanceChart from "@/components/charts/FinanceChart"
import MonthlyChart from "@/components/charts/MonthlyChart"
import OverviewCards from "@/components/dashboard/OverviewCards"
import LowStockTable from "@/components/dashboard/LowStockTable"
import DieselConsumptionCard from "@/components/dashboard/DieselConsumptionCard"

function getCurrentMonth() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

function DashboardPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const currentMonth = getCurrentMonth()

      const [prod, fin, monthly, overview, stock, diesel] = await Promise.all([
        dashboardService.getProduction(),
        dashboardService.getFinance(),
        dashboardService.getMonthly(),
        dashboardService.getOverview(),
        dashboardService.getLowStockItems(),
        dashboardService.getDieselConsumption(currentMonth),
      ])

      setData({
        production: prod.data,
        finance: fin.data,
        monthly: monthly.data,
        overview: overview.data,
        stock: stock.data,
        diesel: diesel.data,
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
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Visão geral da fazenda
        </p>
      </div>

      <OverviewCards data={data.overview} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FinanceChart data={data.monthly} />
        </div>

        <LowStockTable items={data.stock} />


        <MonthlyChart data={data.monthly} />

        <div className="lg:col-span-2">
          <DieselConsumptionCard refuels={data.diesel} />
        </div>

        <ProductionChart data={data.production} />
      </div>
    </div>
  )
}

export default memo(DashboardPage)