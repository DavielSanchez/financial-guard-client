"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCamera,
  faRepeat,
  faCheck,
  faArrowDown,
  faArrowUp,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons"
import { useI18n } from "@/hooks/use-translations"
import { GlassCard } from "@/components/glass-card"
import { useCategories } from "@/hooks/useCategories"
import { CategoryIcon } from "@/components/category-icon"
import { AddCategoryDrawer } from "@/components/ui/add-category-drawer"
import { useTransactions } from "@/hooks/useTransactions"
import { useAccounts } from "@/hooks/useAccounts"
import { useSettings } from "@/components/settings-provider"
import { CurrencyInput } from "@/components/currency-input"

const quickRecurring = [
  { labelKey: "transactions.quickItems.coffee", amount: "5.50" },
  { labelKey: "transactions.quickItems.lunch", amount: "12.00" },
  { labelKey: "transactions.quickItems.gas", amount: "45.00" },
  { labelKey: "transactions.quickItems.gym", amount: "45.00" },
]

export default function TransactionEntryPage() {
  const { t } = useI18n()
  const { currency } = useSettings()
  const { categories, addCategory } = useCategories()
  const { accounts, isLoading: loadingAccounts } = useAccounts()
  const { addTransaction, loading: submitting } = useTransactions()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [txType, setTxType] = useState<"expense" | "income">("expense")
  const [amount, setAmount] = useState(0)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [scanning, setScanning] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-select first account when loaded
  const activeAccount = selectedAccount || accounts[0]?.id || null

  const accentColor = txType === "income" ? "#00FF94" : "#8F00FF"

  const handleSubmit = async () => {
    if (!amount || !selectedCategory || !activeAccount) return
    setSubmitted(true)
    try {
      await addTransaction({
        account_id: activeAccount,
        category_id: selectedCategory,
        amount,
        type: txType,
        currency,
        note: note || undefined,
        date: new Date().toISOString(),
        is_recurring: false,
        receipt_url: null,
      })
      setAmount(0)
      setSelectedCategory(null)
      setNote("")
      setTimeout(() => setSubmitted(false), 1500)
    } catch (error) {
      console.error(error)
      setSubmitted(false)
    }
  }

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setAmount(34.99)
    }, 2000)
  }

  const handleSaveCategory = async (newCategoryData: any) => {
    try {
      await addCategory(newCategoryData)
      setIsDrawerOpen(false)
    } catch (error: any) {
      alert(error.message)
    }
  }


  return (
    <div className="flex flex-col gap-5 px-4 pt-6 lg:px-0">
      {/* Type Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-xl font-bold tracking-wider text-foreground">
          {t('transactions.title' as any).toUpperCase()}
        </h1>
        <div className="glass flex rounded-xl p-1" data-tour="tx-type-toggle">
          {(["expense", "income"] as const).map((type) => {
            const isActive = txType === type
            return (
              <motion.button
                key={type}
                onClick={() => setTxType(type)}
                whileTap={{ scale: 0.95 }}
                className="relative rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider"
              >
                {isActive && (
                  <motion.div
                    layoutId="tx-type-bg"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        type === "income"
                          ? "rgba(0,255,148,0.15)"
                          : "rgba(143,0,255,0.15)",
                      border: `1px solid ${
                        type === "income"
                          ? "rgba(0,255,148,0.3)"
                          : "rgba(143,0,255,0.3)"
                      }`,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-1.5 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={type === "income" ? faArrowDown : faArrowUp}
                    className="text-[10px]"
                  />
                  {t(`transactions.types.${type}` as any)}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Account Selector */}
      {!loadingAccounts && accounts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/5 px-4 py-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {t("wallet.vault.noAccounts" as any)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            {t("wallet.vault.initializeFirst" as any)}
          </p>
        </div>
      )}
      {accounts.length > 0 && (
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {t("transactions.headers.account" as any)}
          </p>
          <div className="flex flex-wrap gap-2">
            {accounts.map((acc) => {
              const isActive = activeAccount === acc.id
              return (
                <motion.button
                  key={acc.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAccount(acc.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive ? "bg-neon-purple/20 border border-neon-purple/40" : "glass"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="text-[10px]"
                    style={{ color: isActive ? "var(--neon-1)" : "var(--muted-foreground)" }}
                  />
                  <span className={isActive ? "text-foreground" : "text-muted-foreground"}>
                    {acc.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground/80">{acc.currency}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}

      {/* Amount Input */}
      <GlassCard
        glowColor={txType === "income" ? "green" : "purple"}
        className="flex flex-col items-center gap-3 py-8"
      >
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {txType === "income" ? t('transactions.headers.amountReceived' as any) : t('transactions.headers.amountSpent' as any)}
        </p>
        <div
          className="flex items-baseline justify-center gap-1"
          style={{
            textShadow: amount
              ? `0 0 20px ${accentColor}60, 0 0 40px ${accentColor}20`
              : "none",
          }}
        >
          <CurrencyInput
            value={amount}
            onChange={setAmount}
            prefix="$"
            placeholder="0.00"
            className="justify-center"
            inputClassName="w-48 text-center font-mono text-5xl font-bold italic placeholder-muted-foreground/30 outline-none"
          />
        </div>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('transactions.headers.addNote' as any)}
          className="bg-transparent text-center text-sm text-muted-foreground outline-none placeholder-muted-foreground/40"
        />
      </GlassCard>

      {/* Category Selector - Horizontal Scroll */}
      <div>
        <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          {t('transactions.headers.category' as any)}
        </p>
        <div ref={scrollRef} className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
            {categories.filter((cat) => cat.type === txType).map((cat) => {
              const isActive = selectedCategory === cat.id
              
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex shrink-0 flex-col items-center gap-2 mt-1"
                >
                  <div className="relative">
                    {/* Anillo Neón dinámico */}
                    {isActive && (
                      <motion.div
                        layoutId="cat-ring"
                        className="absolute -inset-1 rounded-full"
                        style={{
                          background: `conic-gradient(from 0deg, ${cat.color}, ${accentColor}, ${cat.color})`,
                          opacity: 0.8,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      />
                    )}
                    
                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 ${
                        isActive ? "bg-background" : "glass"
                      }`}
                    >
                      {/* Usamos CategoryIcon con los nombres de tu DB (Utensils, Car, etc.)
                        Pasamos el color dinámico y aplicamos el filtro de brillo neón
                      */}
                      <CategoryIcon
                        name={cat.icon}
                        color={isActive ? cat.color : "#888"}
                        size={24}
                        strokeWidth={2.5}
                        className={isActive ? "relative z-10" : "relative z-10 opacity-70"}
                        style={{
                          filter: isActive 
                            ? `drop-shadow(0 0 8px ${cat.color}aa)` 
                            : "none",
                        }}
                      />
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase tracking-tighter transition-colors ${
                      isActive ? "font-bold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {/* Traducción automática: busca 'categories.Salud' en tus JSON */}
                    {cat.name}
                  </span>
                </motion.button>
              )
            })}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsDrawerOpen(true)
              }}
              className="flex shrink-0 flex-col items-center gap-2 mt-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 glass opacity-60 hover:opacity-100 transition-opacity">
                <CategoryIcon 
                  name="Plus" 
                  color="#888" 
                  size={24} 
                  strokeWidth={2.5} 
                />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground/60">
                {t('common.add' as any)}
              </span>
            </motion.button>
          </div>
      </div>

      <AddCategoryDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        txType={txType} // 'income' o 'expense'
        onSave={handleSaveCategory}
      />

      {/* Quick Recurring */}
      <div>
        <p className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <FontAwesomeIcon icon={faRepeat} className="text-neon-cyan glow-cyan" />
          {t('transactions.headers.quickAdd' as any)}
        </p>
        <div className="flex flex-wrap gap-2">
          {quickRecurring.map((item) => (
            <motion.button
              key={item.labelKey}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAmount(parseFloat(item.amount))}
              className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs text-foreground transition-colors hover:bg-white/10"
            >
              <span>{t(item.labelKey as any)}</span>
              <span className="font-mono font-bold text-neon-cyan">
                ${item.amount}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* Scan Receipt */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleScan}
          disabled={scanning}
          className="glass flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm text-foreground"
        >
          <AnimatePresence mode="wait">
            {scanning ? (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0px #00D4FF",
                      "0 0 20px #00D4FF",
                      "0 0 0px #00D4FF",
                    ],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="text-neon-cyan"
                  />
                </motion.div>
                <span className="text-neon-cyan">{t("transactions.actions.scanning" as any)}</span>
              </motion.div>
            ) : (
              <motion.div
                key="scan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon
                  icon={faCamera}
                  className="glow-cyan text-neon-cyan"
                />
                <span>{t("transactions.actions.scanReceipt" as any)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!amount || !selectedCategory || !activeAccount || submitted || submitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-40"
          style={{
            background: accentColor,
            boxShadow: `0 0 20px ${accentColor}40`,
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="done"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>{t("transactions.logged" as any)}</span>
              </motion.div>
            ) : (
              <motion.span key="log" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {txType === "income" ? t("transactions.logIncome" as any) : t("transactions.logExpense" as any)}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="h-4" />
    </div>
  )
}
