"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { cashAccountService } from "@/services/cash-account.service"

export default function NewCashAccountPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (!name.trim()) {
      setError("Informe o nome do caixa.")
      return
    }

    try {
      setLoading(true)

      await cashAccountService.createAccount({
        name: name.trim()
      })

      setSuccess("Caixa cadastrado com sucesso.")
      setName("")

      setTimeout(() => {
        router.push("/caixa")
      }, 1000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Não foi possível cadastrar o caixa."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Cadastrar Caixa
        </h1>
        <p className="text-sm text-gray-500">
          Cadastre uma nova conta caixa para movimentações financeiras.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nome do Caixa
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Caixa Principal"
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
                disabled={loading}
                className="rounded-xl bg-rocket-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Cadastrar Caixa"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}