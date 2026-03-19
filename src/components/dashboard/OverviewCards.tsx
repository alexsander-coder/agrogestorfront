import { memo, useMemo } from "react"
import {
  Sprout,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

function OverviewCards({ data }: any) {
  const cards = useMemo(
    () => [
      {
        label: "Colhido (kg)",
        value: data.totalHarvestKg,
        icon: Sprout,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        label: "Vendido (kg)",
        value: data.totalSoldKg,
        icon: ShoppingCart,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        label: "Receita",
        value: data.revenue,
        icon: DollarSign,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        highlight: "text-green-600",
      },
      {
        label: "Lucro",
        value: data.profit,
        icon: data.profit >= 0 ? TrendingUp : TrendingDown,
        iconBg: data.profit >= 0 ? "bg-green-50" : "bg-red-50",
        iconColor: data.profit >= 0 ? "text-green-600" : "text-red-500",
        highlight: data.profit >= 0 ? "text-green-600" : "text-red-500",
      },
    ],
    [data],
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div
            key={card.label}
            className="
              bg-white rounded-2xl p-4
              border border-gray-100
              shadow-sm
              hover:shadow-md
              transition-all
            "
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center
                            ${card.iconBg}
                          `}
              >
                <Icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
              </div>

              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {card.label}
              </p>
            </div>

            <p
              className={`
                mt-3 text-[1.2rem] font-semibold tracking-tight
                ${card.highlight ?? "text-gray-900"}
              `}
            >
              {formatValue(card.value)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function formatValue(value: number) {
  if (typeof value !== "number") return "-"

  return value.toLocaleString("pt-BR", {
    maximumFractionDigits: 0,
  })
}

export default memo(OverviewCards)