"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine,
  SlidersHorizontal,
  AlertTriangle,
  Boxes,
  MoreHorizontal,
} from "lucide-react"
import { stockService } from "@/services/stock.service"
import { StockItem } from "@/types/stock.types"

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null)

  const actionMenuRef = useRef<HTMLDivElement | null>(null)

  async function loadItems() {
    try {
      setLoading(true)
      setError("")

      const response = await stockService.getItems()
      setItems(response.data)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível carregar os itens do estoque."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenActionMenu(null)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenActionMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Deseja realmente excluir este item?")

    if (!confirmed) return

    try {
      setDeletingId(id)
      await stockService.deleteItem(id)
      setOpenActionMenu(null)
      await loadItems()
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
        "Não foi possível excluir o item. Verifique se existem movimentações vinculadas."
      )
    } finally {

      setDeletingId(null)
    }
  }

  const summary = useMemo(() => {
    const totalItems = items.length
    const lowStockItems = items.filter(
      (item) => item.stock > 0 && item.stock <= item.minimumStock
    ).length
    const zeroStockItems = items.filter((item) => item.stock === 0).length

    return {
      totalItems,
      lowStockItems,
      zeroStockItems,
    }
  }, [items])

  function getStockStatus(item: StockItem) {
    if (item.stock === 0) {
      return {
        label: "Crítico",
        className: "border border-red-200 bg-red-50 text-red-700",
      }
    }

    if (item.stock <= item.minimumStock) {
      return {
        label: "Baixo",
        className: "border border-amber-200 bg-amber-50 text-amber-700",
      }
    }

    return {
      label: "Normal",
      className: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Estoque</h1>
          <p className="text-sm text-gray-500">
            Gerencie os itens cadastrados e acompanhe os níveis de estoque.
          </p>
        </div>

        <Link
          href="/estoque/novo"
          className="inline-flex items-center gap-2 rounded-xl bg-rocket-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Cadastrar Item
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <Boxes className="text-slate-700" size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total de Itens</p>
              <strong className="text-2xl text-slate-900">
                {summary.totalItems}
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3">
              <AlertTriangle className="text-amber-700" size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Estoque Baixo</p>
              <strong className="text-2xl text-slate-900">
                {summary.lowStockItems}
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-3">
              <Package className="text-red-700" size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Itens Zerados</p>
              <strong className="text-2xl text-slate-900">
                {summary.zeroStockItems}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-600">
            Itens cadastrados
          </h2>
        </div>

        {loading && (
          <div className="p-6 text-sm text-slate-600">
            Carregando itens do estoque...
          </div>
        )}

        {!loading && error && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Package className="text-slate-700" size={22} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Nenhum item cadastrado
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Cadastre o primeiro item para começar o controle de estoque.
            </p>

            <Link
              href="/estoque/novo"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rocket-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Cadastrar primeiro item
            </Link>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Item
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Descrição
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Unidade
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Estoque
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Mínimo
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => {
                  const status = getStockStatus(item)
                  const isMenuOpen = openActionMenu === item.id

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-slate-200 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900">
                          {item.name}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.description || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {item.unit}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {item.stock}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {item.minimumStock}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div
                          className="relative flex items-center gap-2"
                          ref={isMenuOpen ? actionMenuRef : null}
                        >
                          <Link
                            href={`/estoque/entrada?itemId=${item.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <ArrowDownToLine size={14} />
                            Entrada
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setOpenActionMenu(isMenuOpen ? null : item.id)
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
                            aria-label="Mais ações"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 top-11 z-20 min-w-[190px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                              <Link
                                href={`/estoque/${item.id}/editar`}
                                onClick={() => setOpenActionMenu(null)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                              >
                                <Pencil size={14} />
                                Editar item
                              </Link>

                              <Link
                                href={`/estoque/saida?itemId=${item.id}`}
                                onClick={() => setOpenActionMenu(null)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                              >
                                <ArrowUpFromLine size={14} />
                                Registrar saída
                              </Link>

                              <Link
                                href={`/estoque/ajuste?itemId=${item.id}`}
                                onClick={() => setOpenActionMenu(null)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-50"
                              >
                                <SlidersHorizontal size={14} />
                                Ajustar estoque
                              </Link>

                              <div className="my-2 border-t border-slate-200" />

                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Trash2 size={14} />
                                {deletingId === item.id
                                  ? "Excluindo..."
                                  : "Excluir item"}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}