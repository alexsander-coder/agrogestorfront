"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Plus, Sprout } from "lucide-react"
import { plantingService } from "@/services/planting.service"
import { Planting } from "@/types/planting.types"

export default function PlantingsPage() {
  const [plantings, setPlantings] = useState<Planting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadPlantings() {
    try {
      setLoading(true)
      setError("")

      const response = await plantingService.getPlantings()
      setPlantings(response.data)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível carregar os plantios."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlantings()
  }, [])

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short"
    }).format(new Date(value))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Plantios</h1>
          <p className="text-sm text-gray-500">
            Gerencie os plantios cadastrados no sistema.
          </p>
        </div>

        <Link
          href="/plantio/novo"
          className="inline-flex items-center gap-2 rounded-xl bg-rocket-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Novo Plantio
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-600">
            Plantios cadastrados
          </h2>
        </div>

        {loading && (
          <div className="p-6 text-sm text-slate-600">
            Carregando plantios...
          </div>
        )}

        {!loading && error && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && plantings.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Sprout className="text-slate-700" size={22} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Nenhum plantio cadastrado
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Cadastre o primeiro plantio para começar.
            </p>

            <Link
              href="/plantio/novo"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rocket-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Cadastrar primeiro plantio
            </Link>
          </div>
        )}

        {!loading && !error && plantings.length > 0 && (
          <div className="space-y-4 p-4">
            {plantings.map((planting) => (
              <div
                key={planting.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      {planting.crop.name} • {planting.area.name}
                    </h3>

                    <p className="text-sm text-slate-600">
                      Safra: <span className="font-medium">{planting.season.name}</span>
                    </p>

                    <p className="text-sm text-slate-600">
                      Data do plantio:{" "}
                      <span className="font-medium">
                        {formatDate(planting.plantingDate)}
                      </span>
                    </p>

                    <p className="text-sm text-slate-600">
                      Área: <span className="font-medium">{planting.area.size} ha</span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                    {planting.inputs.length} insumo(s)
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {planting.inputs.map((input) => (
                    <div
                      key={input.id}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {input.item.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        Quantidade: {input.quantity} {input.item.unit}
                      </p>
                    </div>
                  ))}
                </div>

                {planting.harvest && (
                  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Colheita registrada: {planting.harvest.quantity} em{" "}
                    {formatDate(planting.harvest.harvestDate)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}