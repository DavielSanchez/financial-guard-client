"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { setOnUnauthorized } from "@/lib/axios"
import { useAuthStore } from "@/store/use-auth-store"

/**
 * Configura el handler global para respuestas 401 (sesión expirada).
 * Limpia auth, cache de queries y redirige a /login.
 */
export function AuthUnauthorizedHandler() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  useEffect(() => {
    setOnUnauthorized(() => {
      clearAuth()
      queryClient.clear()
      router.push("/login")
    })
    return () => setOnUnauthorized(null as any)
  }, [clearAuth, queryClient, router])

  return null
}
