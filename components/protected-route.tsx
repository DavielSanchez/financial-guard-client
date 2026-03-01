"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

function NeonSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="neon-spinner h-12 w-12 rounded-full border-2 border-transparent border-t-neon-purple border-r-neon-cyan" />
    </div>
  )
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, isError } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [isLoading, user, router])

  if (isLoading) return <NeonSpinner />
  if (!isLoading && !user) return <NeonSpinner />

  return <>{children}</>
}
