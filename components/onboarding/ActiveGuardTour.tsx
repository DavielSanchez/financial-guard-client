"use client"

import { useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import { driver, type DriveStep } from "driver.js"
import "driver.js/dist/driver.css"
import { useI18n } from "@/hooks/use-translations"
import { useOnboarding } from "@/hooks/useOnboarding"
import { useOnboardingContext } from "./OnboardingProvider"

const FAB_CLICK_EVENT = "onboarding-fab-clicked"
const CONTINUE_ON_TRANSACTIONS_KEY = "fg_onboarding_continue_transactions"

export function ActiveGuardTour() {
  const pathname = usePathname()
  const { t } = useI18n()
  const { shouldShowOnboarding, completeOnboarding, forceStart } = useOnboarding()
  const ctx = useOnboardingContext()
  const driverRef = useRef<ReturnType<typeof driver> | null>(null)
  const hasStartedRef = useRef(false)

  const getSteps = useCallback(
    (route: "dashboard" | "transactions"): DriveStep[] => {
      const basePopover = {
        side: "bottom" as const,
        align: "center" as const,
        popoverClass: "active-guard-popover",
      }

      if (route === "dashboard") {
        return [
          {
            element: "[data-tour='period-selector']",
            popover: {
              ...basePopover,
              title: t("onboarding.steps.welcome.title" as any),
              description: t("onboarding.steps.welcome.description" as any),
            },
          },
          {
            element: "[data-tour='balance-chart']",
            popover: {
              ...basePopover,
              title: t("onboarding.steps.balanceChart.title" as any),
              description: t("onboarding.steps.balanceChart.description" as any),
            },
          },
          {
            element: "[data-tour='balance-tabs']",
            popover: {
              ...basePopover,
              title: t("onboarding.steps.balanceTabs.title" as any),
              description: t("onboarding.steps.balanceTabs.description" as any),
            },
          },
          {
            element: "[data-tour='budget-widgets']",
            popover: {
              ...basePopover,
              title: t("onboarding.steps.budgetWidgets.title" as any),
              description: t("onboarding.steps.budgetWidgets.description" as any),
            },
          },
          {
            element: "[data-tour='recent-transactions']",
            popover: {
              ...basePopover,
              title: t("onboarding.steps.recentTransactions.title" as any),
              description: t("onboarding.steps.recentTransactions.description" as any),
            },
          },
          {
            element: "[data-tour='fab-new-transaction']",
            popover: {
              ...basePopover,
              title: t("onboarding.steps.fabTransaction.title" as any),
              description: t("onboarding.steps.fabTransaction.description" as any),
            },
            disableActiveInteraction: false,
          },
        ]
      }

      return [
        {
          element: "[data-tour='tx-type-toggle']",
          popover: {
            ...basePopover,
            title: t("onboarding.steps.txTypeToggle.title" as any),
            description: t("onboarding.steps.txTypeToggle.description" as any),
          },
        },
        {
          element: "[data-tour='tx-type-toggle']",
          popover: {
            ...basePopover,
            title: t("onboarding.steps.complete.title" as any),
            description: t("onboarding.steps.complete.description" as any),
          },
        },
      ]
    },
    [t]
  )

  const runTour = useCallback(
    (route: "dashboard" | "transactions", startIndex = 0) => {
      if (driverRef.current?.isActive()) return

      const steps = getSteps(route)
      const isTransactions = route === "transactions"
      const isLastStep = (idx: number) => idx === steps.length - 1

      driverRef.current = driver({
        showProgress: true,
        progressText: "{{current}} / {{total}}",
        nextBtnText: t("onboarding.driver.next" as any),
        prevBtnText: t("onboarding.driver.prev" as any),
        doneBtnText: t("onboarding.driver.done" as any),
        overlayColor: "rgba(5, 5, 5, 0.92)",
        overlayOpacity: 0.95,
        stagePadding: 8,
        stageRadius: 12,
        allowClose: true,
        smoothScroll: true,
        steps,
        onDestroyed: () => {
          driverRef.current = null
          if (isTransactions && hasStartedRef.current) {
            hasStartedRef.current = false
            completeOnboarding()
          }
        },
        onCloseClick: () => {
          driverRef.current?.destroy()
          if (isTransactions) completeOnboarding()
        },
      })

      driverRef.current.drive(startIndex)
    },
    [getSteps, t, completeOnboarding]
  )

  useEffect(() => {
    if (!shouldShowOnboarding && !forceStart) return
    const canStartDashboardTour = forceStart || ctx?.languageModalConfirmed
    if (pathname === "/dashboard" && !canStartDashboardTour) return

    const handleFabClick = () => {
      if (driverRef.current?.isActive()) {
        sessionStorage.setItem(CONTINUE_ON_TRANSACTIONS_KEY, "true")
        driverRef.current.destroy()
      }
    }

    window.addEventListener(FAB_CLICK_EVENT, handleFabClick)

    if (pathname === "/dashboard") {
      hasStartedRef.current = true
      const timer = setTimeout(() => runTour("dashboard"), 400)
      return () => {
        clearTimeout(timer)
        window.removeEventListener(FAB_CLICK_EVENT, handleFabClick)
      }
    }

    if (pathname === "/transactions" && sessionStorage.getItem(CONTINUE_ON_TRANSACTIONS_KEY) === "true") {
      sessionStorage.removeItem(CONTINUE_ON_TRANSACTIONS_KEY)
      hasStartedRef.current = true
      const timer = setTimeout(() => runTour("transactions"), 500)
      return () => {
        clearTimeout(timer)
        window.removeEventListener(FAB_CLICK_EVENT, handleFabClick)
      }
    }

    return () => window.removeEventListener(FAB_CLICK_EVENT, handleFabClick)
  }, [pathname, shouldShowOnboarding, forceStart, ctx?.languageModalConfirmed, runTour])

  return null
}
