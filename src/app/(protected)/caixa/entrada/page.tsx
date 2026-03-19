"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { cashAccountService } from "@/services/cash-account.service"
import { financialEntryService } from "@/services/financial-entry.service"
import { CashAccount } from "@/types/cash-account.types"

type EntryType = "INCOME" | "EXPENSE"

export default function FinancialEntryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [accounts, setAccounts] = useState<CashAccount[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)

  const [accountId, setAccountId] = useState("")
  const [type, setType] = useState<EntryType>("INCOME")
  const [value, setValue] = useState("")
  const [description, setDescription] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const queryAccountId = searchParams.get("accountId")

  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoadingAccounts(true)
        setError("")

        const response = await cashAccountService.getAccounts()
        const loadedAccounts = response.data as CashAccount[]

        setAccounts(loadedAccounts)

        if (queryAccountId) {
          const exists = loadedAccounts.some(
            (account) => account.id === queryAccountId
          )

          if (exists) {
            setAccountId(queryAccountId)
          }
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          "Não foi possível carregar as contas caixa."
        )
      } finally {
        setLoadingAccounts(false)
      }
    }

    loadAccounts()
  }, [queryAccountId])

  const selectedAccount = useMemo(() => {
    return accounts.find((account) => account.id === accountId) || null
  }, [accounts, accountId])

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (!accountId) {
      setError("Selecione uma conta caixa.")
      return
    }

    if (!value.trim()) {
      setError("Informe o valor do lançamento.")
      return
    }

    const parsedValue = Number(value)

    if (Number.isNaN(parsedValue) || parsedValue <= 0) {
      setError("Informe um valor válido maior que zero.")
      return
    }

    if (!description.trim()) {
      setError("Informe a descrição do lançamento.")
      return
    }

    try {
      setLoading(true)

      await financialEntryService.createEntry({
        accountId,
        type,
        value: parsedValue,
        description: description.trim()
      })

      setSuccess(
        type === "INCOME"
          ? "Entrada financeira registrada com sucesso."
          : "Saída financeira registrada com sucesso."
      )

      setValue("")
      setDescription("")

      setTimeout(() => {
        router.push("/caixa")
      }, 1000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível registrar o lançamento financeiro."
      )
    } finally {
      setLoading(false)
    }
  }

  const projectedBalance =
    selectedAccount && value.trim() && !Number.isNaN(Number(value)) && Number(value) > 0
      ? type === "INCOME"
        ? selectedAccount.balance + Number(value)
        : selectedAccount.balance - Number(value)
      : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Lançamento Manual
        </h1>
        <p className="text-sm text-gray-500">
          Registre entradas e saídas financeiras manualmente em uma conta caixa.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Conta Caixa
              </label>

              <select
                value={accountId}
                onChange={(event) => setAccountId(event.target.value)}
                disabled={loadingAccounts}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option value="">
                  {loadingAccounts
                    ? "Carregando contas..."
                    : "Selecione uma conta caixa"}
                </option>

                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} - Saldo atual: {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tipo de Lançamento
              </label>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setType("INCOME")}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${type === "INCOME"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  <ArrowDownCircle size={18} />
                  <div>
                    <div className="text-sm font-semibold">Entrada</div>
                    <div className="text-xs opacity-80">INCOME</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType("EXPENSE")}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${type === "EXPENSE"
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  <ArrowUpCircle size={18} />
                  <div>
                    <div className="text-sm font-semibold">Saída</div>
                    <div className="text-xs opacity-80">EXPENSE</div>
                  </div>
                </button>
              </div>
            </div>

            {selectedAccount && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  {selectedAccount.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Saldo atual:{" "}
                  <span className="font-medium text-slate-900">
                    {formatCurrency(selectedAccount.balance)}
                  </span>
                </p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Valor
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Ex.: 10000"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>

            {selectedAccount && projectedBalance !== null && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${type === "INCOME"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
                  }`}
              >
                Saldo projetado após o lançamento:{" "}
                <span className="font-semibold">
                  {formatCurrency(projectedBalance)}
                </span>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={
                  type === "INCOME"
                    ? "Ex.: Entrada de valores"
                    : "Ex.: Saída de valores"
                }
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
                onClick={() => router.push("/caixa")}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading || loadingAccounts}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${type === "INCOME"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {type === "INCOME" ? (
                  <ArrowDownCircle size={16} />
                ) : (
                  <ArrowUpCircle size={16} />
                )}
                {loading
                  ? "Salvando..."
                  : type === "INCOME"
                    ? "Registrar Entrada"
                    : "Registrar Saída"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}