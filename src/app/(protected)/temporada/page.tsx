"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Calendar, Plus, Pencil, Trash2 } from "lucide-react"
import { seasonService } from "@/services/season.service"
import { Season } from "@/types/season.types"

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function loadSeasons() {
    try {
      setLoading(true)
      setError("")

      const response = await seasonService.getSeasons()
      setSeasons(response.data)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível carregar as safras."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSeasons()
  }, [])

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Deseja realmente excluir esta safra?")

    if (!confirmed) return

    try {
      setDeletingId(id)
      await seasonService.deleteSeason(id)
      await loadSeasons()
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
        "Não foi possível excluir a safra."
      )
    } finally {
      setDeletingId(null)
    }
  }

  const summary = useMemo(() => {
    const total = seasons.length
    const openEnded = seasons.filter((season) => !season.endDate).length
    const closed = seasons.filter((season) => !!season.endDate).length

    return {
      total,
      openEnded,
      closed
    }
  }, [seasons])

  function formatDate(value: string | null) {
    if (!value) return "Em aberto"

    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short"
    }).format(new Date(value))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Temporada</h1>
          <p className="text-sm text-gray-500">
            Gerencie as safras cadastradas no sistema.
          </p>
        </div>

        <Link
          href="/temporada/novo"
          className="inline-flex items-center gap-2 rounded-xl bg-rocket-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Cadastrar Safra
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <Calendar className="text-slate-700" size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total de Safras</p>
              <strong className="text-2xl text-slate-900">{summary.total}</strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3">
              <Calendar className="text-amber-700" size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Safras em Aberto</p>
              <strong className="text-2xl text-slate-900">{summary.openEnded}</strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-3">
              <Calendar className="text-emerald-700" size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Safras Fechadas</p>
              <strong className="text-2xl text-slate-900">{summary.closed}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-600">Safras cadastradas</h2>
        </div>

        {loading && (
          <div className="p-6 text-sm text-slate-600">
            Carregando safras...
          </div>
        )}

        {!loading && error && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && seasons.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Calendar className="text-slate-700" size={22} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Nenhuma safra cadastrada
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Cadastre a primeira safra para começar.
            </p>

            <Link
              href="/temporada/novo"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rocket-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Cadastrar primeira safra
            </Link>
          </div>
        )}

        {!loading && !error && seasons.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Nome
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Início
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Fim
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Criado em
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {seasons.map((season) => (
                  <tr
                    key={season.id}
                    className="border-t border-slate-200 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{season.name}</div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {formatDate(season.startDate)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {formatDate(season.endDate)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(season.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/temporada/${season.id}/editar`}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          <Pencil size={14} />
                          Editar
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(season.id)}
                          disabled={deletingId === season.id}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 size={14} />
                          {deletingId === season.id ? "Excluindo..." : "Excluir"}
                        </button>
                      </div>
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