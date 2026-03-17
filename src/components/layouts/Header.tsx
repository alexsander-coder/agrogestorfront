"use client"
//repost de operação
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

export default function Header() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { logout } = useAuth()

  // fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="w-full flex items-center justify-between">

      {/* Search */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full 
                     max-w-[340px] sm:max-w-xs md:max-w-md
                     px-2 sm:px-3 md:px-4
                     py-1.5 sm:py-2
                     text-sm
                     text-gray-500
                     placeholder-gray-400
                     bg-white
                     rounded-lg 
                     border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-[#0e6a3a]
                  "/>
      </div>

      {/* Profile */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2"
        >
          <img
            src="/avatar.jpg"
            className="w-8 h-8 rounded-full"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <button className="w-full text-left text-gray-600 px-4 py-2 hover:bg-gray-100">
              Perfil
            </button>

            <button className="w-full text-left text-gray-600 px-4 py-2 hover:bg-gray-100">
              Configurações
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            >
              Sair
            </button>
          </div>
        )}
      </div>

    </div>
  )
}