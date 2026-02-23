"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShieldHalved,
  faEnvelope,
  faLock,
  faUser,
  faArrowRight,
  faIdCard
} from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "@/hooks/use-auth"
import { GlassCard } from "@/components/glass-card"
import { useI18n } from "@/hooks/use-translations"

export default function RegisterPage() {
    const { t } = useI18n()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(formData)
    } catch (error) {
      console.error("Registration failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Background Orbs (Consistentes con Login) */}
      <motion.div
        className="pointer-events-none absolute right-1/4 top-1/4 h-96 w-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, var(--neon-2) 0%, transparent 70%)" }}
        animate={{ x: [0, -30, 50, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <GlassCard glowColor="cyan" className="p-8">
          <div className="mb-8 flex flex-col items-center gap-2">
            <h1 className="text-glow-cyan font-serif text-2xl font-bold tracking-wider text-foreground">
              {t('auth.register.heading' as any).toLocaleUpperCase()}
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest text-center">
              {t('auth.register.subheading' as any)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* First Name */}
            <div className="group relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <FontAwesomeIcon icon={faUser} className="text-xs text-neon-cyan opacity-70" />
              </div>
              <input
                name="firstName"
                placeholder={`${t('auth.register.firstNamePlaceholder' as any)}`}
                onChange={handleChange}
                required
                className="glass w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-1 focus:ring-neon-cyan/50"
              />
            </div>

            {/* Last Name */}
            <div className="group relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <FontAwesomeIcon icon={faIdCard} className="text-xs text-neon-cyan opacity-70" />
              </div>
              <input
                name="lastName"
                placeholder={`${t('auth.register.lastNamePlaceholder' as any)}`}
                onChange={handleChange}
                required
                className="glass w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-1 focus:ring-neon-cyan/50"
              />
            </div>

            {/* Email - Span Full Width */}
            <div className="group relative md:col-span-2">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <FontAwesomeIcon icon={faEnvelope} className="text-xs text-neon-cyan opacity-70" />
              </div>
              <input
                name="email"
                type="email"
                placeholder={`${t('auth.register.emailPlaceholder' as any)}`}
                onChange={handleChange}
                required
                className="glass w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-1 focus:ring-neon-cyan/50"
              />
            </div>

            {/* Password - Span Full Width */}
            <div className="group relative md:col-span-2">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <FontAwesomeIcon icon={faLock} className="text-xs text-neon-pink opacity-70" />
              </div>
              <input
                name="password"
                type="password"
                placeholder={`${t('auth.register.passwordPlaceholder' as any)}`}
                onChange={handleChange}
                required
                className="glass w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-1 focus:ring-neon-pink/50"
              />
            </div>

            {/* Register Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-neon-cyan py-3.5 font-serif text-sm font-bold tracking-widest text-black transition-shadow disabled:opacity-50"
            >
              {loading ? t('auth.register.submitLoading' as any) : (
                <>
                {t('auth.register.submitButton' as any)}
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Already have clearance?{" "}
              <Link href="/login" className="font-bold text-neon-purple hover:underline">
                LOG IN HERE
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}