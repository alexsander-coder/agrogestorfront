"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-rocket-dark placeholder:text-rocket-muted focus:outline-none focus:ring-2 focus:ring-rocket-light focus:border-rocket-primary transition"

export default function LoginForm() {
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)
      await login(email, password)
    } catch (err) {
      console.error("Erro login", err)
      setError("Email ou senha inválidos. Tente novamente.")
    } finally {
      setLoading(false)
    }
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
        type="password"
        placeholder="Senha"
        className={inputClass}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-15 py-2.5 rounded-xl bg-rocket-primary hover:bg-rocket-primary-hover text-white font-medium transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </form>
  )
}
