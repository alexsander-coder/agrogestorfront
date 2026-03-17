"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { AuthService } from "@/services/auth.service"
import { JwtPayload } from "@/types/auth.types"

interface AuthContextType {

  user: JwtPayload | null
  token: string | null
  /** false até ler o token do localStorage na primeira montagem */
  isInitialized: boolean

  login: (email: string, password: string) => Promise<void>
  logout: () => void

}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const router = useRouter()

  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<JwtPayload | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {

    const storedToken = localStorage.getItem("token")

    if (storedToken) {

      const decoded: JwtPayload = jwtDecode(storedToken)

      const now = Date.now() / 1000

      if (decoded.exp < now) {

        localStorage.removeItem("token")
        setIsInitialized(true)
        return

      }

      setToken(storedToken)
      setUser(decoded)

    }

    setIsInitialized(true)

  }, [])

  async function login(email: string, password: string) {

    const response = await AuthService.login({ email, password })

    const jwt = response.access_token

    const decoded: JwtPayload = jwtDecode(jwt)

    localStorage.setItem("token", jwt)

    setToken(jwt)
    setUser(decoded)

    router.push("/")

  }

  function logout() {

    localStorage.removeItem("token")

    setToken(null)
    setUser(null)

    router.push("/login")

  }

  return (

    <AuthContext.Provider value={{ token, user, isInitialized, login, logout }}>

      {children}

    </AuthContext.Provider>

  )

}

export function useAuth() {

  return useContext(AuthContext)

}