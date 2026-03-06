"use client"

import { useState, useMemo } from "react"
import { useI18n } from "@/hooks/use-translations"
import { motion, AnimatePresence } from "framer-motion"
import { format, addMonths, subMonths } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotate, faXmark, faPlus, faChevronLeft, faChevronRight, faPen } from "@fortawesome/free-solid-svg-icons"
import { CategoryIcon } from "@/components/category-icon"
import { PrivacyValue } from "@/components/privacy-value"
import { GlassCard } from "@/components/glass-card"
import { AddEnvelopePanel } from "@/components/add-envelope-panel"
import { AddDrainerPanel } from "@/components/add-drainer-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { CurrencyInput } from "@/components/currency-input"
import { useBudget } from "@/hooks/useBudget"
import { useSettings } from "@/components/settings-provider"
import type { BudgetEnvelope, Subscription } from "@/types/budget.types"

function EnvelopeCard({
  envelope,
  formatCurrency,
  t,
  isSpanish,
  onEdit,
}: {
  envelope: BudgetEnvelope
  formatCurrency: (n: number) => string
  t: (k: string, p?: Record<string, string | number>) => string
  isSpanish: boolean
  onEdit: (env: BudgetEnvelope) => void
}) {
  const budgetAmount = envelope.budget_amount
  const spent = envelope.spent ?? 0
  const pct = budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0
  const isOver = spent > budgetAmount
  const isAtRisk = pct >= 90 && !isOver
  const color = envelope.color ?? envelope.category?.color ?? "#8F00FF"
  const icon = envelope.icon ?? envelope.category?.icon ?? "Wallet"
  const name = envelope.category?.name ?? "Sin categoría"

  return (
    <motion.div
      layout
      role="button"
      tabIndex={0}
      onClick={() => onEdit(envelope)}
      onKeyDown={(e) => e.key === "Enter" && onEdit(envelope)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex min-h-[160px] cursor-pointer flex-col overflow-hidden rounded-2xl lg:min-h-[200px]"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(255,255,255,0.08)",
        ...(isAtRisk && { borderColor: "rgba(239,68,68,0.5)" }),
        ...(isOver && { borderColor: "rgba(239,68,68,0.6)" }),
      }}
    >
      {/* Cup fill - vertical fill from bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 rounded-b-2xl"
        initial={{ height: 0 }}
        animate={{ height: `${Math.min(pct, 100)}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${color}40 50%, ${color}80 100%)`,
          opacity: 0.9,
        }}
      />
      <div className="relative z-10 flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl lg:h-12 lg:w-12"
            style={{ backgroundColor: `${color}25` }}
          >
            <CategoryIcon name={icon} color={color} size={20} strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-1">
            <span
              className="rounded-full p-1.5 text-[10px] text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(envelope)
              }}
              aria-label={t("budgeting.editEnvelope" as any)}
            >
              <FontAwesomeIcon icon={faPen} className="text-xs" />
            </span>
              {isAtRisk && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full px-2 py-0.5 text-[9px] font-bold text-red-400"
                style={{ backgroundColor: "rgba(239,68,68,0.2)" }}
              >
                At Risk
              </motion.span>
            )}
            {isOver && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full px-2 py-0.5 text-[9px] font-bold text-red-400"
                style={{ backgroundColor: "rgba(239,68,68,0.2)" }}
              >
                Over
              </motion.span>
            )}
          </div>
        </div>
        <h3 className="mt-2 font-serif text-sm font-bold tracking-wider text-white lg:text-base">
          {name}
        </h3>
        <div className="mt-auto flex items-end justify-between pt-4">
          <PrivacyValue className="font-mono text-lg font-bold text-white/90 lg:text-xl">
            {formatCurrency(spent)}
          </PrivacyValue>
          <span className="font-mono text-2xl font-bold text-white lg:text-3xl">
            {pct.toFixed(0)}%
          </span>
        </div>
        <p className="mt-0.5 text-right font-mono text-[10px] text-white/50">
          / {formatCurrency(budgetAmount)}
        </p>
      </div>
    </motion.div>
  )
}

function EnvelopeSkeleton() {
  return (
    <div className="flex min-h-[160px] flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 lg:min-h-[200px]">
      <Skeleton className="h-10 w-10 rounded-xl lg:h-12 lg:w-12" />
      <Skeleton className="mt-3 h-4 w-24" />
      <div className="mt-auto flex justify-between pt-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-12" />
      </div>
    </div>
  )
}

function formatNextBill(dateStr: string, locale: "es" | "en"): string {
  try {
    const d = new Date(dateStr + "T12:00:00")
    return format(d, "MMM d", { locale: locale === "es" ? es : enUS })
  } catch {
    return dateStr
  }
}

const thisMonth = new Date()
const initialPeriod = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1)

export default function BudgetingPage() {
  const { t } = useI18n()
  const { formatCurrency, language } = useSettings()
  const isSpanish = language === "es"

  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod)
  const selectedMonth = selectedPeriod.getMonth() + 1
  const selectedYear = selectedPeriod.getFullYear()

  const {
    envelopes,
    subscriptions,
    totalMonthlyDrain,
    totalBudget,
    totalSpent,
    totalPercentage,
    isLoadingEnvelopes,
    isLoadingSubscriptions,
    isCreating,
    isCreatingSubscription,
    isToggling,
    isUpdatingEnvelope,
    isUpsertingTemplate,
    createEnvelope,
    updateEnvelope,
    upsertTemplate,
    createSubscription,
    toggleSubscription,
  } = useBudget({ month: selectedMonth, year: selectedYear })

  const monthYearLabel = useMemo(
    () => format(selectedPeriod, "MMMM yyyy", { locale: isSpanish ? es : enUS }),
    [selectedPeriod, isSpanish]
  )

  const [activeTab, setActiveTab] = useState<"envelopes" | "drainers">("envelopes")
  const [addPanelOpen, setAddPanelOpen] = useState(false)
  const [editingEnvelope, setEditingEnvelope] = useState<BudgetEnvelope | null>(null)
  const [editAmount, setEditAmount] = useState(0)
  const [editApplyToAllMonths, setEditApplyToAllMonths] = useState(false)

  const circumference = 2 * Math.PI * 70
  const strokeOffset = circumference * (1 - Math.min(totalPercentage / 100, 1))
  const activeSubs = subscriptions.filter((s: Subscription) => s.is_active)

  const CircularProgressBlock = () => (
    <div className="flex w-full flex-col items-center gap-3 py-4">
      <div className="relative flex h-44 w-44 items-center justify-center">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 160 160"
          style={{ overflow: "visible" }}
        >
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            style={{
              filter:
                "drop-shadow(0 0 8px #8F00FF) drop-shadow(0 0 20px rgba(143,0,255,0.3))",
            }}
          />
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8F00FF" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {t("budgeting.totalSpent" as any)}
          </span>
          {isLoadingEnvelopes ? (
            <Skeleton className="mt-1 h-9 w-24" />
          ) : (
            <>
              <PrivacyValue
                className="font-mono text-3xl font-bold text-foreground"
                style={{ textShadow: "0 0 20px rgba(143,0,255,0.3)" }}
              >
                {formatCurrency(totalSpent)}
              </PrivacyValue>
              <span className="mt-0.5 font-mono text-xs text-neon-cyan">
                {formatCurrency(totalBudget)} {t("budgeting.limit" as any)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-5xl mx-auto px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="flex flex-wrap items-baseline gap-2">
            <span className="font-serif text-xl font-bold tracking-wider text-foreground">
              {t("budgeting.budget" as any).toUpperCase()}
            </span>
            <span
              className="font-serif text-xl font-bold tracking-wider text-neon-cyan"
              style={{ textShadow: "0 0 10px rgba(0,212,255,0.4)" }}
            >
              {t("budgeting.control" as any).toUpperCase()}
            </span>
          </h1>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.3em] text-neon-green">
            {t("budgeting.protocolActive" as any).toUpperCase()}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setAddPanelOpen((p) => !p)}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            addPanelOpen ? "bg-primary/80" : ""
          }`}
          style={{
            backgroundColor: addPanelOpen ? undefined : "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <FontAwesomeIcon
            icon={faPlus}
            className={`text-sm text-foreground transition-transform ${addPanelOpen ? "rotate-45" : ""}`}
          />
        </motion.button>
      </div>

      {/* Month/Year selector - envelopes tab only */}
      {activeTab === "envelopes" && (
        <div
          className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setSelectedPeriod((p) => subMonths(p, 1))}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
          </motion.button>
          <span className="min-w-[140px] text-center font-serif text-sm font-bold capitalize tracking-wider text-foreground">
            {monthYearLabel}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setSelectedPeriod((p) => addMonths(p, 1))}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
          </motion.button>
        </div>
      )}

      {/* Tab Toggle */}
      <div
        className="flex w-full rounded-full p-1"
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {[
          { key: "envelopes" as const, labelKey: "budgeting.liquidEnvelopes" },
          { key: "drainers" as const, labelKey: "budgeting.drainers" },
        ].map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative flex-1 rounded-full py-2.5 text-center text-[11px] font-bold tracking-wider"
            >
              {isActive && (
                <motion.div
                  layoutId="budget-tab"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      tab.key === "envelopes"
                        ? "linear-gradient(135deg, #8F00FF, #6B00CC)"
                        : "linear-gradient(135deg, #FF007F, #CC0066)",
                    boxShadow:
                      tab.key === "envelopes"
                        ? "0 0 15px rgba(143,0,255,0.3)"
                        : "0 0 15px rgba(255,0,127,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${isActive ? "text-white" : "text-muted-foreground"}`}
              >
                {t(tab.labelKey as any).toUpperCase()}
              </span>
            </button>
          )
        })}
      </div>

      {/* Circular Progress - always visible */}
      {activeTab === "envelopes" && <CircularProgressBlock />}

      {/* Add Panel */}
      <div className="w-full">
          <AnimatePresence mode="wait">
          {activeTab === "envelopes" ? (
            <AddEnvelopePanel
              key="add-envelope"
              open={addPanelOpen}
              onOpenChange={setAddPanelOpen}
              onSave={async (p) => {
                await createEnvelope(p)
              }}
              isPending={isCreating}
              periodMonth={selectedMonth}
              periodYear={selectedYear}
            />
          ) : (
            <AddDrainerPanel
              key="add-drainer"
              open={addPanelOpen}
              onOpenChange={setAddPanelOpen}
              onSave={async (p) => {
                await createSubscription(p)
              }}
              isPending={isCreatingSubscription}
              t={t as (k: string) => string}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Left Panel - Envelopes (visible only when tab=envelopes) */}
      <div
        className={
          activeTab === "envelopes" ? "flex flex-col gap-5 w-full" : "hidden"
        }
      >
        {/* Envelope Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {isLoadingEnvelopes ? (
            Array.from({ length: 4 }).map((_, i) => <EnvelopeSkeleton key={i} />)
          ) : envelopes.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 py-12 md:col-span-3">
              <p className="text-sm text-muted-foreground">
                {t("budgeting.liquidEnvelopes" as any)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("budgeting.addFirstBudget" as any)}
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setAddPanelOpen(true)}
                className="mt-4 rounded-xl bg-primary/20 px-4 py-2 text-xs font-bold text-primary"
              >
                + {t("budgeting.createEnvelope" as any)}
              </motion.button>
            </div>
          ) : (
            envelopes.map((env: BudgetEnvelope) => (
              <EnvelopeCard
                key={env.id}
                envelope={env}
                formatCurrency={formatCurrency}
                t={t as (k: string, p?: Record<string, string | number>) => string}
                isSpanish={isSpanish}
                onEdit={(e) => {
                  setEditingEnvelope(e)
                  setEditAmount(e.budget_amount)
                  setEditApplyToAllMonths(false)
                }}
              />
            ))
          )}
        </div>

        {/* Edit envelope panel */}
        <AnimatePresence>
          {editingEnvelope && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div
                className="mt-4 flex flex-col gap-4 rounded-2xl p-5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(143,0,255,0.2)",
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold tracking-wider text-foreground">
                    {t("budgeting.editEnvelope" as any)}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingEnvelope(null)}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {editingEnvelope.category?.name ?? "—"}
                </p>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t("budgeting.monthlyLimit" as any)}
                  </label>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                    <CurrencyInput
                      value={editAmount}
                      onChange={setEditAmount}
                      prefix="$"
                      placeholder="0.00"
                      inputClassName="text-sm"
                    />
                  </div>
                </div>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={editApplyToAllMonths}
                    onChange={(e) => setEditApplyToAllMonths(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-primary"
                  />
                  <span className="text-xs text-foreground">
                    {t("budgeting.applyToAllMonths" as any)}
                  </span>
                </label>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={
                    editAmount <= 0 ||
                    isUpdatingEnvelope ||
                    isUpsertingTemplate
                  }
                  onClick={async () => {
                    if (!editingEnvelope || editAmount <= 0) return
                    try {
                      if (editApplyToAllMonths) {
                        await upsertTemplate({
                          category_id: editingEnvelope.category_id,
                          budget_amount: editAmount,
                        })
                      }
                      await updateEnvelope({
                        id: editingEnvelope.id,
                        updates: { budget_amount: editAmount },
                      })
                      setEditingEnvelope(null)
                    } catch {
                      // Error handled by hook/parent
                    }
                  }}
                  className="rounded-xl py-3 text-sm font-bold text-white disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #8F00FF, #00D4FF)",
                  }}
                >
                  {isUpdatingEnvelope || isUpsertingTemplate
                    ? "..."
                    : t("common.save" as any)}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel - Drainers (visible only when tab=drainers) */}
      <div
        className={
          activeTab === "drainers"
            ? "flex flex-col gap-3 w-full"
            : "hidden"
        }
      >
        <GlassCard
          className="flex flex-col"
          glowColor="pink"
        >
          {/* Summary: MONTHLY DRAIN left, ACTIVE count right */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("budgeting.monthlyDrain" as any)}
              </p>
              {isLoadingSubscriptions ? (
                <Skeleton className="mt-1.5 h-9 w-28" />
              ) : (
                <PrivacyValue
                  className="mt-1 font-mono text-2xl font-bold lg:text-3xl"
                  style={{
                    color: "#FF007F",
                    textShadow: "0 0 10px rgba(255,0,127,0.4)",
                  }}
                >
                  {formatCurrency(totalMonthlyDrain)}
                </PrivacyValue>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {t("budgeting.active" as any)}
              </p>
              <p
                className="mt-1 font-mono text-xl font-bold"
                style={{ color: "#FF8C00" }}
              >
                {activeSubs.length}
              </p>
            </div>
          </div>
        </GlassCard>
        <div className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1 lg:max-h-[340px]">
            {isLoadingSubscriptions ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-5 w-14" />
                </div>
              ))
            ) : subscriptions.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                {t("budgeting.noSubscriptions" as any)}
              </p>
            ) : (
              subscriptions.map((sub: Subscription) => (
                <DrainerRow
                  key={sub.id}
                  sub={sub}
                  formatCurrency={formatCurrency}
                  onToggle={() =>
                    toggleSubscription({ id: sub.id, is_active: !sub.is_active })
                  }
                  isToggling={isToggling}
                  formatNextBill={(d) => formatNextBill(d, isSpanish ? "es" : "en")}
                  t={t as (k: string) => string}
                />
              ))
            )}
          </div>
      </div>
    </div>
  )
}

