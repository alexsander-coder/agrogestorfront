"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  Users,
  Sprout,
  Truck,
  Fuel,
  Calendar,
  Wheat,
  Wallet,
  ChevronRight,
} from "lucide-react"

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [hoverMenu, setHoverMenu] = useState<string | null>(null)

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      children: [
        { name: "Gráfico de Produção", href: "/dashboard/producao" },
        { name: "Gráfico Financeiro", href: "/dashboard/financeiro" },
        { name: "Custo por Plantio", href: "/dashboard/custo-plantio" }
      ]
    },
    { name: "Estoque", href: "/estoque", icon: Package },
    { name: "Funcionários", href: "/funcionarios", icon: Users },
    { name: "Plantio", href: "/plantio", icon: Sprout },
    { name: "Frota", href: "/frota", icon: Truck },
    { name: "Diesel", href: "/diesel", icon: Fuel },
    { name: "Temporada", href: "/temporada", icon: Calendar },
    { name: "Colheita", href: "/colheita", icon: Wheat },
    {
      name: "Caixa",
      icon: Wallet,
      children: [
        { name: "Entrada Financeira", href: "/caixa/entrada" },
        { name: "Vendas", href: "/caixa/vendas" }
      ]
    }
  ]

  return (
    <div className="h-full flex flex-col relative">

      <div className="px-3 py-2 text-sm font-semibold tracking-[0.15em] text-white/70">
        Menu
      </div>

      {/* 🔥 IMPORTANTE: overflow visível */}
      <nav className="flex-1 relative px-2 space-y-2 text-white pb-4">
        {menu.map((item) => {
          const isActive = item.href && pathname === item.href
          const Icon = item.icon
          const isOpen = openMenu === item.name

          if (!item.children) {
            return (
              <Link
                key={item.name}
                href={item.href!}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                  ${isActive
                    ? "bg-rocket-primary text-white"
                    : "text-white hover:bg-white/10"}
                `}
              >
                <Icon size={18} className="text-white" />
                {!collapsed && <span className="text-sm">{item.name}</span>}
              </Link>
            )
          }

          return (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => collapsed && setHoverMenu(item.name)}
              onMouseLeave={() => collapsed && setHoverMenu(null)}
            >
              <button
                onClick={() => {
                  if (!collapsed) {
                    setOpenMenu(isOpen ? null : item.name)
                  }
                }}
                className="
                  w-full flex items-center justify-between px-3 py-2 rounded-lg
                  text-white hover:bg-white/10 transition-all
                "
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-white" />
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                </div>

                {!collapsed && (
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
                  />
                )}
              </button>

              {/* EXPANDIDO */}
              {!collapsed && isOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((sub) => {
                    const isSubActive = pathname === sub.href
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`
                          block px-2 py-1 text-sm
                          ${isSubActive
                            ? "text-white font-medium"
                            : "text-white/80 hover:text-white hover:underline"}
                        `}
                      >
                        {sub.name}
                      </Link>
                    )
                  })}
                </div>
              )}

              {/* COLAPSADO */}
              {collapsed && hoverMenu === item.name && (
                <div
                  onMouseEnter={() => setHoverMenu(item.name)}
                  onMouseLeave={() => setHoverMenu(null)}
                  className="
      absolute top-0 left-full z-[999]
      w-60
      bg-white text-[#0d2418]
      rounded-2xl shadow-xl border border-gray-100
      py-3
    "
                >
                  {/* título */}
                  <div className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {item.name}
                  </div>

                  {/* itens */}
                  <div className="space-y-1">
                    {item.children.map((sub) => {
                      const isSubActive = pathname === sub.href

                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`
              flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-all
              
              ${isSubActive
                              ? "bg-rocket-primary text-white shadow-sm"
                              : "text-gray-700 hover:bg-gray-100"}
            `}
                        >
                          <span>{sub.name}</span>

                          {/* opcional: seta pequena */}
                          <ChevronRight size={14} className="opacity-50" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}