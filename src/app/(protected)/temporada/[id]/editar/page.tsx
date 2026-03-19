"use client"

import { FormEvent, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { seasonService } from "@/services/season.service"

export default function EditSeasonPage() {
  const router = useRouter()
  const params = useParams()
  const id = String(params.id)

  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [loadingSeason, setLoadingSeason] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  function toIsoDate(dateValue: string) {
    return new Date(`${dateValue}T00:00:00`).toISOString()
  }

  function toInputDate(iso: string | null) {
    if (!iso) return ""
    return iso.slice(0, 10)
  }

  useEffect(() => {
    async function loadSeason() {
      try {
        setLoadingSeason(true)
        setError("")

        const response = await seasonService.getSeasonById(id)
        const season = response.data

        setName(season.name || "")
        setStartDate(toInputDate(season.startDate))
        setEndDate(toInputDate(season.endDate))
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          "Não foi possível carregar os dados da safra."
        )
      } finally {
        setLoadingSeason(false)
      }
    }

    if (id) {
      loadSeason()
    }
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (!name.trim()) {
      setError("Informe o nome da safra.")
      return
    }

    if (!startDate) {
      setError("Informe a data de início.")
      return
    }

    if (endDate && new Date(endDate) < new Date(startDate)) {
      setError("A data de fim não pode ser menor que a data de início.")
      return
    }

    try {
      setLoading(true)

      await seasonService.updateSeason(id, {
        name: name.trim(),
        startDate: toIsoDate(startDate),
        endDate: endDate ? toIsoDate(endDate) : null
      })

      setSuccess("Safra atualizada com sucesso.")

      setTimeout(() => {
        router.push("/temporada")
      }, 1000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível atualizar a safra."
      )
    } finally {
      setLoading(false)
    }
  }

  if (loadingSeason) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Editar Safra</h1>
          <p className="text-sm text-gray-500">
            Atualize os dados da temporada agrícola.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Carregando dados da safra...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Editar Safra</h1>
        <p className="text-sm text-gray-500">
          Atualize os dados da temporada agrícola.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nome da Safra
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Safra 2025/2026"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Data de Fim
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
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
                onClick={() => router.push("/temporada")}
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