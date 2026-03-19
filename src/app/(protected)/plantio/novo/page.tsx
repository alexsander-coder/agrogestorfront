"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { areaService } from "@/services/area.service"
import { cropService } from "@/services/crop.service"
import { seasonService } from "@/services/season.service"
import { stockService } from "@/services/stock.service"
import { plantingService } from "@/services/planting.service"
import { Area } from "@/types/area.types"
import { Crop } from "@/types/crop.types"
import { Season } from "@/types/season.types"
import { StockItem } from "@/types/stock.types"

type PlantingInputForm = {
  itemId: string
  quantity: string
}

export default function NewPlantingPage() {
  const router = useRouter()

  const [areas, setAreas] = useState<Area[]>([])
  const [crops, setCrops] = useState<Crop[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [stockItems, setStockItems] = useState<StockItem[]>([])

  const [loadingDependencies, setLoadingDependencies] = useState(true)

  const [areaId, setAreaId] = useState("")
  const [cropId, setCropId] = useState("")
  const [seasonId, setSeasonId] = useState("")
  const [plantingDate, setPlantingDate] = useState("")

  const [inputs, setInputs] = useState<PlantingInputForm[]>([
    { itemId: "", quantity: "" }
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function loadDependencies() {
      try {
        setLoadingDependencies(true)
        setError("")

        const [areasRes, cropsRes, seasonsRes, stockRes] = await Promise.all([
          areaService.getAreas(),
          cropService.getCrops(),
          seasonService.getSeasons(),
          stockService.getItems()
        ])

        setAreas(areasRes.data)
        setCrops(cropsRes.data)
        setSeasons(seasonsRes.data)
        setStockItems(stockRes.data)
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          "Não foi possível carregar os dados necessários para o plantio."
        )
      } finally {
        setLoadingDependencies(false)
      }
    }

    loadDependencies()
  }, [])

  function addInputRow() {
    setInputs((prev) => [...prev, { itemId: "", quantity: "" }])
  }

  function removeInputRow(index: number) {
    setInputs((prev) => prev.filter((_, i) => i !== index))
  }

  function updateInputRow(index: number, field: "itemId" | "quantity", value: string) {
    setInputs((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    )
  }

  function toIsoDate(dateValue: string) {
    return new Date(`${dateValue}T00:00:00`).toISOString()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (!areaId) {
      setError("Selecione uma área.")
      return
    }

    if (!cropId) {
      setError("Selecione uma cultura.")
      return
    }

    if (!seasonId) {
      setError("Selecione uma safra.")
      return
    }

    if (!plantingDate) {
      setError("Informe a data do plantio.")
      return
    }

    const validInputs = inputs.filter(
      (input) => input.itemId && input.quantity.trim() !== ""
    )

    if (validInputs.length === 0) {
      setError("Informe pelo menos um insumo para o plantio.")
      return
    }

    const payloadInputs = []

    for (const input of validInputs) {
      const parsedQuantity = Number(input.quantity)

      if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
        setError("Todas as quantidades dos insumos devem ser maiores que zero.")
        return
      }

      payloadInputs.push({
        itemId: input.itemId,
        quantity: parsedQuantity
      })
    }

    try {
      setLoading(true)

      await plantingService.createPlanting({
        areaId,
        cropId,
        seasonId,
        plantingDate: toIsoDate(plantingDate),
        inputs: payloadInputs
      })

      setSuccess("Plantio cadastrado com sucesso.")

      setAreaId("")
      setCropId("")
      setSeasonId("")
      setPlantingDate("")
      setInputs([{ itemId: "", quantity: "" }])

      setTimeout(() => {
        router.push("/plantio")
      }, 1000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível cadastrar o plantio."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Novo Plantio</h1>
        <p className="text-sm text-gray-500">
          Selecione área, cultura, safra e os insumos utilizados no plantio.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Área
                </label>
                <select
                  value={areaId}
                  onChange={(event) => setAreaId(event.target.value)}
                  disabled={loadingDependencies}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
                >
                  <option value="">Selecione uma área</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} - {area.size} ha
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Cultura
                </label>
                <select
                  value={cropId}
                  onChange={(event) => setCropId(event.target.value)}
                  disabled={loadingDependencies}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
                >
                  <option value="">Selecione uma cultura</option>
                  {crops.map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Safra
                </label>
                <select
                  value={seasonId}
                  onChange={(event) => setSeasonId(event.target.value)}
                  disabled={loadingDependencies}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
                >
                  <option value="">Selecione uma safra</option>
                  {seasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Data do Plantio
                </label>
                <input
                  type="date"
                  value={plantingDate}
                  onChange={(event) => setPlantingDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Insumos</h2>
                  <p className="text-sm text-slate-500">
                    Informe os itens do estoque usados no plantio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addInputRow}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Plus size={16} />
                  Adicionar insumo
                </button>
              </div>

              <div className="space-y-3">
                {inputs.map((input, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_52px]"
                  >
                    <select
                      value={input.itemId}
                      onChange={(event) =>
                        updateInputRow(index, "itemId", event.target.value)
                      }
                      disabled={loadingDependencies}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
                    >
                      <option value="">Selecione um insumo</option>
                      {stockItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - Estoque: {item.stock} {item.unit}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      value={input.quantity}
                      onChange={(event) =>
                        updateInputRow(index, "quantity", event.target.value)
                      }
                      placeholder="Quantidade"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() => removeInputRow(index)}
                      disabled={inputs.length === 1}
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
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

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push("/plantio")}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading || loadingDependencies}
                className="rounded-xl bg-rocket-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Cadastrar Plantio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}