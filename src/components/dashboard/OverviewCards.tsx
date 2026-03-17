import { memo, useMemo } from "react"

function OverviewCards({ data }: any) {
  const cards = useMemo(
    () => [
      {
        label: "Colhido (kg)",
        value: data.totalHarvestKg,
      },
      {
        label: "Vendido (kg)",
        value: data.totalSoldKg,
      },
      {
        label: "Receita",
        value: data.revenue,
        highlight: "text-green-600"
      },
      {
        label: "Lucro",
        value: data.profit,
        highlight: data.profit >= 0 ? "text-green-600" : "text-red-500"
      }
    ],
    [data],
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="
            bg-white rounded-2xl p-5
            border border-gray-100
            shadow-sm
            hover:shadow-md
            transition-all
          "
        >
          {/* label */}
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {card.label}
          </p>

          {/* valor */}
          <p
            className={`
              mt-2 text-[1.3rem] font-semibold tracking-tight
              ${card.highlight ?? "text-gray-900"}
            `}
          >
            {formatValue(card.value)}
          </p>
        </div>
      ))}
    </div>
  )
}

function formatValue(value: number) {
  if (typeof value !== "number") return "-"

  return value.toLocaleString("pt-BR", {
    maximumFractionDigits: 0
  })
}

export default memo(OverviewCards)