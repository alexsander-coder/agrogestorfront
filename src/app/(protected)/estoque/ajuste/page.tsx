"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { stockService } from "@/services/stock.service"
import { StockItem } from "@/types/stock.types"

export default function StockAdjustPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [items, setItems] = useState<StockItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  const [itemId, setItemId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const queryItemId = searchParams.get("itemId")

  useEffect(() => {
    async function loadItems() {
      try {
        setLoadingItems(true)
        setError("")

        const response = await stockService.getItems()
        const loadedItems = response.data as StockItem[]

        setItems(loadedItems)

        if (queryItemId) {
          const itemExists = loadedItems.some((item) => item.id === queryItemId)

          if (itemExists) {
            setItemId(queryItemId)
          }
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          "Não foi possível carregar os itens do estoque."
        )
      } finally {
        setLoadingItems(false)
      }
    }

    loadItems()
  }, [queryItemId])

  const selectedItem = useMemo(() => {
    return items.find((item) => item.id === itemId) || null
  }, [items, itemId])

  const parsedQuantity = Number(quantity)
  const hasValidQuantity =
    quantity.trim() !== "" && !Number.isNaN(parsedQuantity) && parsedQuantity >= 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (!itemId) {
      setError("Selecione um item.")
      return
    }

    if (!quantity.trim()) {
      setError("Informe a nova quantidade do estoque.")
      return
    }

    if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
      setError("Informe uma quantidade válida maior ou igual a zero.")
      return
    }

    if (!reason.trim()) {
      setError("Informe o motivo do ajuste.")
      return
    }

    try {
      setLoading(true)

      await stockService.adjust({
        itemId,
        quantity: parsedQuantity,
        reason: reason.trim()
      })

      setSuccess("Ajuste de estoque registrado com sucesso.")

      setQuantity("")
      setReason("")

      setTimeout(() => {
        router.push("/estoque")
      }, 1000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível registrar o ajuste de estoque."
      )
    } finally {
      setLoading(false)
    }
  }

  function getDifferenceLabel() {
    if (!selectedItem || !hasValidQuantity) return null

    const difference = parsedQuantity - selectedItem.stock

    if (difference === 0) {
      return {
        text: "O saldo permanecerá inalterado.",
        className: "border-slate-200 bg-slate-50 text-slate-700"
      }
    }

    if (difference > 0) {
      return {
        text: `O estoque será ajustado com acréscimo de ${difference} ${selectedItem.unit}.`,
        className: "border-emerald-200 bg-emerald-50 text-emerald-700"
      }
    }

    return {
      text: `O estoque será ajustado com redução de ${Math.abs(difference)} ${selectedItem.unit}.`,
      className: "border-amber-200 bg-amber-50 text-amber-700"
    }
  }

  const differenceInfo = getDifferenceLabel()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Ajuste de Estoque
        </h1>
        <p className="text-sm text-gray-500">
          Defina o saldo real do item conforme inventário, conferência ou correção operacional.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Item
              </label>

              <select
                value={itemId}
                onChange={(event) => setItemId(event.target.value)}
                disabled={loadingItems}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option value="">
                  {loadingItems ? "Carregando itens..." : "Selecione um item"}
                </option>

                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - Estoque atual: {item.stock} {item.unit}
                  </option>
                ))}
              </select>
            </div>

            {selectedItem && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-sky-100 p-2">
                    <SlidersHorizontal size={16} className="text-sky-700" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedItem.name}
                    </p>

                    <p className="text-sm text-slate-600">
                      Unidade: {selectedItem.unit}
                    </p>

                    <p className="text-sm text-slate-600">
                      Estoque atual:{" "}
                      <span className="font-medium text-slate-900">
                        {selectedItem.stock} {selectedItem.unit}
                      </span>
                    </p>

                    <p className="text-sm text-slate-600">
                      Estoque mínimo:{" "}
                      <span className="font-medium text-slate-900">
                        {selectedItem.minimumStock} {selectedItem.unit}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Novo Saldo do Estoque
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="Ex.: 240"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Unidade
                </label>
                <input
                  type="text"
                  value={selectedItem?.unit || ""}
                  disabled
                  placeholder="Unidade do item"
                  className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                />
              </div>
            </div>

            {selectedItem && hasValidQuantity && (
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
                Novo saldo após o ajuste:{" "}
                <span className="font-semibold">
                  {parsedQuantity} {selectedItem.unit}
                </span>
              </div>
            )}

            {selectedItem && differenceInfo && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${differenceInfo.className}`}
              >
                {differenceInfo.text}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Motivo do Ajuste
              </label>
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Ex.: Inventário realizado / correção de saldo"
                rows={4}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/estoque")}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading || loadingItems}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SlidersHorizontal size={16} />
                {loading ? "Salvando..." : "Registrar Ajuste"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}