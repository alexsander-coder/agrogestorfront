"use client"

import { useState } from "react"
import { AuthService } from "@/services/auth.service"

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-rocket-dark placeholder:text-rocket-muted focus:outline-none focus:ring-2 focus:ring-rocket-light focus:border-rocket-primary transition"

export default function RecoverPasswordForm() {
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)
      await AuthService.recoverPassword({ email, telefone })
      setSuccess(true)
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
            ?.data?.message
          : null
      setError(
        message || "Não foi possível enviar a recuperação. Tente novamente."
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <p className="text-sm text-rocket-muted text-center py-2">
        Se existir uma conta com esses dados, você receberá as instruções por
        email.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <input
        type="email"
        placeholder="Email"
        className={inputClass}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="tel"
        placeholder="Telefone"
        className={inputClass}
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
      />

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-rocket-primary hover:bg-rocket-primary-hover text-white font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
        disabled={loading}
      >
        {loading ? "Enviando..." : "Recuperar acesso"}
      </button>
    </form>
  )
}
