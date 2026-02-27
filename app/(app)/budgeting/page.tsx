"use client"

import { useState } from "react"
import { useI18n } from "@/hooks/use-translations"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUtensils,
  faBagShopping,
  faCar,
  faGamepad,
  faHome,
  faHeartPulse,
  faPen,
  faRotate,
  faXmark,
  faTriangleExclamation,
  faCloud,
} from "@fortawesome/free-solid-svg-icons"
import { PrivacyValue } from "@/components/privacy-value"

const budgetCategoriesData = [
  { id: 1, key: "housing", icon: faHome, spent: 1850, budget: 2200, gradient: "linear-gradient(135deg, #8F00FF 0%, #6B00CC 100%)", iconBg: "#FF8C00" },
  { id: 2, key: "cybernetics", icon: faCloud, spent: 420, budget: 600, gradient: "linear-gradient(135deg, #00838f 0%, #00D4FF 100%)", iconBg: "#00D4FF" },
  { id: 3, key: "entertainment", icon: faGamepad, spent: 285, budget: 200, gradient: "linear-gradient(135deg, #FF007F 0%, #CC0066 100%)", iconBg: "#FF007F" },
  { id: 4, key: "transport", icon: faCar, spent: 180, budget: 300, gradient: "linear-gradient(135deg, #00AA6E 0%, #00FF94 100%)", iconBg: "#00FF94" },
  { id: 5, key: "foodDining", icon: faUtensils, spent: 680, budget: 800, gradient: "linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)", iconBg: "#00D4FF" },
  { id: 6, key: "health", icon: faHeartPulse, spent: 95, budget: 250, gradient: "linear-gradient(135deg, #00FF94 0%, #00CC77 100%)", iconBg: "#00FF94" },
]

const subscriptions = [
  { id: 1, name: "Netflix", price: 15.99, color: "#FF007F", nextBill: "Mar 15" },
  { id: 2, name: "Spotify", price: 9.99, color: "#00FF94", nextBill: "Mar 8" },
  { id: 3, name: "iCloud+", price: 2.99, color: "#00D4FF", nextBill: "Mar 22" },
  { id: 4, name: "ChatGPT Plus", price: 20.0, color: "#8F00FF", nextBill: "Mar 10" },
  { id: 5, name: "Gym Membership", price: 45.0, color: "#FF007F", nextBill: "Mar 1" },
]

