"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/auth.service"

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-rocket-dark placeholder:text-rocket-muted focus:outline-none focus:ring-2 focus:ring-rocket-light focus:border-rocket-primary transition"

export default function RegisterForm() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    try {
      setLoading(true)
      await AuthService.register({
        name,
        email,
        password
      })
      router.push("/login")
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
            ?.data?.message
          : null
      setError(
        message || "Não foi possível criar a conta. Tente novamente."
      )
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
        type="text"
        placeholder="Nome"
        className={inputClass}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoComplete="name"
      />

      <input
        type="email"
        placeholder="Email"
        className={inputClass}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <input
        type="password"
        placeholder="Senha"
        className={inputClass}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        autoComplete="new-password"
      />

      <input
        type="password"
        placeholder="Confirmar senha"
        className={inputClass}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={6}
        autoComplete="new-password"
      />

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-[#0d2418] hover:bg-[#0d1900] text-white font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
        disabled={loading}
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  )
}
