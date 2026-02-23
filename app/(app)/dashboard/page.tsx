"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEye,
  faEyeSlash,
  faArrowTrendUp,
  faArrowTrendDown,
  faBolt,
  faClock,
  faCreditCard,
  faReceipt,
  faArrowDown,
  faFire,
  faChevronRight,
  faGear,
} from "@fortawesome/free-solid-svg-icons"
import { usePrivacy } from "@/components/providers"
import { useSettings } from "@/components/settings-provider"
import { PrivacyValue } from "@/components/privacy-value"
import { DashboardChart } from "@/components/dashboard-chart"
import { useState, useMemo } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import { useI18n } from "@/hooks/use-translations"
import { useDashboard } from "@/hooks/useDashboard"

type TimePeriod = "Day" | "Week" | "Month" | "Year"
type BalanceTab = "BALANCE" | "INCOME" | "EXPENSE"

// Mock temporal para transacciones (hasta que conectemos el endpoint de transacciones)
const recentTransactions = [
  { id: 1, name: "Apple Store", amount: -299.99, category: "Shopping", icon: faCreditCard, colorVar: "--neon-3" },
  { id: 2, name: "Salary Deposit", amount: 5400.0, category: "Income", icon: faArrowDown, colorVar: "--neon-4" },
  { id: 3, name: "Netflix", amount: -15.99, category: "Subscription", icon: faReceipt, colorVar: "--neon-2" },
]