export default function BudgetingPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<"envelopes" | "drainers">("envelopes")
  const [cancelledSubs, setCancelledSubs] = useState<number[]>([])

  const totalBudget = budgetCategoriesData.reduce((s, c) => s + c.budget, 0)
  const totalSpent = budgetCategoriesData.reduce((s, c) => s + c.spent, 0)
  const totalPercentage = totalSpent / totalBudget

  const activeSubs = subscriptions.filter((s) => !cancelledSubs.includes(s.id))
  const totalSubCost = activeSubs.reduce((s, sub) => s + sub.price, 0)

  const circumference = 2 * Math.PI * 70
  const strokeOffset = circumference * (1 - totalPercentage)

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-bold tracking-wider text-foreground">{t("budgeting.budget" as any).toUpperCase()}</span>
            <span className="font-serif text-xl font-bold tracking-wider text-neon-cyan" style={{ textShadow: "0 0 10px rgba(0,212,255,0.4)" }}>{t("budgeting.control" as any).toUpperCase()}</span>
          </h1>
          <p className="mt-0.5 font-mono text-[10px] tracking-[0.3em] text-neon-green">
            {t("budgeting.protocolActive" as any).toUpperCase()}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <FontAwesomeIcon icon={faPen} className="text-sm text-foreground" />
        </motion.button>
      </div>

      {/* Tab Toggle: Liquid Envelopes / Drainers */}
      <div
        className="flex rounded-full p-1"
        style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
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
              className="relative flex-1 rounded-full py-2.5 text-center text-[11px] font-bold tracking-wider transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="budget-tab"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: tab.key === "envelopes" ? "linear-gradient(135deg, #8F00FF, #6B00CC)" : "linear-gradient(135deg, #FF007F, #CC0066)",
                    boxShadow: tab.key === "envelopes" ? "0 0 15px rgba(143,0,255,0.3)" : "0 0 15px rgba(255,0,127,0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? "text-white" : "text-muted-foreground"}`}>
                {t(tab.labelKey as any).toUpperCase()}
              </span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "envelopes" ? (
          <motion.div
            key="envelopes"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-5"
          >
            {/* Circular Progress Ring */}
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="relative flex h-44 w-44 items-center justify-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 160 160" style={{ overflow: 'visible' }}>
                  {/* Background track */}
                  <circle
                    cx="80" cy="80" r="70"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="8"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="80" cy="80" r="70"
                    fill="none"
                    stroke="url(#ring-gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    style={{ filter: "drop-shadow(0 0 8px #8F00FF) drop-shadow(0 0 20px rgba(143,0,255,0.3))" }}
                  />
                  <defs>
                    <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8F00FF" />
                      <stop offset="100%" stopColor="#00D4FF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("budgeting.totalSpent" as any)}</span>
                  <PrivacyValue className="font-mono text-3xl font-bold text-foreground" style={{ textShadow: "0 0 20px rgba(143,0,255,0.3)" }}>
                    ${totalSpent.toLocaleString()}
                  </PrivacyValue>
                  <span className="mt-0.5 font-mono text-xs text-neon-cyan">
                    ${totalBudget.toLocaleString()} {t("budgeting.limit" as any)}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Cards - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-3">
              {budgetCategoriesData.map((cat, i) => {
                const pct = Math.min((cat.spent / cat.budget) * 100, 100)
                const isOver = cat.spent > cat.budget
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="relative overflow-hidden rounded-2xl p-4"
                    style={{
                      background: cat.gradient,
                      minHeight: 140,
                      border: isOver ? "1px solid rgba(255,0,127,0.5)" : "none",
                    }}
                  >
                    {/* Warning badge for over-budget */}
                    {isOver && (
                      <div className="absolute right-3 top-3">
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <FontAwesomeIcon icon={faTriangleExclamation} className="text-sm text-yellow-400" style={{ filter: "drop-shadow(0 0 6px rgba(255,200,0,0.5))" }} />
                        </motion.div>
                      </div>
                    )}

                    {/* Category Icon */}
                    <div
                      className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                    >
                      <FontAwesomeIcon
                        icon={cat.icon}
                        className="text-sm"
                        style={{ color: cat.iconBg }}
                      />
                    </div>

                    {/* Name */}
                    <h3 className="font-serif text-sm font-bold tracking-wider text-white">
                      {t(`budgeting.categories.${cat.key}` as any).toUpperCase()}
                    </h3>

                    {/* Amount + Percentage */}
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <PrivacyValue className="font-mono text-sm font-bold text-white/80">
                        ${cat.spent}
                      </PrivacyValue>
                      <span className="font-mono text-xl font-bold text-white">
                        {pct.toFixed(0)}%
                      </span>
                    </div>

                    {/* Budget limit */}
                    <p className="mt-1 text-right font-mono text-[10px] text-white/50">
                      / ${cat.budget.toLocaleString()}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="drainers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-3"
          >
            {/* Total Drain */}
            <div
              className="flex items-center justify-between rounded-2xl p-4"
              style={{ backgroundColor: "rgba(255,0,127,0.08)", border: "1px solid rgba(255,0,127,0.15)" }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("budgeting.monthlyDrain" as any)}</p>
                <PrivacyValue className="font-mono text-2xl font-bold text-neon-pink" style={{ textShadow: "0 0 10px rgba(255,0,127,0.4)" }}>
                  ${totalSubCost.toFixed(2)}
                </PrivacyValue>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("budgeting.active" as any)}</p>
                <p className="font-mono text-lg font-bold text-foreground">{activeSubs.length}</p>
              </div>
            </div>

            {/* Subscription List */}
            {subscriptions.map((sub, i) => {
              const isCancelled = cancelledSubs.includes(sub.id)
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isCancelled ? 0.4 : 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3 rounded-2xl p-4"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(25px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${sub.color}15` }}
                  >
                    <FontAwesomeIcon icon={faRotate} className="text-sm" style={{ color: sub.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isCancelled ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {sub.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{t("budgeting.next" as any)}: {sub.nextBill}</p>
                  </div>
                  <PrivacyValue className="font-mono text-sm font-bold text-foreground">
                    ${sub.price.toFixed(2)}
                  </PrivacyValue>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setCancelledSubs((prev) =>
                        isCancelled ? prev.filter((id) => id !== sub.id) : [...prev, sub.id]
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: isCancelled ? "rgba(0,255,148,0.1)" : "rgba(255,0,127,0.1)",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={isCancelled ? faRotate : faXmark}
                      className="text-xs"
                      style={{ color: isCancelled ? "#00FF94" : "#FF007F" }}
                    />
                  </motion.button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-4" />
    </div>
  )
}
