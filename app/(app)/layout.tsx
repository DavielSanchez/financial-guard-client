"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { BottomNav } from "@/components/bottom-nav"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { OnboardingProvider } from "@/components/onboarding/OnboardingProvider"
import { ActiveGuardTour } from "@/components/onboarding/ActiveGuardTour"
import type { ReactNode } from "react"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <OnboardingProvider>
      <SidebarProvider className="flex min-h-screen w-full">
        {/* Sidebar: visible only on lg+ */}
        <div className="hidden shrink-0 lg:block">
          <AppSidebar />
        </div>

        {/* Main content + BottomNav (children rendered once) */}
        <SidebarInset className="min-h-screen flex-1">
          <main className="min-h-screen bg-background pb-20 lg:pb-6 lg:px-6">
            <div className="mx-auto h-full w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl pt-2">
              {children}
            </div>
          </main>
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
      <ActiveGuardTour />
      </OnboardingProvider>
    </ProtectedRoute>
  )
}
