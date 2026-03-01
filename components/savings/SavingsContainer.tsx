"use client"

import Link from "next/link"
import { useGoals } from "@/hooks/useGoals"
import { useI18n } from "@/hooks/use-translations"
import { SavingsCard } from "./SavingsCard"
import { SavingsCardSkeleton } from "./SavingsCardSkeleton"
import { useGoalAnalytics } from "@/hooks/useGoalAnalytics"
import { Goal } from "@/types/goals.types"

function SavingsCardWithAnalytics({
  goal,
  t,
}: {
  goal: Goal,
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const { analytics, isLoading: isLoadingAnalytics } = useGoalAnalytics(goal.id)
  return (
    <SavingsCard
      goal={goal as unknown as import("@/types/goals.types").Goal}
      analytics={analytics ?? null}
      isLoadingAnalytics={isLoadingAnalytics}
      t={t}
    />
  )
}

export function SavingsContainer() {
  const { t } = useI18n()
  const { goals, isLoading } = useGoals()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SavingsCardSkeleton />
        <SavingsCardSkeleton />
      </div>
    )
  }

  if (!goals || goals.length === 0) {
    return (
      <Link href="/savings">
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-2xl p-8 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(143,0,255,0.08), rgba(0,212,255,0.04))",
            border: "1px dashed rgba(143,0,255,0.3)",
          }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(143,0,255,0.15)" }}
          >
            <span className="text-3xl">🐷</span>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {t("savings.createFirstPiggy" as any)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("goals.tapToCreate" as any)}
            </p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div
      className={`grid gap-4 md:grid-cols-2 lg:grid-cols-2 ${
        goals.length === 1 ? "max-w-md" : ""
      }`}
    >
      {goals.map((goal) => (
        <SavingsCardWithAnalytics
          key={goal.id}
          goal={goal}
          t={t as (key: string, params?: Record<string, string | number>) => string}
        />
      ))}
    </div>
  )
}
