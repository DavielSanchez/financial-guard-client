"use client"

import { useCallback, useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/store/use-auth-store"
import { authService } from "@/services/auth.service"

const FORCE_RESTART_KEY = "fg_onboarding_force_restart"

/**
 * Check if user has completed onboarding.
 * Supports both user.onboardingCompleted and user.profile?.onboardingCompleted.
 */
export function isOnboardingCompleted(user: { onboardingCompleted?: boolean; profile?: { onboardingCompleted?: boolean } } | null): boolean {
  if (!user) return true // No user = don't show onboarding
  return user.onboardingCompleted ?? user.profile?.onboardingCompleted ?? false
}

/**
 * Check if we should force-start the tour (e.g. from Settings "Repeat Protocol" button).
 */
export function shouldForceStartTour(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(FORCE_RESTART_KEY) === "true"
}

/**
 * Set flag to force tour start on next Dashboard visit.
 * Call before redirecting to /dashboard from Settings.
 */
export function setForceStartTour(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(FORCE_RESTART_KEY, "true")
}

/**
 * Clear the force-start flag after consuming it.
 */
export function clearForceStartTour(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(FORCE_RESTART_KEY)
}

export function useOnboarding() {
  const user = useAuthStore((s) => s.user)
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted)
  const queryClient = useQueryClient()
  const [isCompleting, setIsCompleting] = useState(false)

  const completed = isOnboardingCompleted(user)
  const forceStart = shouldForceStartTour()

  const shouldShowOnboarding = !completed || forceStart

  const completeOnboarding = useCallback(async () => {
    setIsCompleting(true)
    try {
      const updatedUser = await authService.completeOnboarding()
      setOnboardingCompleted(true)
      queryClient.setQueryData(["auth", "user"], updatedUser)
    } catch (err) {
      // Still update local state so UI doesn't block
      setOnboardingCompleted(true)
      console.error("Failed to sync onboarding completion:", err)
    } finally {
      clearForceStartTour()
      setIsCompleting(false)
    }
  }, [setOnboardingCompleted, queryClient])

  const skipOnboarding = useCallback(async () => {
    clearForceStartTour()
    await completeOnboarding()
  }, [completeOnboarding])

  return {
    shouldShowOnboarding,
    completed,
    forceStart,
    completeOnboarding,
    skipOnboarding,
    isCompleting,
  }
}
