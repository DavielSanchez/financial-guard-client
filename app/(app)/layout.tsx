"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BottomNav } from "@/components/bottom-nav"
import type { ReactNode } from "react"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background pb-20">
        {children}
      </main>
      <BottomNav />
    </ProtectedRoute>
  )
}
