"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Plus, Wallet, Landmark } from "lucide-react"
import { cashAccountService } from "@/services/cash-account.service"
import { CashAccount } from "@/types/cash-account.types"

export default function CashAccountsPage() {
  const [accounts, setAccounts] = useState<CashAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadAccounts() {
    try {
      setLoading(true)
      setError("")

      const response = await cashAccountService.getAccounts()
      setAccounts(response.data)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível carregar as contas caixa."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const summary = useMemo(() => {
    const totalAccounts = accounts.length
    const positiveAccounts = accounts.filter((account) => account.balance > 0).length
    const negativeAccounts = accounts.filter((account) => account.balance < 0).length

    return {
      totalAccounts,
      positiveAccounts,
      negativeAccounts
    }
  }, [accounts])

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(value))
  }

  function getBalanceStyle(balance: number) {
    if (balance < 0) {
      return "text-red-700"
    }

    if (balance > 0) {
      return "text-emerald-700"
    }

    return "text-slate-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Caixa</h1>
          <p className="text-sm text-gray-500">
            Gerencie as contas caixa cadastradas no sistema.
          </p>
        </div>

        <Link
          href="/caixa/novo"
          className="inline-flex items-center gap-2 rounded-xl bg-rocket-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Cadastrar Caixa
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <Wallet className="text-slate-700" size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total de Caixas</p>
              <strong className="text-2xl text-slate-900">
                {summary.totalAccounts}
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-3">
              <Landmark className="text-emerald-700" size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Com Saldo Positivo</p>
              <strong className="text-2xl text-slate-900">
                {summary.positiveAccounts}
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-3">
              <Landmark className="text-red-700" size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Com Saldo Negativo</p>
              <strong className="text-2xl text-slate-900">
                {summary.negativeAccounts}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-600">
            Contas Caixa
          </h2>
        </div>

        {loading && (
          <div className="p-6 text-sm text-slate-600">
            Carregando contas caixa...
          </div>
        )}

        {!loading && error && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && accounts.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Wallet className="text-slate-700" size={22} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Nenhum caixa cadastrado
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Cadastre a primeira conta caixa para começar.
            </p>

            <Link
              href="/caixa/novo"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rocket-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Cadastrar primeiro caixa
            </Link>
          </div>
        )}

        {!loading && !error && accounts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Nome
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Saldo
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Criado em
                  </th>
                </tr>
              </thead>

              <tbody>
                {accounts.map((account) => (
                  <tr
                    key={account.id}
                    className="border-t border-slate-200 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">
                        {account.name}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`font-medium ${getBalanceStyle(account.balance)}`}>
                        {formatCurrency(account.balance)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(account.createdAt)}
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