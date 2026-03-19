"use client"

import { FormEvent, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { stockService } from "@/services/stock.service"

export default function EditStockItemPage() {
  const router = useRouter()
  const params = useParams()

  const id = String(params.id)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [unit, setUnit] = useState("")
  const [minimumStock, setMinimumStock] = useState("")

  const [loadingItem, setLoadingItem] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function loadItem() {
      try {
        setLoadingItem(true)
        setError("")

        const response = await stockService.getItemById(id)
        const item = response.data

        setName(item.name || "")
        setDescription(item.description || "")
        setUnit(item.unit || "")
        setMinimumStock(String(item.minimumStock ?? ""))
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          "Não foi possível carregar os dados do item."
        )
      } finally {
        setLoadingItem(false)
      }
    }

    if (id) {
      loadItem()
    }
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (!name.trim()) {
      setError("Informe o nome do item.")
      return
    }

    if (!unit.trim()) {
      setError("Informe a unidade do item.")
      return
    }

    if (!minimumStock.trim()) {
      setError("Informe o estoque mínimo.")
      return
    }

    const parsedMinimumStock = Number(minimumStock)

    if (Number.isNaN(parsedMinimumStock) || parsedMinimumStock < 0) {
      setError("Informe um estoque mínimo válido.")
      return
    }

    try {
      setLoading(true)

      await stockService.updateItem(id, {
        name: name.trim(),
        description: description.trim() || undefined,
        unit: unit.trim(),
        minimumStock: parsedMinimumStock
      })

      setSuccess("Item atualizado com sucesso.")

      setTimeout(() => {
        router.push("/estoque")
      }, 1000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível atualizar o item."
      )
    } finally {
      setLoading(false)
    }
  }

  if (loadingItem) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Editar Item</h1>
          <p className="text-sm text-gray-500">
            Atualize os dados cadastrais do item de estoque.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Carregando dados do item...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Editar Item</h1>
        <p className="text-sm text-gray-500">
          Atualize os dados cadastrais do item de estoque.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nome do Item
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Semente Soja RR"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ex.: Soja RR"
                rows={4}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Unidade
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                  placeholder="Ex.: kg"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Estoque Mínimo
                </label>
                <input
                  type="number"
                  min="0"
                  value={minimumStock}
                  onChange={(event) => setMinimumStock(event.target.value)}
                  placeholder="Ex.: 60"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
                />
              </div>
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              Esta tela altera apenas os dados cadastrais do item. Movimentações de
              estoque devem ser feitas pelas telas de Entrada, Saída ou Ajuste.
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
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Pencil size={16} />
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}