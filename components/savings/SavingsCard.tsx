"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFire, faPiggyBank, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import confetti from "canvas-confetti"
import { useQueryClient } from "@tanstack/react-query"
import { useSettings } from "@/components/settings-provider"
import { goalsService } from "@/services/goals.service"
import { GOALS_QUERY_KEY } from "@/hooks/useGoals"
import { getGoalMood } from "./get-goal-mood"
import type { Goal, GoalAnalytics } from "@/types/goals.types"

interface SavingsCardProps {
  goal: Goal
  analytics: GoalAnalytics | null
  isLoadingAnalytics: boolean
  t: (key: string, params?: Record<string, string | number>) => string
}

function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#8F00FF", "#00D4FF", "#FF007F", "#00FF94"],
  })
}

export function SavingsCard({
  goal,
  analytics,
  isLoadingAnalytics,
  t,
}: SavingsCardProps) {
  const { formatCurrency } = useSettings()
  const queryClient = useQueryClient()

  const isDaily = goal.piggy_type === "daily"
  const isTodayPaid = analytics?.isTodayPaid ?? false
  const currentStreak = analytics?.currentStreak ?? 0
  const nextAmount = analytics?.nextPaymentAmount ?? goal.start_amount ?? 0
  const currency = analytics?.currency ?? goal.currency ?? "USD"
  const statusHealth = analytics?.statusHealth ?? "A tiempo"
  const daysRemaining = analytics?.daysRemaining ?? 0
  const percentage = analytics?.percentage ?? 0
  const saved = goal.saved_already ?? 0
  const target = goal.target_amount ?? 0

  const mood = isDaily ? getGoalMood(isTodayPaid, statusHealth, currentStreak, t) : { variant: "default" as const, copy: "" }

  // Open: no pressure, just navigate. Daily: Quick Save on click when !isTodayPaid
  const handleClick = (e: React.MouseEvent) => {
    if (isDaily && !isTodayPaid && nextAmount > 0) {
      e.preventDefault()
      goalsService
        .contribute(goal.id, nextAmount)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY })
          fireConfetti()
        })
        .catch((err) => console.error("Contribute failed:", err))
    }
  }

  const cardStyle = {
    background:
      mood.variant === "danger"
        ? "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))"
        : "linear-gradient(135deg, rgba(var(--neon-1-rgb, 143,0,255), 0.1), rgba(var(--neon-2-rgb, 0,212,255), 0.05))",
    border: `1px solid ${
      mood.variant === "danger" ? "rgba(239,68,68,0.3)" : "rgba(var(--neon-1-rgb, 143,0,255), 0.2)"
    }`,
  }

  const iconColor = isTodayPaid ? "#00FF94" : "#FF8C00"
  const IconComponent = isDaily ? faFire : faPiggyBank

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="flex h-full items-center gap-3 rounded-2xl p-4"
      style={cardStyle}
    >
      {/* Icono Neón */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
        style={{
          backgroundColor: isTodayPaid ? "rgba(0,255,148,0.15)" : "rgba(255,127,0,0.15)",
        }}
      >
        <FontAwesomeIcon
          icon={IconComponent}
          className="text-lg"
          style={{
            color: iconColor,
            filter: `drop-shadow(0 0 6px ${iconColor})`,
          }}
        />
      </div>

      {/* Contenido */}
      <div className="min-w-0 flex-1">
        <div className="flex justify-between items-center py-1">
        <p className="text-sm font-bold text-foreground">
          {goal.name}
        </p>
        {isDaily && isTodayPaid && (
            <span className=" font-mono text-neon-green">✓ Completado</span>
          )}
        </div>


        {isLoadingAnalytics ? (
          <div className="mt-1 h-4 w-40 animate-pulse rounded bg-white/10" />
        ) : (
          <>
            {isDaily ? (
              <>
                <p className="mt-0.5 text-xs">
                  {isTodayPaid ? (
                    <span className="text-muted-foreground">{mood.copy}</span>
                  ) : (
                    <>
                      <span className="text-muted-foreground">
                        {t("goals.streak.depositToday" as any)}:{" "}
                      </span>
                      <span className="font-mono font-bold text-neon-cyan" style={{ textShadow: "0 0 8px rgba(0,212,255,0.4)" }}>
                        {formatCurrency(nextAmount, currency)}
                      </span>
                    </>
                  )}
                </p>
                {isTodayPaid ? null : (
                  <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                    {mood.copy}
                  </p>
                )}
                {!isTodayPaid && currentStreak > 0 && (
                  <p className="mt-1 text-[10px] font-bold" style={{ color: "#FF8C00" }}>
                    {t("goals.dayStreak", { count: currentStreak })}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="mt-0.5 text-xs">
                  <span className="font-mono font-bold text-neon-cyan" style={{ textShadow: "0 0 8px rgba(0,212,255,0.4)" }}>
                    {formatCurrency(saved, currency)}
                  </span>
                  <span className="text-muted-foreground"> / {formatCurrency(target, currency)}</span>
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {t("savings.openGoalReminder" as any, { days: daysRemaining })}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground italic">
                  {t("savings.contributeWhenReady" as any)}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #8F00FF, #00D4FF)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4 shrink-0 text-muted-foreground/50" />
    </motion.div>
  )

  return (
    <Link
      href={isDaily ? "/savings" : "/savings"}
      onClick={handleClick}
      className="block h-full min-h-[88px]"
    >
      {cardContent}
    </Link>
  )
}
