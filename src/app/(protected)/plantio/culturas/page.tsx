"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Plus, Sprout } from "lucide-react"
import { cropService } from "@/services/crop.service"
import { Crop } from "@/types/crop.types"

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadCrops() {
    try {
      setLoading(true)
      setError("")

      const response = await cropService.getCrops()
      setCrops(response.data)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível carregar as culturas."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCrops()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Culturas</h1>
          <p className="text-sm text-gray-500">
            Gerencie as culturas cadastradas no sistema.
          </p>
        </div>

        <Link
          href="/plantio/culturas/novo"
          className="inline-flex items-center gap-2 rounded-xl bg-rocket-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Cadastrar Cultura
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-600">
            Culturas cadastradas
          </h2>
        </div>

        {loading && (
          <div className="p-6 text-sm text-slate-600">
            Carregando culturas...
          </div>
        )}

        {!loading && error && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && crops.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Sprout className="text-slate-700" size={22} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Nenhuma cultura cadastrada
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Cadastre a primeira cultura para começar.
            </p>

            <Link
              href="/plantio/culturas/novo"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rocket-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Cadastrar primeira cultura
            </Link>
          </div>
        )}

        {!loading && !error && crops.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Nome
                  </th>
                </tr>
              </thead>

              <tbody>
                {crops.map((crop) => (
                  <tr
                    key={crop.id}
                    className="border-t border-slate-200 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{crop.name}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}