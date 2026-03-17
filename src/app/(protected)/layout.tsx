"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

import Sidebar from "@/components/layouts/Sidebar"
import Header from "@/components/layouts/Header"
import { Menu } from "lucide-react"

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {

  const { token, isInitialized } = useAuth()
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (isInitialized && !token) {
      router.replace("/login")
    }
  }, [token, isInitialized, router])

  if (!isInitialized || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">

      {/* Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-[#0d2418] border-r border-white/10 text-white
          flex-shrink-0 flex flex-col
          transition-[width,transform] duration-300
          overflow-visible   /* 🔥 ESSENCIAL */

          ${collapsed ? "w-16" : "w-64"}
          
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0
        `}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">

        <header className="h-15 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">

          <div className="flex items-center gap-2">

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Menu size={20} className="text-[#0d2418]" />
            </button>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Menu size={20} className="text-[#0d2418]" />
            </button>

          </div>

          <Header />

        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>

      </div>
    </div>
  )
}