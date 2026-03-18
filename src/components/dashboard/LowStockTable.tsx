"use client"

type Item = {
  id: string
  name: string
  stock: number
  minimumStock: number
}

export default function StockTable({ items }: { items: Item[] }) {
  // Ordena do menor estoque para o maior
  const sortedItems = [...items].sort((a, b) => a.stock - b.stock)

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm text-gray-600 font-semibold">
          Estoque - Todos os Itens
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
        {sortedItems.map((item) => {
          const rawPercent =
            item.minimumStock > 0
              ? (item.stock / item.minimumStock) * 100
              : 0

          // 🔥 largura visível (mínimo 5%, exceto quando 0)
          const width =
            item.stock === 0
              ? 0
              : Math.max(Math.min(rawPercent, 100), 5)

          const isCritical = item.stock === 0
          const isLow = item.stock < item.minimumStock

          return (
            <div
              key={item.id}
              className="grid grid-cols-3 items-center gap-2"
            >
              {/* ITEM */}
              <span className="text-sm text-gray-600 font-semibold">
                {item.name}
              </span>

              {/* ESTOQUE + BARRA */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${isCritical
                    ? "text-red-600"
                    : isLow
                      ? "text-orange-500"
                      : "text-green-600"
                    } `}
                >
                  {item.stock}
                </span>

                <div className="flex-1 h-1.5 bg-gray-200 rounded">
                  <div
                    className={`h-1.5 rounded transition-all duration-300 ${isCritical
                      ? "bg-red-500"
                      : isLow
                        ? "bg-orange-400"
                        : "bg-green-500"
                      } `}
                    style={{
                      width: `${width}% `,
                    }}
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