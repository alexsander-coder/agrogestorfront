"use client"

type Item = {
  id: string
  name: string
  stock: number
  minimumStock: number
}

export default function LowStockTable({ items }: { items: Item[] }) {

  const lowItems = items
    .filter(item => item.stock <= item.minimumStock)
    .sort((a, b) => a.stock - b.stock) // 🔥 mais crítico primeiro

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Estoque - Itens Baixos
        </h2>

        <button className="text-sm text-green-600 hover:underline">
          Ver todos
        </button>
      </div>

      {/* Tabela */}
      <div className="space-y-3">

        {/* Cabeçalho */}
        <div className="grid grid-cols-3 text-xs text-gray-400 font-medium px-1">
          <span>Item</span>
          <span>Estoque</span>
          <span className="text-right">Mínimo</span>
        </div>

        {/* Linhas */}
        {lowItems.map(item => {

          const percent = (item.stock / item.minimumStock) * 100

          const color =
            item.stock === 0
              ? "bg-red-500"
              : item.stock < item.minimumStock
                ? "bg-orange-400"
                : "bg-green-500"

          const textColor =
            item.stock === 0
              ? "text-red-600"
              : item.stock < item.minimumStock
                ? "text-orange-500"
                : "text-green-600"

          return (
            <div key={item.id} className="grid grid-cols-3 items-center gap-2">

              {/* ITEM */}
              <span className="text-sm text-gray-700">
                {item.name}
              </span>

              {/* ESTOQUE + BARRA */}
              <div className="flex items-center gap-2">

                <span className={`text-sm font-semibold ${textColor}`}>
                  {item.stock}
                </span>

                <div className="flex-1 h-1.5 bg-gray-200 rounded">
                  <div
                    className={`h-1.5 rounded ${color}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>

              </div>

              {/* MÍNIMO */}
              <span className="text-sm text-gray-400 text-right">
                {item.minimumStock}
              </span>

            </div>
          )
        })}

      </div>

    </div>
  )
}