export default function DashboardPage() {
  const { t } = useI18n()
  const { privacyMode, togglePrivacy } = usePrivacy()
  const { formatCurrency } = useSettings()
  const [period, setPeriod] = useState<TimePeriod>("Day")
  const [balanceTab, setBalanceTab] = useState<BalanceTab>("BALANCE")
  
  // 1. Hook de datos reales (tu implementación)
  const { data, loading, error } = useDashboard(period);
  const user = useAuthStore((state) => state.user);

  // 2. Lógica para determinar el monto a mostrar (Evita el 0 si data existe)
  const displayValue = useMemo(() => {
    if (!data) return 0;
    switch (balanceTab) {
      case "BALANCE": return data.balance; // Aquí se verán los 2000
      case "INCOME": return data.income;
      case "EXPENSE": return data.expense;
      default: return 0;
    }
  }, [balanceTab, data]);

  const getGreetingKey = () => {
    const h = new Date().getHours()
    if (h < 6) return 'greetings.night'
    if (h < 12) return 'greetings.morning'
    if (h < 18) return 'greetings.afternoon'
    return 'greetings.evening'
  }

  const tabKeys: BalanceTab[] = ["BALANCE", "INCOME", "EXPENSE"];
  const periodKeys: TimePeriod[] = ["Day", "Week", "Month", "Year"];
  const tabConfig = {
    BALANCE: { color: "var(--neon-1)", data: data?.chartBalance || [], id: "grad-balance" },
    INCOME:  { color: "#10b981", data: data?.chartIncome || [], id: "grad-income" },
    EXPENSE: { color: "#ef4444", data: data?.chartExpense || [], id: "grad-expense" }
  };
  const currentChart = tabConfig[balanceTab as keyof typeof tabConfig] || tabConfig.BALANCE;

  const translatedTabs = t('balance' as any) as unknown as string[];
  const translatedPeriods = t('periods' as any) as unknown as string[];

  // 3. Lógica de tendencia con protección
  const deltaUp = data ? data.delta >= 0 : true;

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest text-neon-green" style={{ textShadow: `0 0 8px rgba(var(--neon-4-rgb),0.4)` }}>
            {t(getGreetingKey() as any)}
          </p>
          <h1 className="mt-0.5 text-2xl font-bold text-foreground leading-tight">
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
            style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            aria-label={privacyMode ? "Show values" : "Hide values"}
          >
            <FontAwesomeIcon
              icon={privacyMode ? faEyeSlash : faEye}
              className="text-sm text-foreground"
            />
          </motion.button>
          {/* Settings gear */}
          <Link href="/settings">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              <FontAwesomeIcon icon={faGear} className="text-sm text-foreground" />
            </motion.div>
          </Link>
          {/* Avatar */}
          <div
            className="h-10 w-10 overflow-hidden rounded-full"
            style={{
              background: "linear-gradient(135deg, var(--neon-1), var(--neon-2))",
              padding: "2px",
            }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
              <span className=" text-sm font-bold text-neon-purple">
                {(user?.profile.firstName[0] || "K").toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Time Period Filter Pills */}
      <div className="flex gap-2">
        {periodKeys.map((id, index) => {
          const isActive = period === id;
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
                  className="absolute inset-0 rounded-full bg-glass-bg border border-glass-border"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                {translatedPeriods[index] || id}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Balance Card Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-glass-bg backdrop-blur-3xl border border-glass-border"
      >
        {/* Tabs de Balance */}
        <div className="mb-3 flex gap-4">
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

        {/* Big Amount - Animado y con loading state */}
        <PrivacyValue>
          <motion.p
            key={`${balanceTab}-${period}-${loading}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-4xl font-bold italic text-foreground"
            style={{ textShadow: "0 0 30px rgba(var(--neon-1-rgb),0.3)" }}
          >
            {loading ? "---" : formatCurrency(displayValue)}
          </motion.p>
        </PrivacyValue>

        {/* Smart Delta (Solo si hay data) */}
        <div className="h-7 mt-2">
          {!loading && data && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ backgroundColor: deltaUp ? "rgba(var(--neon-4-rgb),0.1)" : "rgba(var(--neon-3-rgb),0.1)" }}
              >
                <FontAwesomeIcon
                  icon={deltaUp ? faArrowTrendUp : faArrowTrendDown}
                  className="text-[10px]"
                  style={{ color: deltaUp ? "var(--neon-4)" : "var(--neon-3)" }}
                />
                <span className="text-xs font-bold" style={{ color: deltaUp ? "var(--neon-4)" : "var(--neon-3)" }}>
                  {deltaUp ? "+" : ""}{data.delta}% {data.deltaLabel}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Chart Conectada a la API */}
        <div className="mt-4">
          <DashboardChart 
            data={currentChart.data} 
            color={currentChart.color}
            gradientId={currentChart.id}
            isLoading={loading}
          />
        </div>
      </motion.div>

      {/* Info Cards Row: Left Today + Next Subscription */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left Today */}
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
            style={{ filter: "drop-shadow(0 0 4px rgba(var(--neon-4-rgb),0.5))" }}
          />
          {/* Circular indicator */}
          <div className="flex items-center justify-center">
            <div className="relative flex h-30 w-30 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
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
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * 0.25}`}
                  style={{ 
                    filter: "drop-shadow(0 0 8px var(--neon-4))",
                    transition: "stroke-dashoffset 0.5s ease" 
                  }}
                />
              </svg>
              <div className="flex flex-col items-center">
                <PrivacyValue className="font-mono text-lg font-bold text-neon-green" style={{ textShadow: "0 0 10px rgba(var(--neon-4-rgb),0.4)" }}>
                  {formatCurrency(120)}
                </PrivacyValue>
                <span className="text-[8px] uppercase tracking-wider text-muted-foreground">{t('dashboard.leftToday' as any)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Subscription */}
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
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: "rgba(var(--neon-3-rgb),0.15)",
                color: "var(--neon-3)",
              }}
            >
              2 {t('time.units.day' as any)}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Netflix Premium</p>
            <PrivacyValue className="mt-1 font-mono text-xl font-bold text-foreground">
              {formatCurrency(15.99)}
            </PrivacyValue>
          </div>
        </motion.div>
      </div>

      {/* Savings Challenge Widget */}
      <Link href="/savings">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(var(--neon-1-rgb),0.1), rgba(var(--neon-2-rgb),0.05))",
            border: "1px solid rgba(var(--neon-1-rgb),0.2)",
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(255,127,0,0.15)" }}
          >
            <FontAwesomeIcon icon={faFire} className="text-sm" style={{ color: "#FF8C00", filter: "drop-shadow(0 0 6px #FF8C00)" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">
              {t('goals.streak.depositToday' as any)}:
              <span className="font-mono text-neon-cyan"> {formatCurrency(50)}</span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              {t('goals.streak.dontBreak' as any, {value: 2, unit: "dias"})}
            </p>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="text-xs text-muted-foreground" />
        </motion.div>
      </Link>

      {/* Recent Activity */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-base font-bold italic tracking-wider text-foreground">
            {t('dashboard.recentActivity' as any)}
          </h2>
          <button className="text-xs font-bold text-neon-cyan" style={{ textShadow: "0 0 8px rgba(var(--neon-2-rgb),0.4)" }}>
            {t("common.all" as any)}
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {recentTransactions.slice(0, 4).map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-center gap-3"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `rgba(var(${tx.colorVar}-rgb),0.08)` }}
              >
                <FontAwesomeIcon
                  icon={tx.icon}
                  className="text-sm"
                  style={{ color: `var(${tx.colorVar})`, filter: `drop-shadow(0 0 6px var(${tx.colorVar}))` }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{tx.name}</p>
                <p className="text-[10px] text-muted-foreground">{tx.category}</p>
              </div>
              <PrivacyValue
                className={`font-mono text-sm font-bold ${
                  tx.amount > 0 ? "text-neon-green" : "text-foreground"
                }`}
              >
                {tx.amount > 0 ? "+" : ""}
                {formatCurrency(Math.abs(tx.amount))}
              </PrivacyValue>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}