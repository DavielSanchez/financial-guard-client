"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faWallet,
  faArrowRightArrowLeft,
  faPlus,
  faLock,
  faEye,
  faEyeSlash,
  faChevronLeft,
  faChevronRight,
  faCreditCard,
  faBuildingColumns,
  faCoins,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons"
import { GlassCard } from "@/components/glass-card"
import { PrivacyValue } from "@/components/privacy-value"
import { useI18n } from "@/hooks/use-translations"

// Datos originales del usuario
const cards = [
  {
    id: 1,
    name: "Main Checking",
    number: "**** 4829",
    balance: 12450.8,
    type: "Visa",
    gradient: "linear-gradient(135deg, var(--neon-1) 0%, var(--neon-2) 100%)",
    icon: faCreditCard,
  },
  {
    id: 2,
    name: "Savings Account",
    number: "**** 7731",
    balance: 8920.0,
    type: "Mastercard",
    gradient: "linear-gradient(135deg, var(--neon-3) 0%, var(--neon-1) 100%)",
    icon: faBuildingColumns,
  },
  {
    id: 3,
    name: "Crypto Wallet",
    number: "**** 0x3F",
    balance: 3192.0,
    type: "Blockchain",
    gradient: "linear-gradient(135deg, var(--neon-4) 0%, var(--neon-2) 100%)",
    icon: faCoins,
  },
]

const vaultAccounts = [
  { id: 1, name: "Emergency Fund", balance: 15000, hidden: true },
  { id: 2, name: "Tax Reserve", balance: 4200, hidden: true },
]

