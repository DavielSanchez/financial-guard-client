"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEye,
  faEyeSlash,
  faArrowTrendUp,
  faArrowTrendDown,
  faBolt,
  faClock,
  faGear,
  faRobot,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { useState, useMemo } from "react"
import { usePrivacy } from "@/components/providers"
import { useSettings } from "@/components/settings-provider"
import { PrivacyValue } from "@/components/privacy-value"
import { DashboardChart } from "@/components/dashboard-chart"
import { useAuthStore } from "@/store/use-auth-store"
import { useI18n } from "@/hooks/use-translations"
import { useDashboard } from "@/hooks/useDashboard"
import { useAccounts } from "@/hooks/useAccounts"
import { useRecentTransactions } from "@/hooks/useRecentTransactions"
import { CategoryIcon } from "@/components/category-icon"
import { hexToRgba } from "@/lib/hexToRgba "
import { SavingsContainer } from "@/components/savings/SavingsContainer"
import { useBudget } from "@/hooks/useBudget"
import { LanguageModal } from "@/components/onboarding/LanguageModal"
import { useOnboarding } from "@/hooks/useOnboarding"
import { useOnboardingContext } from "@/components/onboarding/OnboardingProvider"

type TimePeriod = "Day" | "Week" | "Month" | "Year"
type BalanceTab = "BALANCE" | "INCOME" | "EXPENSE"

function useDashboardData(period: TimePeriod) {
  const { data, loading, error } = useDashboard(period)
  const { accounts, isLoading: loadingAccounts } = useAccounts()
  const {
    transactions,
    isLoading: loadingRecent,
  } = useRecentTransactions()

  return {
    summary: data,
    isLoadingSummary: loading,
    summaryError: error,
    accounts,
    isLoadingAccounts: loadingAccounts,
    recent: transactions,
    isLoadingRecent: loadingRecent,
  }
}

