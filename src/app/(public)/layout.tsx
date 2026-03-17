"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {

  const { token, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {

    if (isInitialized && token) {
      router.replace("/dashboard")
    }

  }, [token, isInitialized, router])

  if (!isInitialized || token) {
    return null
  }

  return children

}