export default function WalletPage() {
  const { t } = useI18n()
  const [currentCard, setCurrentCard] = useState(0)
  const [direction, setDirection] = useState(0)
  const [bridgeMode, setBridgeMode] = useState(false)
  const [bridgeFrom, setBridgeFrom] = useState(0)
  const [bridgeTo, setBridgeTo] = useState(1)
  const [vaultRevealed, setVaultRevealed] = useState<number[]>([])

  // Función para manejar el cambio de tarjeta con límites correctos
  const handleStep = (dir: number) => {
  const nextIndex = currentCard + dir

  if (nextIndex >= 0 && nextIndex <= cards.length) {
    setDirection(dir) 
    setCurrentCard(nextIndex)
  }
}

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 280 : -280,
    opacity: 0,
    scale: 0.96
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -280 : 280,
    opacity: 0,
    scale: 0.96
  })
}

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-bold tracking-wider text-foreground">
            {t('wallet.title' as any).toUpperCase()}
          </h1>
          <p className="text-xs text-muted-foreground">{t('wallet.subtitle' as any)}</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setBridgeMode(!bridgeMode)}
            className={`glass flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              bridgeMode ? "text-neon-cyan" : "text-muted-foreground"
            }`}
          >
            <FontAwesomeIcon
              icon={faArrowRightArrowLeft}
              className={bridgeMode ? "glow-cyan" : ""}
            />
            <span>{bridgeMode ? t("wallet.actions.accounts" as any) : t("wallet.actions.bridge" as any)}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="glass flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold text-muted-foreground"
          >
            <FontAwesomeIcon icon={faPlus} />
          </motion.button>
        </div>
      </div>

      {/* Card Carousel Area */}
      <div className="relative min-h-[220px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {!bridgeMode ? (
            <motion.div
              key="carousel-container"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full flex flex-col"
            >
              {cards.length === 0 ? (
                /* Empty State */
                <motion.div 
                  className="flex h-[220px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted/20 bg-muted/5 p-8 text-center"
                  onClick={() => {/* Lógica crear primera */}}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neon-purple/10 text-neon-purple shadow-[0_0_20px_rgba(143,0,255,0.2)]">
                    <FontAwesomeIcon icon={faPlus} className="text-xl" />
                  </div>
                  <p className="text-sm font-bold text-foreground">{t("wallet.vault.noAccounts" as any)}</p>
                  <p className="text-[10px] text-muted-foreground">{t("wallet.vault.initializeFirst" as any)}</p>
                </motion.div>
              ) : (
                <>
                  <div className="relative overflow-visible touch-none">
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
                          scale: { duration: 0.02 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.55}
                        onDragEnd={(_, info) => {
                          const velocity = info.velocity.x
                          const offset = info.offset.x

                          if (offset < -80 || velocity < -600) handleStep(1)
                          else if (offset > 80 || velocity > 600) handleStep(-1)
                        }}
                        className="relative h-[220px] w-full cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl p-6 shadow-2xl"
                        style={{
                          background: currentCard === cards.length 
                            ? "linear-gradient(135deg, rgba(var(--background-rgb), 0.8) 0%, #000 100%)" 
                            : cards[currentCard].gradient,
                          border: currentCard === cards.length 
                            ? "2px dashed hsl(var(--primary))"
                            : "1px solid rgba(255,255,255,0.1)"
                        }}
                      >
                        {currentCard === cards.length ? (
                          /* Tarjeta de "Crear Nueva" */
                          <div className="flex h-full flex-col items-center justify-center text-center border-primary">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-primary/10"
                            >
                              <FontAwesomeIcon icon={faPlus} className="text-2xl text-primary shadow-neon" />
                            </motion.div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">{t("wallet.actions.addAccount" as any)}</p>
                            <p className="mt-1 text-[9px] text-foreground/40 uppercase">{t("wallet.vault.initializeProtocol" as any)}</p>
                          </div>
                        ) : (
                          /* Tarjetas de cuenta normales */
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{cards[currentCard].type}</p>
                                <p className="text-lg font-bold text-white tracking-tighter">{cards[currentCard].name}</p>
                              </div>
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                                <FontAwesomeIcon icon={cards[currentCard].icon} className="text-white" />
                              </div>
                            </div>
                            <div className="mt-4">
                              <p className="font-mono text-lg tracking-[0.25em] text-white/80">{cards[currentCard].number}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t("wallet.liquidAssets" as any)}</p>
                              <PrivacyValue className="font-mono text-3xl font-black italic text-white tracking-tighter leading-none">
                                ${cards[currentCard].balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                              </PrivacyValue>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Dots dinámicos */}
                  <div className="mt-6 flex justify-center gap-2">
                    {Array.from({ length: cards.length + 1 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={false}
                        animate={{
                          width: i === currentCard ? 24 : 8,
                          backgroundColor: i === currentCard ? "var(--neon-purple, #8F00FF)" : "rgba(128,128,128,0.2)"
                        }}
                        className="h-2 rounded-full cursor-pointer"
                        onClick={() => setCurrentCard(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            /* Bridge UI (Tu código original integrado) */
            <motion.div
              key="bridge-mode"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <GlassCard className="flex-1 p-3" glowColor="purple">
                  <p className="text-[10px] uppercase text-muted-foreground">{t("wallet.bridge.from" as any)}</p>
                  <select
                    value={bridgeFrom}
                    onChange={(e) => setBridgeFrom(Number(e.target.value))}
                    className="mt-1 w-full bg-transparent text-sm font-bold text-foreground outline-none"
                  >
                    {cards.map((c, i) => (
                      <option key={c.id} value={i} className="bg-background text-foreground">{c.name}</option>
                    ))}
                  </select>
                </GlassCard>
                <FontAwesomeIcon icon={faArrowRightArrowLeft} className="text-neon-cyan animate-pulse" />
                <GlassCard className="flex-1 p-3" glowColor="cyan">
                  <p className="text-[10px] uppercase text-muted-foreground">To</p>
                  <select
                    value={bridgeTo}
                    onChange={(e) => setBridgeTo(Number(e.target.value))}
                    className="mt-1 w-full bg-transparent text-sm font-bold text-foreground outline-none"
                  >
                    {cards.map((c, i) => (
                      <option key={c.id} value={i} className="bg-background text-foreground">{c.name}</option>
                    ))}
                  </select>
                </GlassCard>
              </div>
              <GlassCard className="flex flex-col items-center py-4" glowColor="cyan">
                <p className="text-[10px] uppercase text-muted-foreground tracking-[0.2em]">{t("wallet.bridge.amount" as any)}</p>
                <input type="text" placeholder="0.00" className="w-full bg-transparent text-center font-mono text-3xl font-black text-foreground outline-none" />
              </GlassCard>
              <motion.button whileTap={{ scale: 0.98 }} className="w-full rounded-xl bg-neon-cyan py-4 text-xs font-black uppercase text-background">
                Execute Bridge
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vault Section (Tu código original) */}
      <div className="mt-2">
        <div className="mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faLock} className="text-neon-pink text-[10px]" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t("wallet.vault.title" as any)}</p>
        </div>
        <div className="flex flex-col gap-2">
          {vaultAccounts.map((acc) => {
            const isRevealed = vaultRevealed.includes(acc.id)
            return (
              <GlassCard key={acc.id} className="flex items-center justify-between p-4" glowColor="pink">
                <div>
                  <p className="text-sm font-bold">{acc.name}</p>
                  <PrivacyValue className={`font-mono text-lg font-bold ${!isRevealed ? "privacy-blur" : ""}`}>
                    ${acc.balance.toLocaleString()}.00
                  </PrivacyValue>
                </div>
                <button 
                  onClick={() => setVaultRevealed(prev => isRevealed ? prev.filter(id => id !== acc.id) : [...prev, acc.id])}
                  className="h-9 w-9 rounded-xl bg-neon-pink/10 text-neon-pink"
                >
                  <FontAwesomeIcon icon={isRevealed ? faEyeSlash : faEye} />
                </button>
              </GlassCard>
            )
          })}
        </div>
      </div>

      {/* Savings Goals Link */}
      <Link href="/savings">
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 rounded-2xl p-4 bg-muted/5 border border-white/5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon-purple/10">
            <FontAwesomeIcon icon={faShieldHalved} className="text-neon-purple shadow-neon" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">{t("wallet.link.savingsVault" as any)}</p>
            <p className="text-[10px] text-muted-foreground">{t("wallet.link.activeTargets" as any, { count: 4 })}</p>
          </div>
          <FontAwesomeIcon icon={faChevronRight} className="text-xs text-muted-foreground" />
        </motion.div>
      </Link>
      
      <div className="h-20" /> {/* Spacer for scroll */}
    </div>
  )
}