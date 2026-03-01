"use client"

import { useState, useMemo, useCallback } from "react"
import { useI18n } from "@/hooks/use-translations"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShieldHalved,
  faPlus,
  faFire,
  faCheck,
  faTrophy,
  faArrowUp,
  faXmark,
  faTrashCan,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons"
import { PrivacyValue } from "@/components/privacy-value"
import { useGoals } from "@/hooks/useGoals"
import { useSettings } from "@/components/settings-provider"
import { CurrencyInput } from "@/components/currency-input"

type GoalType = "open" | "progression"

interface SavingsGoal {
  id: string
  name: string
  type: GoalType
  target: number
  saved: number
  currency?: string
  createdAt: string
  startAmount?: number
  increment?: number
  currentDay?: number
  lastCheckIn?: string
  streak?: number
  challengeDays?: number
}

/** Map API Goal to UI SavingsGoal */
function apiGoalToSavingsGoal(g: import("@/types/goals.types").Goal): SavingsGoal {
  const isProgression = g.piggy_type === "daily"
  const saved = g.saved_already ?? g.saved_amount ?? 0
  const created = g.created_at ? new Date(g.created_at) : new Date()
  const deadline = g.deadline ? new Date(g.deadline) : new Date()
  const challengeDays = g.challenge_days ?? Math.max(1, Math.ceil((deadline.getTime() - created.getTime()) / (24 * 60 * 60 * 1000)))
  const lastContrib = g.last_contribution_date ?? g.last_check_in ?? null

  // Derive currentDay from last contribution (days since created, 0-indexed for "next day to do")
  let currentDay = g.current_day ?? 0
  if (isProgression && lastContrib && g.created_at) {
    const start = new Date(g.created_at).setHours(0, 0, 0, 0)
    const last = new Date(lastContrib + "T12:00:00").getTime()
    currentDay = Math.floor((last - start) / (24 * 60 * 60 * 1000))
  }

  return {
    id: g.id,
    name: g.name,
    type: isProgression ? "progression" : "open",
    target: g.target_amount ?? 0,
    saved: Number(saved) || 0,
    currency: g.currency ?? "USD",
    createdAt: g.created_at?.split("T")[0] ?? "",
    startAmount: g.start_amount ?? 0,
    increment: g.increment_amount ?? 0,
    currentDay,
    lastCheckIn: lastContrib ?? undefined,
    streak: g.streak ?? currentDay,
    challengeDays,
  }
}

// --- Math helpers ---

/** Sum of arithmetic progression: day_i = startAmount + increment * (i-1), for i=1..days */
function progressionDayAmount(startAmount: number, increment: number, day: number): number {
  return startAmount + increment * (day - 1)
}

function progressionTotalForDays(startAmount: number, increment: number, days: number): number {
  // Sum = days * startAmount + increment * days*(days-1)/2
  return days * startAmount + increment * (days * (days - 1)) / 2
}

function getTodayDeposit(startAmount: number, increment: number, currentDay: number): number {
  return progressionDayAmount(startAmount, increment, currentDay + 1)
}

// --- Particle Explosion ---

function ParticleExplosion() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i / 20) * 360,
    distance: 40 + Math.random() * 60,
    size: 3 + Math.random() * 4,
    color: ["#8F00FF", "#00D4FF", "#FF007F", "#00FF94"][i % 4],
    delay: Math.random() * 0.3,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration: 1.2,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

// --- PiggyBank Card ---

