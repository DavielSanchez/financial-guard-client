"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRightArrowLeft,
  faPlus,
  faLock,
  faEye,
  faEyeSlash,
  faCreditCard,
  faBuildingColumns,
  faCoins,
  faWallet,
  faShieldHalved,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { GlassCard } from "@/components/glass-card"
import { PrivacyValue } from "@/components/privacy-value"
import { AddAccountPanel } from "@/components/add-account-panel"
import { useI18n } from "@/hooks/use-translations"
import { useAccounts } from "@/hooks/useAccounts"
import { useGoals } from "@/hooks/useGoals"
import { useSettings } from "@/components/settings-provider"
import type { Account } from "@/types/accounts.types"

const TYPE_ICONS: Record<string, typeof faCreditCard> = {
  bank: faBuildingColumns,
  checking: faCreditCard,
  savings: faBuildingColumns,
  credit_card: faCreditCard,
  cash: faWallet,
  investment: faCoins,
}

function getAccountIcon(type: string) {
  return TYPE_ICONS[type?.toLowerCase()] ?? faCreditCard
}

function accountToCard(acc: Account) {
  const color = acc.color || "#8F00FF"
  const hex = color.replace("#", "")
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const darker = `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`
  return {
    ...acc,
    number: "•••• " + (acc.id?.slice(-4) ?? "----"),
    gradient: `linear-gradient(135deg, ${color} 0%, ${darker} 100%)`,
    icon: getAccountIcon(acc.type),
  }
}

