"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BottomNav } from "@/components/bottom-nav"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import type { ReactNode } from "react"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider className="flex min-h-screen w-full">
        {/* Sidebar: visible only on lg+ */}
        <div className="hidden shrink-0 lg:block">
          <AppSidebar />
        </div>

        {/* Main content + BottomNav (children rendered once) */}
        <SidebarInset className="min-h-screen flex-1">
          <main className="min-h-screen bg-background pb-20 lg:pb-6 lg:px-6">
            {children}
          </main>
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