function PiggyBank({
  goal,
  onCheckIn,
  onDeposit,
  onDelete,
  t,
  formatCurrency,
  isContributing,
  isDeleting,
}: {
  goal: SavingsGoal
  onCheckIn: (id: string, amount: number) => void
  onDeposit: (id: string, amount: number) => void
  onDelete: (id: string) => void
  t: (key: string, params?: Record<string, string | number>) => string
  formatCurrency: (amount: number, currency?: string) => string
  isContributing: boolean
  isDeleting: boolean
}) {
  const [depositInput, setDepositInput] = useState("")
  const [showDeposit, setShowDeposit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const effectiveTarget =
    goal.type === "progression"
      ? progressionTotalForDays(
          goal.startAmount || 1,
          goal.increment || 1,
          goal.challengeDays || 30
        )
      : goal.target

  const fillPercentage = effectiveTarget > 0 ? Math.min((goal.saved / effectiveTarget) * 100, 100) : 0
  const isComplete = fillPercentage >= 100

  const today = new Date().toISOString().split("T")[0]
  const canCheckInToday =
    goal.type === "progression" && goal.lastCheckIn !== today && !isComplete
  const todayAmount =
    goal.type === "progression"
      ? getTodayDeposit(goal.startAmount || 1, goal.increment || 1, goal.currentDay || 0)
      : 0

  const daysRemaining =
    goal.type === "progression"
      ? Math.max(0, (goal.challengeDays || 30) - (goal.currentDay || 0))
      : 0

  const handleDeposit = () => {
    const amt = parseFloat(depositInput)
    if (amt > 0) {
      onDeposit(goal.id, amt)
      setDepositInput("")
      setShowDeposit(false)
    }
  }

  const handleCheckInClick = () => {
    if (goal.type === "progression") {
      const amt = getTodayDeposit(goal.startAmount || 1, goal.increment || 1, (goal.currentDay || 0) + 1)
      onCheckIn(goal.id, amt)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(25px)",
        border: isComplete
          ? "1px solid rgba(0,255,148,0.3)"
          : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Liquid Fill Background */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ height: "0%" }}
        animate={{ height: `${fillPercentage}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          background: isComplete
            ? "linear-gradient(to top, rgba(0,255,148,0.15), rgba(0,212,255,0.05))"
            : "linear-gradient(to top, rgba(143,0,255,0.12), rgba(0,212,255,0.04))",
        }}
      >
        <motion.div
          className="absolute left-0 right-0 top-0 h-2"
          style={{
            background: isComplete
              ? "radial-gradient(ellipse at center, rgba(0,255,148,0.3), transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(143,0,255,0.25), transparent 70%)",
          }}
          animate={{ translateY: [-2, 2, -2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {isComplete && <ParticleExplosion />}

      {/* Content */}
      <div className="relative z-10 p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: isComplete
                  ? "rgba(0,255,148,0.15)"
                  : "rgba(143,0,255,0.15)",
              }}
            >
              <FontAwesomeIcon
                icon={isComplete ? faTrophy : faShieldHalved}
                className="text-lg"
                style={{
                  color: isComplete ? "#00FF94" : "#8F00FF",
                  filter: `drop-shadow(0 0 8px ${isComplete ? "#00FF94" : "#8F00FF"})`,
                }}
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{goal.name}</h3>
              <p className="text-[10px] text-muted-foreground">
                {goal.type === "open"
                  ? t("goals.openGoal")
                  : `${t("goals.dailyChallenge")} · +${formatCurrency(goal.increment ?? 0, goal.currency)}/${t("time.units.day" as any)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isComplete && (
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: "rgba(0,255,148,0.15)",
                  color: "#00FF94",
                }}
              >
                {t("goals.complete").toUpperCase()}
              </motion.span>
            )}
            {/* Delete button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              aria-label={t("common.delete")}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                className="text-xs text-muted-foreground"
              />
            </motion.button>
          </div>
        </div>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div
                className="flex items-center justify-between rounded-xl p-3"
                style={{
                  backgroundColor: "rgba(255,0,127,0.08)",
                  border: "1px solid rgba(255,0,127,0.2)",
                }}
              >
                <p className="text-xs text-foreground">{t("goals.deleteThisGoal")}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(goal.id)}
                    disabled={isDeleting}
                    className="rounded-lg px-3 py-1.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: "rgba(255,0,127,0.3)" }}
                  >
                    {t("common.delete")}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-lg px-3 py-1.5 text-[10px] font-bold text-muted-foreground"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    {t("common.cancel")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-end justify-between">
            <PrivacyValue
              className="font-mono text-2xl font-bold text-foreground"
              style={{
                textShadow: isComplete
                  ? "0 0 15px rgba(0,255,148,0.3)"
                  : "0 0 15px rgba(143,0,255,0.3)",
              }}
            >
              {formatCurrency(goal.saved ?? 0, goal.currency)}
            </PrivacyValue>
            <span className="font-mono text-xs text-muted-foreground">
              / {formatCurrency(effectiveTarget, goal.currency)}
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${fillPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                background: isComplete
                  ? "linear-gradient(90deg, #00FF94, #00D4FF)"
                  : "linear-gradient(90deg, #8F00FF, #00D4FF)",
                boxShadow: isComplete
                  ? "0 0 10px rgba(0,255,148,0.5)"
                  : "0 0 10px rgba(143,0,255,0.4)",
              }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: isComplete ? "#00FF94" : "#8F00FF" }}
            >
              {fillPercentage.toFixed(0)}%
            </span>
            <span className="text-[10px] text-muted-foreground">
              {t("goals.securityLvlPrefix" as any)}
              {fillPercentage < 25
                  ? t("goals.securityLevel.low" as any)
                : fillPercentage < 50
                  ? t("goals.securityLevel.moderate" as any)
                  : fillPercentage < 75
                    ? t("goals.securityLevel.high" as any)
                    : fillPercentage < 100
                      ? t("goals.securityLevel.veryHigh" as any)
                      : t("goals.securityLevel.max" as any)}
            </span>
          </div>
        </div>

        {/* Progression-specific: Streak + Daily Check-in + Days Remaining */}
        {goal.type === "progression" && (
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Streak Badge */}
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  backgroundColor: "rgba(255,127,0,0.1)",
                  border: "1px solid rgba(255,127,0,0.2)",
                }}
              >
                <FontAwesomeIcon
                  icon={faFire}
                  className="text-xs"
                  style={{
                    color: "#FF8C00",
                    filter: "drop-shadow(0 0 4px #FF8C00)",
                  }}
                />
                <span
                  className="font-mono text-xs font-bold"
                  style={{ color: "#FF8C00" }}
                >
                  {t("goals.dayStreak", { count: goal.streak || 0 })}
                </span>
              </div>

              {/* Days remaining */}
              {!isComplete && (
                <span className="text-[10px] text-muted-foreground">
                  {t("goals.daysLeft", { count: daysRemaining })}
                </span>
              )}
            </div>

            {/* Check-in Button */}
            {canCheckInToday ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckInClick}
                disabled={isContributing}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #8F00FF, #00D4FF)",
                  boxShadow: "0 0 12px rgba(143,0,255,0.3)",
                }}
              >
                <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                <span>
                  {t("goals.checkIn" as any, { amount: formatCurrency(todayAmount, goal.currency) })}
                </span>
              </motion.button>
            ) : (
              !isComplete && (
                <span className="flex items-center gap-1.5 text-[10px] text-neon-green">
                  <FontAwesomeIcon icon={faCheck} className="text-[8px]" />
                  {t("goals.todayDone")}
                </span>
              )
            )}
          </div>
        )}

        {/* Open Goal: Deposit Button */}
        {goal.type === "open" && !isComplete && (
          <div className="mt-4">
            <AnimatePresence>
              {showDeposit ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div
                    className="flex flex-1 items-center gap-1 rounded-xl px-3 py-2"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="font-mono text-sm text-neon-purple">
                      {goal.currency === "DOP" ? "RD$" : goal.currency === "EUR" ? "€" : "$"}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={depositInput}
                      onChange={(e) =>
                        setDepositInput(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      placeholder="0.00"
                      className="w-full bg-transparent font-mono text-sm font-bold text-foreground outline-none placeholder-muted-foreground/40"
                      autoFocus
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDeposit}
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(0,255,148,0.15)" }}
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-sm text-neon-green"
                    />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDeposit(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(255,0,127,0.1)" }}
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="text-sm text-neon-pink"
                    />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeposit(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold"
                  style={{
                    backgroundColor: "rgba(143,0,255,0.1)",
                    border: "1px solid rgba(143,0,255,0.2)",
                    color: "#8F00FF",
                  }}
                >
                  <FontAwesomeIcon icon={faArrowUp} className="text-[10px]" />
                  {t("goals.deposit")}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// --- Main Page ---

export default function SavingsGoalsPage() {
  const { t } = useI18n()
  const { currency, formatCurrency } = useSettings()
  const {
    goals: apiGoals,
    isLoading: loadingGoals,
    createGoal,
    contribute,
    deleteGoal,
    isCreating,
    isContributing,
    isDeleting,
  } = useGoals()

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState<GoalType>("open")
  const [newTarget, setNewTarget] = useState(0)
  const [newStartAmount, setNewStartAmount] = useState("1")
  const [newIncrement, setNewIncrement] = useState("1")
  const [newChallengeDays, setNewChallengeDays] = useState("30")

  const goals = useMemo(
    () => apiGoals.map(apiGoalToSavingsGoal),
    [apiGoals]
  )

  const totalSaved = useMemo(
    () => goals.reduce((s, g) => s + g.saved, 0),
    [goals]
  )

  // Auto-calculated target for progression
  const projectedTotal = useMemo(() => {
    const start = parseFloat(newStartAmount) || 1
    const inc = parseFloat(newIncrement) || 1
    const days = parseInt(newChallengeDays) || 30
    return progressionTotalForDays(start, inc, days)
  }, [newStartAmount, newIncrement, newChallengeDays])

  // Generate a preview of first 5 days
  const dayPreview = useMemo(() => {
    const start = parseFloat(newStartAmount) || 1
    const inc = parseFloat(newIncrement) || 1
    const days = Math.min(parseInt(newChallengeDays) || 30, 5)
    return Array.from({ length: days }, (_, i) =>
      progressionDayAmount(start, inc, i + 1)
    )
  }, [newStartAmount, newIncrement, newChallengeDays])

  const handleCheckIn = useCallback(
    async (goalId: string, amount: number) => {
      try {
        await contribute({ id: goalId, amount })
      } catch (err) {
        console.error(err)
      }
    },
    [contribute]
  )

  const handleDeposit = useCallback(
    async (goalId: string, amount: number) => {
      try {
        await contribute({ id: goalId, amount })
      } catch (err) {
        console.error(err)
      }
    },
    [contribute]
  )

  const handleDelete = useCallback(
    async (goalId: string) => {
      try {
        await deleteGoal(goalId)
      } catch (err) {
        console.error(err)
      }
    },
    [deleteGoal]
  )

  const handleCreate = async () => {
    if (!newName) return

    const start = parseFloat(newStartAmount) || 1
    const inc = parseFloat(newIncrement) || 1
    const days = parseInt(newChallengeDays) || 30
    const targetVal = newType === "open" ? (newTarget || 1000) : progressionTotalForDays(start, inc, days)

    const deadline = new Date()
    if (newType === "progression") {
      deadline.setDate(deadline.getDate() + days)
    } else {
      deadline.setFullYear(deadline.getFullYear() + 1)
    }

    try {
      await createGoal({
        name: newName,
        target_amount: targetVal,
        is_piggy_bank: true,
        piggy_type: newType === "progression" ? "daily" : "open",
        start_amount: newType === "progression" ? start : undefined,
        increment_amount: newType === "progression" ? inc : undefined,
        color: "#8F00FF",
        icon: "PiggyBank",
        description: null,
        saved_already: 0,
        currency,
        deadline: deadline.toISOString().split("T")[0],
        notify_inactivity_days: 3,
        notify_on_risk: true,
      })
      setNewName("")
      setNewTarget(0)
      setNewStartAmount("1")
      setNewIncrement("1")
      setNewChallengeDays("30")
      setShowCreate(false)
    } catch (err) {
      console.error(err)
    }
  }

  if (loadingGoals) {
    return (
      <div className="flex flex-col gap-5 px-4 pt-6 pb-4 lg:px-0">
        <div className="h-64 animate-pulse rounded-2xl bg-muted/20" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-4 lg:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-bold tracking-wider text-foreground">
              {t("goals.savings" as any).toUpperCase()}
            </span>
            <span
              className="font-serif text-xl font-bold tracking-wider text-neon-green"
              style={{ textShadow: "0 0 10px rgba(0,255,148,0.4)" }}
            >
              {t("goals.vault" as any).toUpperCase()}
            </span>
          </h1>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.3em] text-neon-cyan">
            {t("goals.neonPiggyBank" as any).toUpperCase()}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreate(!showCreate)}
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #8F00FF, #00D4FF)",
            boxShadow: "0 0 12px rgba(143,0,255,0.3)",
          }}
        >
          <FontAwesomeIcon
            icon={showCreate ? faXmark : faPlus}
            className="text-sm text-white"
          />
        </motion.button>
      </div>

      {/* Total Saved */}
      <div
        className="flex items-center justify-between rounded-2xl p-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(143,0,255,0.1), rgba(0,212,255,0.05))",
          border: "1px solid rgba(143,0,255,0.15)",
        }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("goals.totalSaved" as any)}
          </p>
          <PrivacyValue
            className="font-mono text-2xl font-bold text-foreground"
            style={{ textShadow: "0 0 20px rgba(143,0,255,0.3)" }}
          >
            {formatCurrency(totalSaved)}
          </PrivacyValue>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "rgba(143,0,255,0.15)" }}
        >
          <FontAwesomeIcon
            icon={faShieldHalved}
            className="text-xl text-neon-purple"
            style={{ filter: "drop-shadow(0 0 8px #8F00FF)" }}
          />
        </div>
      </div>

      {/* Create Goal Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className="flex flex-col gap-4 rounded-2xl p-5"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(25px)",
                border: "1px solid rgba(143,0,255,0.2)",
              }}
            >
              <h3 className="font-serif text-sm font-bold tracking-wider text-foreground">
                {t("goals.newGoal" as any).toUpperCase()}
              </h3>

              {/* Type selector */}
              <div className="flex gap-2">
                {(
                  [
                    { key: "open" as GoalType, labelKey: "goals.openGoal" },
                    { key: "progression" as GoalType, labelKey: "goals.dailyChallenge" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setNewType(tab.key)}
                    className="relative flex-1 rounded-xl py-2.5 text-center text-xs font-bold"
                  >
                    {newType === tab.key && (
                      <motion.div
                        layoutId="new-goal-type"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "rgba(143,0,255,0.15)",
                          border: "1px solid rgba(143,0,255,0.3)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${newType === tab.key ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {t(tab.labelKey as any)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Goal Name */}
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t("goals.goalName" as any)}
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t("goals.placeholder.name" as any)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder-muted-foreground/50"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              </div>

              {/* Open Goal: Target Amount */}
              {newType === "open" && (
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t("goals.targetAmount" as any)}
                  </label>
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-3"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="font-mono text-sm text-neon-purple">$</span>
                    {/* <input
                      type="text"
                      inputMode="decimal"
                      value={newTarget}
                      onChange={(e) =>
                        setNewTarget(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      placeholder="5000"
                      className="w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder-muted-foreground/50"
                    /> */}
                    <CurrencyInput
                      value={newTarget}
                      onChange={setNewTarget}
                      placeholder="5000"
                      inputClassName="text-sm placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>
              )}

              {/* Progression: Start Amount + Increment + Days */}
              {newType === "progression" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Start Amount */}
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t("goals.day1Amount" as any)}
                      </label>
                      <div
                        className="flex items-center gap-1 rounded-xl px-3 py-3"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <span className="font-mono text-sm text-neon-cyan">$</span>
                        <CurrencyInput
                          value={Number(newStartAmount) || 0}
                          onChange={(value) => setNewStartAmount(String(value))}
                          placeholder="0.00"
                          inputClassName="text-sm placeholder:text-muted-foreground/40"
                          min={0}
                          max={10000000}
                        />
                      </div>
                    </div>

                    {/* Increment */}
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t("goals.dailyIncrement" as any)}
                      </label>
                      <div
                        className="flex items-center gap-1 rounded-xl px-3 py-3"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <span className="font-mono text-sm text-neon-green">
                          +$
                        </span>
                        <CurrencyInput
                          value={Number(newIncrement) || 0}
                          onChange={(value) => setNewIncrement(String(value))}
                          placeholder="0.00"
                          inputClassName="text-sm placeholder:text-muted-foreground/40"
                          min={0}
                          max={10000000}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Challenge Duration */}
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t("goals.challengeDuration" as any)}
                    </label>
                    <div
                      className="flex items-center gap-2 rounded-xl px-4 py-3"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <input
                        type="text"
                        inputMode="numeric"
                        value={newChallengeDays}
                        onChange={(e) =>
                          setNewChallengeDays(
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                        maxLength={4}
                        placeholder="30"
                        className="w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder-muted-foreground/50"
                      />
                      <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                        {t("goals.days" as any)}
                      </span>
                    </div>
                  </div>

                  {/* Preview */}
                  <div
                    className="rounded-xl p-3"
                    style={{ backgroundColor: "rgba(0,212,255,0.06)" }}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <FontAwesomeIcon icon={faChevronDown} className="text-[8px]" />
                      <span>{t("goals.preview" as any)}</span>
                    </div>
                    <div className="mt-1.5 flex gap-2">
                      {dayPreview.map((amt, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center rounded-lg px-2 py-1"
                          style={{ backgroundColor: "rgba(143,0,255,0.08)" }}
                        >
                          <span className="text-[8px] text-muted-foreground">
                            D{i + 1}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-neon-cyan">
                            {formatCurrency(amt, currency)}
                          </span>
                        </div>
                      ))}
                      <div className="flex flex-col items-center justify-center px-1">
                        <span className="text-[10px] text-muted-foreground">
                          ...
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 font-mono text-xs font-bold text-neon-cyan">
                      {t("goals.totalInDays" as any, { days: newChallengeDays || "30" })}: {formatCurrency(projectedTotal, currency)}
                    </p>
                  </div>
                </>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCreate}
                disabled={!newName || isCreating}
                className="rounded-xl py-3 text-sm font-bold text-white disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #8F00FF, #00D4FF)",
                  boxShadow: "0 0 15px rgba(143,0,255,0.3)",
                }}
              >
                {t("goals.createGoal" as any)}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {goals.map((goal) => (
            <PiggyBank
              key={goal.id}
              goal={goal}
              onCheckIn={handleCheckIn}
              onDeposit={handleDeposit}
              onDelete={handleDelete}
              t={t as (key: string, params?: Record<string, string | number>) => string}
              formatCurrency={formatCurrency}
              isContributing={isContributing}
              isDeleting={isDeleting}
            />
          ))}
        </AnimatePresence>
        {goals.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "rgba(143,0,255,0.1)" }}
            >
              <FontAwesomeIcon
                icon={faShieldHalved}
                className="text-2xl text-neon-purple"
                style={{ filter: "drop-shadow(0 0 8px #8F00FF)" }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{t("goals.noGoalsYet" as any)}</p>
            <p className="text-xs text-muted-foreground">
              {t("goals.tapToCreate" as any)}
            </p>
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  )
}