export default function WalletPage() {
  const { t } = useI18n()
  const { formatCurrency } = useSettings()
  const { accounts: rawAccounts, isLoading: loadingAccounts, createAccount, isCreating } = useAccounts()
  const { goals } = useGoals()
  const [addPanelOpen, setAddPanelOpen] = useState(false)

  const cards = useMemo(() => rawAccounts.filter((a) => !a.is_hidden).map(accountToCard), [rawAccounts])
  const totalBalance = useMemo(() => cards.reduce((s, c) => s + c.balance, 0), [cards])
  const vaultAccounts = useMemo(
    () =>
      goals
        .filter((g) => g.piggy_type === "open" || g.target_amount > 0)
        .map((g) => ({
          id: g.id,
          name: g.name,
          balance: g.saved_already ?? g.saved_amount ?? 0,
          hidden: true,
        })),
    [goals]
  )

  const [currentCard, setCurrentCard] = useState(0)
  const [direction, setDirection] = useState(0)
  const [bridgeMode, setBridgeMode] = useState(false)
  const [bridgeFrom, setBridgeFrom] = useState(0)
  const [bridgeTo, setBridgeTo] = useState(1)
  const [vaultRevealed, setVaultRevealed] = useState<string[]>([])

  useEffect(() => {
    if (cards.length > 0 && bridgeFrom >= cards.length) setBridgeFrom(0)
    if (cards.length > 0 && bridgeTo >= cards.length) setBridgeTo(Math.min(1, cards.length - 1))
  }, [cards.length, bridgeFrom, bridgeTo])

  const handleStep = (dir: number) => {
    const nextIndex = currentCard + dir
    if (nextIndex >= 0 && nextIndex <= cards.length) {
      setDirection(dir)
      setCurrentCard(nextIndex)
    }
  }

  const openAddAccount = () => setAddPanelOpen(true)
  const toggleAddPanel = () => setAddPanelOpen((p) => !p)

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 280 : -280,
      opacity: 0,
      scale: 0.96,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -280 : 280,
      opacity: 0,
      scale: 0.96,
    }),
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header compacto */}
      <header className="border-b border-white/5 px-4 py-4 lg:px-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
              {t("wallet.title" as any)}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">{t("wallet.subtitle" as any)}</p>
          </div>
          <div className="flex gap-2">
            {cards.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setBridgeMode(!bridgeMode)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  bridgeMode
                    ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
              >
                <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                <span className="hidden sm:inline">
                  {bridgeMode ? t("wallet.actions.accounts" as any) : t("wallet.actions.bridge" as any)}
                </span>
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleAddPanel}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground shadow-[0_0_20px_var(--primary)]/30 transition-shadow hover:shadow-[0_0_24px_var(--primary)]/40 ${
                addPanelOpen ? "bg-primary/80" : "bg-primary"
              }`}
            >
              <FontAwesomeIcon icon={faPlus} className={`text-lg transition-transform ${addPanelOpen ? "rotate-45" : ""}`} />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-4 pb-24 pt-6 lg:px-0">
        {/* Panel Crear Cuenta (despliega desde abajo como goals) */}
        <AddAccountPanel
          open={addPanelOpen}
          onOpenChange={setAddPanelOpen}
          onSave={async (p) => { await createAccount(p) }}
          isPending={isCreating}
        />

        {/* Balance total (solo si hay cuentas) */}
        {cards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] p-5 ring-1 ring-white/5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t("wallet.liquidAssets" as any)}
            </p>
            <PrivacyValue className="mt-1 font-mono text-3xl font-black tracking-tight text-foreground">
              {formatCurrency(totalBalance)}
            </PrivacyValue>
          </motion.div>
        )}

        {/* Carrusel de tarjetas */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("wallet.title" as any)} · {cards.length + 1} {cards.length === 0 ? "tarjeta" : "tarjetas"}
          </h2>
          <div className="relative min-h-[240px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {!bridgeMode ? (
                <motion.div
                  key="carousel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col"
                >
                  {loadingAccounts ? (
                    <div className="flex h-[240px] items-center justify-center rounded-3xl bg-white/[0.02] ring-1 ring-white/5">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  ) : cards.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={openAddAccount}
                      className="flex h-[240px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/10"
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 ring-1 ring-primary/30">
                        <FontAwesomeIcon icon={faPlus} className="text-2xl text-primary" />
                      </div>
                      <p className="font-semibold text-foreground">{t("wallet.vault.noAccounts" as any)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{t("wallet.vault.initializeFirst" as any)}</p>
                      <p className="mt-3 text-[10px] font-medium uppercase tracking-wider text-primary">
                        {t("wallet.actions.addAccount" as any)}
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="overflow-visible touch-none">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                          <motion.div
                            key={currentCard}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                              x: { type: "spring", stiffness: 350, damping: 28 },
                              opacity: { duration: 0.05 },
                              scale: { duration: 0.02 },
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.55}
                            onDragEnd={(_, info) => {
                              const { velocity, offset } = info
                              if (offset.x < -80 || velocity.x < -600) handleStep(1)
                              else if (offset.x > 80 || velocity.x > 600) handleStep(-1)
                            }}
                            onClick={currentCard === cards.length ? openAddAccount : undefined}
                            className={`relative h-[240px] w-full overflow-hidden rounded-3xl p-6 shadow-xl ${
                              currentCard === cards.length ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
                            }`}
                            style={{
                              background:
                                currentCard === cards.length
                                  ? "linear-gradient(135deg, rgba(var(--neon-1-rgb),0.08) 0%, transparent 100%)"
                                  : cards[currentCard].gradient,
                              border:
                                currentCard === cards.length
                                  ? "2px dashed rgba(var(--neon-1-rgb),0.4)"
                                  : "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            {currentCard === cards.length ? (
                              <div className="flex h-full flex-col items-center justify-center text-center">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 ring-1 ring-primary/30"
                                >
                                  <FontAwesomeIcon icon={faPlus} className="text-2xl text-primary" />
                                </motion.div>
                                <p className="text-sm font-bold uppercase tracking-wider text-primary">
                                  {t("wallet.actions.addAccount" as any)}
                                </p>
                                <p className="mt-1 text-[10px] text-muted-foreground">
                                  {t("wallet.vault.initializeProtocol" as any)}
                                </p>
                              </div>
                            ) : (
                              <div className="flex h-full flex-col justify-between">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                                      {cards[currentCard].type.replace("_", " ")}
                                    </p>
                                    <p className="text-lg font-bold text-white tracking-tight">
                                      {cards[currentCard].name}
                                    </p>
                                  </div>
                                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
                                    <FontAwesomeIcon icon={cards[currentCard].icon} className="text-white" />
                                  </div>
                                </div>
                                <div>
                                  <p className="font-mono text-base tracking-[0.2em] text-white/70">
                                    {cards[currentCard].number}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                                    {t("wallet.liquidAssets" as any)}
                                  </p>
                                  <PrivacyValue className="font-mono text-3xl font-black italic text-white tracking-tight">
                                    {formatCurrency(cards[currentCard].balance)}
                                  </PrivacyValue>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <div className="mt-5 flex justify-center gap-2">
                        {Array.from({ length: cards.length + 1 }).map((_, i) => (
                          <motion.button
                            key={i}
                            type="button"
                            initial={false}
                            animate={{
                              width: i === currentCard ? 24 : 8,
                              backgroundColor:
                                i === currentCard ? "hsl(var(--primary))" : "rgba(128,128,128,0.25)",
                            }}
                            className="h-2 rounded-full transition-colors"
                            onClick={() => setCurrentCard(i)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="bridge"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <GlassCard className="flex-1 p-4" glowColor="purple">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("wallet.bridge.from" as any)}
                      </p>
                      <select
                        value={bridgeFrom}
                        onChange={(e) => setBridgeFrom(Number(e.target.value))}
                        className="mt-2 w-full bg-transparent text-sm font-bold text-foreground outline-none"
                      >
                        {cards.map((c, i) => (
                          <option key={c.id} value={i} className="bg-background text-foreground">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </GlassCard>
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} className="text-primary animate-pulse" />
                    <GlassCard className="flex-1 p-4" glowColor="cyan">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("wallet.bridge.to" as any)}
                      </p>
                      <select
                        value={bridgeTo}
                        onChange={(e) => setBridgeTo(Number(e.target.value))}
                        className="mt-2 w-full bg-transparent text-sm font-bold text-foreground outline-none"
                      >
                        {cards.map((c, i) => (
                          <option key={c.id} value={i} className="bg-background text-foreground">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </GlassCard>
                  </div>
                  <GlassCard className="flex flex-col items-center py-5" glowColor="cyan">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("wallet.bridge.amount" as any)}
                    </p>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      className="mt-2 w-full bg-transparent text-center font-mono text-3xl font-black text-foreground outline-none placeholder:text-muted-foreground/50"
                    />
                  </GlassCard>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-primary py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground"
                  >
                    {t("wallet.bridge.execute" as any)}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Vault */}
        {vaultAccounts.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLock} className="text-[10px] text-primary" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t("wallet.vault.title" as any)}
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              {vaultAccounts.map((acc) => {
                const isRevealed = vaultRevealed.includes(acc.id)
                return (
                  <GlassCard key={acc.id} className="flex items-center justify-between p-4" glowColor="pink">
                    <div>
                      <p className="text-sm font-bold text-foreground">{acc.name}</p>
                      <PrivacyValue
                        className={`font-mono text-lg font-bold ${!isRevealed ? "privacy-blur" : ""}`}
                      >
                        {formatCurrency(acc.balance)}
                      </PrivacyValue>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setVaultRevealed((prev) =>
                          isRevealed ? prev.filter((id) => id !== acc.id) : [...prev, acc.id]
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    >
                      <FontAwesomeIcon icon={isRevealed ? faEyeSlash : faEye} />
                    </button>
                  </GlassCard>
                )
              })}
            </div>
          </section>
        )}

        {/* Link Savings */}
        <Link href="/savings" className="block">
          <motion.div
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <FontAwesomeIcon icon={faShieldHalved} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{t("wallet.link.savingsVault" as any)}</p>
              <p className="text-xs text-muted-foreground">
                {t("wallet.link.activeTargets" as any, { count: goals.length })}
              </p>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="shrink-0 text-muted-foreground" />
          </motion.div>
        </Link>
      </main>

    </div>
  )
}
