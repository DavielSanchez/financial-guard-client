"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShieldHalved,
  faEnvelope,
  faLock,
  faArrowRight,
  faFingerprint,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "@/hooks/use-auth"
import { GlassCard } from "@/components/glass-card"
import { useI18n } from "@/hooks/use-translations"

export default function LoginPage() {
  const { t } = useI18n()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [email, setEmail] = useState("davielalexsanchez@gmail.com")
  const [password, setPassword] = useState("123456")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    
    try {
      await login({ email, password }) 
    } catch (error: any) {
      console.error("Error completo:", error)
      const message = error.response?.data?.error || error.response?.data?.message || "Ocurrió un error inesperado"
      
      setErrorMessage(Array.isArray(message) ? message[0] : message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">

      
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard glowColor="purple" className="p-8">
          {/* Logo Section */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-purple/20"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(var(--neon-1-rgb),0.3)",
                  "0 0 40px rgba(var(--neon-1-rgb),0.5)",
                  "0 0 20px rgba(var(--neon-1-rgb),0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FontAwesomeIcon
                icon={faShieldHalved}
                className="glow-purple text-2xl text-neon-purple"
              />
            </motion.div>
            <div className="text-center">
              <h1 className="text-glow-purple font-serif text-2xl font-bold tracking-wider text-foreground">
                {t('auth.capitalTitle' as any)}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('auth.subtitle' as any)}
              </p>
            </div>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 flex items-center gap-3 rounded-xl border border-neon-pink/50 bg-neon-pink/10 p-4"
            >
              <div className="h-2 w-2 animate-pulse rounded-full bg-neon-pink shadow-[0_0_10px_#ff007f]" />
              <span className="text-[10px] font-bold tracking-widest text-neon-pink uppercase">
                {errorMessage === "Invalid login credentials" 
                  ? t('auth.login.errorAccessDenied' as any)
                  : errorMessage}
              </span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Input Email */}
            <div className="group relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <FontAwesomeIcon icon={faEnvelope} className="glow-cyan text-sm text-neon-cyan" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${t('auth.login.emailPlaceholder' as any)}`}
                required
                className="glass w-full rounded-xl py-3.5 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none transition-shadow focus:ring-1 focus:ring-neon-purple/50"
              />
            </div>

            {/* Input Password */}
            <div className="group relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <FontAwesomeIcon icon={faLock} className="glow-pink text-sm text-neon-pink" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`${t('auth.login.passwordPlaceholder' as any)}`}
                required
                className="glass w-full rounded-xl py-3.5 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none transition-shadow focus:ring-1 focus:ring-neon-pink/50"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-neon-purple py-3.5 font-serif text-sm font-bold tracking-widest text-white transition-shadow disabled:opacity-60"
            >
              {loading ? (
                <div className="neon-spinner h-5 w-5 rounded-full border-2 border-transparent border-t-white" />
              ) : (
                <>
                  <span>{t('auth.login.submitButton' as any)}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          {/* Biometric & Links */}
          <div className="mt-6 flex flex-col items-center gap-6">
            <div className="flex w-full items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">{t('auth.login.biometricLabel' as any)}</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass flex items-center gap-3 rounded-xl px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-neon-green"
            >
              <FontAwesomeIcon icon={faFingerprint} className="glow-green text-lg text-neon-green" />
              <span>Biometric Login</span>
            </motion.button>

            {/* ENLACE DE REGISTRO */}
            <p className="text-xs text-muted-foreground">
              {t('auth.login.registerLabel' as any)}{" "}
              <Link 
                href="/register" 
                className="font-bold text-neon-cyan hover:underline transition-all hover:text-cyan-300"
              >
                {t('auth.login.registerLink' as any).toLocaleUpperCase()}
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}