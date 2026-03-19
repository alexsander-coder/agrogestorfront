"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { stockService } from "@/services/stock.service"

export default function NewStockItemPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [unit, setUnit] = useState("")
  const [minimumStock, setMinimumStock] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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

      await stockService.createItem({
        name: name.trim(),
        description: description.trim() || undefined,
        unit: unit.trim(),
        minimumStock: parsedMinimumStock
      })

      setSuccess("Item cadastrado com sucesso.")

      setName("")
      setDescription("")
      setUnit("")
      setMinimumStock("")

      setTimeout(() => {
        router.push("/estoque")
      }, 1000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível cadastrar o item."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Cadastrar Item</h1>
        <p className="text-sm text-gray-500">
          Cadastre um novo produto ou insumo para controle de estoque.
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
                placeholder="Ex.: Semente Soja"
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
                  placeholder="Ex.: 50"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
                />
              </div>
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
                className="rounded-xl bg-rocket-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Cadastrar Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}