function DrainerRow({
  sub,
  formatCurrency,
  onToggle,
  isToggling,
  formatNextBill,
  t,
}: {
  sub: Subscription
  formatCurrency: (n: number) => string
  onToggle: () => void
  isToggling: boolean
  formatNextBill: (d: string) => string
  t: (k: string) => string
}) {
  const isActive = sub.is_active
  const color = sub.color ?? "#FF007F"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isActive ? 1 : 0.5, y: 0 }}
      className="flex items-center gap-4 rounded-xl p-4"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        <FontAwesomeIcon icon={faRotate} className="text-base" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${
            !isActive ? "text-muted-foreground line-through" : "text-foreground"
          }`}
        >
          {sub.name}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {t("budgeting.next" as any)}: {formatNextBill(sub.next_bill_date)}
        </p>
      </div>
      <PrivacyValue className="font-mono text-sm font-bold text-foreground">
        {formatCurrency(sub.amount)}
      </PrivacyValue>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        disabled={isToggling}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full disabled:opacity-50"
        style={{
          backgroundColor: "rgba(255,0,127,0.25)",
          border: "1px solid rgba(255,0,127,0.3)",
        }}
        aria-label={isActive ? "Desactivar" : "Reactivar"}
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="text-sm text-white"
        />
      </motion.button>
    </motion.div>
  )
}