export default function DashboardPage() {
  const { t } = useI18n()
  const { privacyMode, togglePrivacy } = usePrivacy()
  const { shouldShowOnboarding, skipOnboarding, forceStart } = useOnboarding()
  const ctx = useOnboardingContext()
  const showLanguageModal = shouldShowOnboarding && !forceStart && !ctx?.languageModalConfirmed
  const { formatCurrency } = useSettings()
  const [period, setPeriod] = useState<TimePeriod>("Day")
  const [balanceTab, setBalanceTab] = useState<BalanceTab>("BALANCE")
  const user = useAuthStore((state) => state.user)

  const {
    summary,
    isLoadingSummary,
    accounts,
    isLoadingAccounts,
    recent,
    isLoadingRecent,
  } = useDashboardData(period)

  const {
    envelopes,
    subscriptions,
    nearestSubscription,
    totalBudget,
    totalSpent,
    isLoadingEnvelopes,
    isLoadingSubscriptions,
    isLoadingNearestSubscription,
  } = useBudget()

  const budgetRemaining = totalBudget - totalSpent
  const budgetUsedPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const daysUntilNextBill = useMemo(() => {
    if (!nearestSubscription) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const next = new Date(nearestSubscription.next_bill_date + "T12:00:00")
    next.setHours(0, 0, 0, 0)
    return Math.ceil((next.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
  }, [nearestSubscription])

  const displayValue = useMemo(() => {
    if (!summary) return 0
    switch (balanceTab) {
      case "BALANCE":
        return summary.balance
      case "INCOME":
        return summary.income
      case "EXPENSE":
        return summary.expense
      default:
        return 0
    }
  }, [balanceTab, summary])

  const getGreetingKey = () => {
    const h = new Date().getHours()
    if (h < 6) return "greetings.night"
    if (h < 12) return "greetings.morning"
    if (h < 18) return "greetings.afternoon"
    return "greetings.evening"
  }

  const tabKeys: BalanceTab[] = ["BALANCE", "INCOME", "EXPENSE"]
  const periodKeys: TimePeriod[] = ["Day", "Week", "Month", "Year"]
  const tabConfig = {
    BALANCE: {
      color: "var(--neon-1)",
      data: summary?.chartBalance || [],
      id: "grad-balance",
    },
    INCOME: {
      color: "#10b981",
      data: summary?.chartIncome || [],
      id: "grad-income",
    },
    EXPENSE: {
      color: "#ef4444",
      data: summary?.chartExpense || [],
      id: "grad-expense",
    },
  }
  const currentChart =
    tabConfig[balanceTab as keyof typeof tabConfig] || tabConfig.BALANCE

  const translatedTabs = t("balance" as any) as unknown as string[]
  const translatedPeriods = t("periods" as any) as unknown as string[]

  const deltaUp = summary ? summary.delta >= 0 : true

  const renderHeader = () => (
    <div className="flex items-start justify-between">
      <div>
        <p
          className="text-xs font-bold tracking-widest text-neon-green"
          style={{
            textShadow: `0 0 8px rgba(var(--neon-4-rgb),0.4)`,
          }}
        >
          {t(getGreetingKey() as any)}
        </p>
        <h1 className="mt-0.5 text-2xl font-bold leading-tight text-foreground">
          {t("greetings.welcome" as any)},
          <br />
          <span className="font-serif tracking-wider">
            {user?.profile?.firstName}
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePrivacy}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
          }}
          aria-label={privacyMode ? t("dashboard.hideValues" as any) : t("dashboard.showValues" as any)}
        >
          <FontAwesomeIcon
            icon={privacyMode ? faEyeSlash : faEye}
            className="text-sm text-foreground"
          />
        </motion.button>
        <Link href="/settings">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <FontAwesomeIcon icon={faGear} className="text-sm text-foreground" />
          </motion.div>
        </Link>
        <div
          className="h-10 w-10 overflow-hidden rounded-full"
          style={{
            background: "linear-gradient(135deg, var(--neon-1), var(--neon-2))",
            padding: "2px",
          }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
            <span className="text-sm font-bold text-neon-purple">
              {(user?.profile.firstName[0] || "K").toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPeriodSelector = () => (
    <div className="flex flex-wrap gap-2" data-tour="period-selector">
      {periodKeys.map((id, index) => {
        const isActive = period === id
        return (
          <motion.button
            key={id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPeriod(id)}
            className="relative rounded-full px-4 py-1.5 text-xs font-medium"
          >
            {isActive && (
              <motion.div
                layoutId="period-pill"
                className="absolute inset-0 rounded-full border border-glass-border bg-glass-bg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
                isActive ? "font-bold text-foreground" : "text-muted-foreground"
              }`}
            >
              {translatedPeriods[index] || id}
            </span>
          </motion.button>
        )
      })}
    </div>
  )

  const renderBalanceCard = (className = "") => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-glass-border bg-glass-bg p-5 backdrop-blur-3xl ${className}`}
      data-tour="balance-chart"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3" data-tour="balance-tabs">
        <div className="flex gap-4">
          {tabKeys.map((tab, index) => {
            const isActive = balanceTab === tab
            return (
              <button
                key={tab}
                onClick={() => setBalanceTab(tab)}
                className={`text-[11px] font-bold tracking-widest transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {translatedTabs[index] || tab}
              </button>
            )
          })}
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
          {t("dashboard.label" as any).toUpperCase()}
        </span>
      </div>

      <PrivacyValue>
        <motion.p
          key={`${balanceTab}-${period}-${isLoadingSummary}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-4xl font-bold italic text-foreground lg:text-5xl"
          style={{
            textShadow: "0 0 30px rgba(var(--neon-1-rgb),0.3)",
          }}
        >
          {isLoadingSummary ? "---" : formatCurrency(displayValue)}
        </motion.p>
      </PrivacyValue>

      <div className="mt-2 h-7">
        {!isLoadingSummary && summary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{
                backgroundColor: deltaUp
                  ? "rgba(var(--neon-4-rgb),0.1)"
                  : "rgba(var(--neon-3-rgb),0.1)",
              }}
            >
              <FontAwesomeIcon
                icon={deltaUp ? faArrowTrendUp : faArrowTrendDown}
                className="text-[10px]"
                style={{
                  color: deltaUp ? "var(--neon-4)" : "var(--neon-3)",
                }}
              />
              <span
                className="text-xs font-bold"
                style={{
                  color: deltaUp ? "var(--neon-4)" : "var(--neon-3)",
                }}
              >
                {deltaUp ? "+" : ""}
                {summary.delta}% {summary.deltaLabel}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {summary?.vaults_balance != null && summary.vaults_balance > 0 && (
        <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          {t("wallet.vault.title" as any)}:{" "}
          <PrivacyValue className="font-mono font-semibold text-foreground">
            {formatCurrency(summary.vaults_balance)}
          </PrivacyValue>
        </p>
      )}

      <div className="mt-4">
        <DashboardChart
          data={currentChart.data}
          color={currentChart.color}
          gradientId={currentChart.id}
          isLoading={isLoadingSummary}
        />
      </div>
    </motion.div>
  )

  const renderRecentTable = () => (
    <div className="rounded-2xl border border-glass-border bg-glass-bg p-4" data-tour="recent-transactions">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-base font-bold italic tracking-wider text-foreground">
          {t("dashboard.recentActivity" as any)}
        </h2>
        <Link
          href="/transactions/history"
          className="text-xs font-bold text-neon-cyan"
          style={{
            textShadow: "0 0 8px rgba(var(--neon-2-rgb),0.4)",
          }}
        >
          {t("common.all" as any)}
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-widest text-muted-foreground">
              <th className="pb-2 pr-4 font-medium">{t("dashboard.table.movement" as any)}</th>
              <th className="pb-2 pr-4 font-medium">{t("dashboard.table.account" as any)}</th>
              <th className="pb-2 pr-4 font-medium">{t("dashboard.table.category" as any)}</th>
              <th className="pb-2 pr-4 font-medium">{t("dashboard.table.date" as any)}</th>
              <th className="pb-2 text-right font-medium">{t("dashboard.table.amount" as any)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border/60">
            {isLoadingRecent && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-xs text-muted-foreground">
                  {t("dashboard.loadingRecent" as any)}
                </td>
              </tr>
            )}
            {!isLoadingRecent &&
              recent.map((tx) => {
                const isIncome = tx.type === "income"
                const date = new Date(tx.date)
                const formattedDate = date.toLocaleString(undefined, {
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                return (
                  <tr key={tx.id} className="align-middle">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: tx.categories?.color
                              ? hexToRgba(tx.categories.color, 0.15)
                              : "#000000"
                          }}
                        >
                          <CategoryIcon
                            name={tx.categories?.icon}
                            color={tx.categories?.color}
                            size={18}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {tx.note || tx.categories?.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {t(`transactions.types.${tx.type}` as any).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 truncate text-xs text-muted-foreground">
                      {tx.accounts?.name}
                    </td>
                    <td className="py-3 pr-4 truncate text-xs text-muted-foreground">
                      {tx.categories?.name}
                    </td>
                    <td className="py-3 pr-4 truncate text-xs text-muted-foreground">
                      {formattedDate}
                    </td>
                    <td className="py-3 truncate text-right">
                      <PrivacyValue
                        className={`font-mono text-sm font-bold ${
                          isIncome ? "text-neon-green" : "text-foreground"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(Math.abs(tx.amount))}
                      </PrivacyValue>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderInfoRowMobile = () => {
    const circumference = 2 * Math.PI * 45
    const strokeOffset = circumference * (1 - Math.min(budgetUsedPct / 100, 1))

    return (
      <div className="grid grid-cols-2 gap-3" data-tour="budget-widgets">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(25px)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <FontAwesomeIcon
            icon={faBolt}
            className="mb-3 text-xs text-muted-foreground"
            style={{
              filter: "drop-shadow(0 0 4px rgba(var(--neon-4-rgb),0.5))",
            }}
          />
          <div className="flex items-center justify-center">
            <div className="relative flex h-30 w-30 items-center justify-center">
              <svg
                className="absolute inset-0 h-full w-full -rotate-90"
                viewBox="0 0 100 100"
                style={{ overflow: "visible" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--neon-4)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  style={{
                    filter: "drop-shadow(0 0 8px var(--neon-4))",
                    transition: "stroke-dashoffset 0.5s ease",
                  }}
                />
              </svg>
              <div className="flex flex-col items-center">
                {isLoadingEnvelopes ? (
                  <span className="font-mono text-lg font-bold text-muted-foreground">---</span>
                ) : (
                  <PrivacyValue
                    className="font-mono text-lg font-bold text-neon-green"
                    style={{
                      textShadow: "0 0 10px rgba(var(--neon-4-rgb),0.4)",
                    }}
                  >
                    {formatCurrency(Math.max(0, budgetRemaining))}
                  </PrivacyValue>
                )}
                <span className="text-[8px] uppercase tracking-wider text-muted-foreground">
                  {t("dashboard.leftToday" as any)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(var(--neon-3-rgb),0.15)",
          }}
        >
          <div className="flex items-center justify-between">
            <FontAwesomeIcon
              icon={faClock}
              className="text-xs text-muted-foreground"
            />
            {nearestSubscription && daysUntilNextBill !== null && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: "rgba(var(--neon-3-rgb),0.15)",
                  color: "var(--neon-3)",
                }}
              >
                {daysUntilNextBill} {t("time.units.day" as any)}
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              {t("dashboard.nextSubscription" as any)}
            </p>
            {isLoadingNearestSubscription ? (
              <span className="mt-1 font-mono text-xl font-bold text-muted-foreground">---</span>
            ) : nearestSubscription ? (
              <>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                  {nearestSubscription.name}
                </p>
                <PrivacyValue className="mt-1 font-mono text-xl font-bold text-foreground">
                  {formatCurrency(nearestSubscription.amount, nearestSubscription.currency)}
                </PrivacyValue>
              </>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                —
              </p>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  const renderAIWidget = () => (
    <Link href="/ai-coach">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 rounded-2xl p-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(var(--neon-1-rgb),0.1), rgba(var(--neon-2-rgb),0.05))",
          border: "1px solid rgba(var(--neon-1-rgb),0.2)",
        }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "rgba(var(--neon-1-rgb),0.15)" }}
        >
          <FontAwesomeIcon
            icon={faRobot}
            className="text-sm"
            style={{
              color: "var(--neon-1)",
              filter: "drop-shadow(0 0 6px rgba(var(--neon-1-rgb),0.6))",
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">
            {t("aiCoach.inviteTitle" as any)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {t("aiCoach.inviteSubtitle" as any)}
          </p>
        </div>
        <FontAwesomeIcon
          icon={faChevronRight}
          className="text-xs text-muted-foreground"
        />
      </motion.div>
    </Link>
  )

  return (
    <>
      <LanguageModal
        open={showLanguageModal}
        onConfirm={() => ctx?.setLanguageModalConfirmed(true)}
        onSkip={skipOnboarding}
      />
      {/* Mobile layout */}
      <div className="flex flex-col gap-4 px-4 pt-6 pb-4 lg:hidden">
        {renderHeader()}
        {renderPeriodSelector()}
        {renderBalanceCard()}
        {renderInfoRowMobile()}
        {renderAIWidget()}
        <div className="space-y-4">
          <h2 className="font-serif text-sm font-bold tracking-wider text-foreground">
            {t("goals.savings" as any)}
          </h2>
          <SavingsContainer />
        </div>
        {renderRecentTable()}
      </div>

      {/* Desktop layout - grid for better use of space */}
      <div className="hidden h-full lg:block pt-2">
        <div className="flex h-full flex-col gap-6 mt-2">
          {renderHeader()}
          <div className="flex flex-wrap gap-2">{renderPeriodSelector()}</div>
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 space-y-6">
              {renderBalanceCard("lg:p-6")}
            </div>
            <div className="space-y-6">{renderInfoRowMobile()} {renderAIWidget()}</div>
          </div>
          <div className="space-y-4">
            <h2 className="font-serif text-sm font-bold tracking-wider text-foreground">
              {t("goals.savings" as any)}
            </h2>
            <SavingsContainer />
          </div>
          <div className="space-y-6">{renderRecentTable()}</div>
        </div>
      </div>
    </>
  )
}
