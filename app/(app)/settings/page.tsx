"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faUser,
  faPalette,
  faSun,
  faMoon,
  faGlobe,
  faCoins,
  faRightFromBracket,
  faCheck,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons"
import { useSettings, themeList, type ThemeName, type ModeName, type LanguageCode, type CurrencyCode } from "@/components/settings-provider"
import { useAuth } from "@/hooks/use-auth"
import { setForceStartTour } from "@/hooks/useOnboarding"
// import { useSettings } from "@/components/settings-provider"

const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "DOP", label: "Peso Dominicano", symbol: "RD$" },
  { code: "USD", label: "US Dollar", symbol: "US$" },
  { code: "EUR", label: "Euro", symbol: "\u20AC" },
  { code: "MXN", label: "Peso Mexicano", symbol: "MXN$" },
]

const languages: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Espanol" },
]

export default function SettingsPage() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleRepeatProtocol = () => {
    setForceStartTour()
    router.push("/dashboard")
  }
  const {
    theme,
    mode,
    language,
    currency,
    userName,
    setTheme,
    setMode,
    setLanguage,
    setCurrency,
    setUserName,
    t,
  } = useSettings()

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(userName)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim())
    }
    setEditingName(false)
  }

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
          aria-label="Go back"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-sm text-foreground" />
        </motion.button>
        <h1 className="font-serif text-xl font-bold tracking-wider text-foreground">
          {t("settings.title")}
        </h1>
      </div>

      {/* Profile Section */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-xs" style={{ color: "var(--neon-1)" }} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {t("settings.profile")}
          </h2>
        </div>
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", backdropFilter: "blur(25px)" }}
        >
          <label className="mb-2 block text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("settings.displayName")}
          </label>
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                autoFocus
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground outline-none"
                style={{ backgroundColor: "var(--muted)", border: "1px solid var(--border)" }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSaveName}
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(var(--neon-4-rgb),0.15)" }}
              >
                <FontAwesomeIcon icon={faCheck} className="text-sm" style={{ color: "var(--neon-4)" }} />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setNameInput(userName)
                setEditingName(true)
              }}
              className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-foreground transition-colors"
              style={{ backgroundColor: "var(--muted)" }}
            >
              {userName}
            </motion.button>
          )}
        </div>
      </section>

      {/* Appearance Section */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faPalette} className="text-xs" style={{ color: "var(--neon-2)" }} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {t("settings.appearance")}
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {/* Mode Toggle */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", backdropFilter: "blur(25px)" }}
          >
            <label className="mb-3 block text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("settings.mode")}
            </label>
            <div
              className="flex rounded-full p-1"
              style={{ backgroundColor: "var(--muted)" }}
            >
              {(["dark", "light"] as ModeName[]).map((m) => {
                const isActive = mode === m
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="relative flex-1 rounded-full py-2.5 text-center text-xs font-bold tracking-wider"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mode-pill"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, var(--neon-1), var(--neon-2))`,
                          boxShadow: `0 0 12px rgba(var(--neon-1-rgb), 0.3)`,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center justify-center gap-2 ${isActive ? "text-white" : "text-muted-foreground"}`}>
                      <FontAwesomeIcon icon={m === "dark" ? faMoon : faSun} className="text-[10px]" />
                      {t(`mode.${m}`)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Theme Selector */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", backdropFilter: "blur(25px)" }}
          >
            <label className="mb-3 block text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("settings.theme")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {themeList.map((th) => {
                const isActive = theme === th.key
                return (
                  <motion.button
                    key={th.key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTheme(th.key)}
                    className="relative flex flex-col items-start gap-3 rounded-xl p-3.5 transition-all"
                    style={{
                      backgroundColor: isActive ? `rgba(var(--neon-1-rgb), 0.08)` : "var(--muted)",
                      border: isActive ? `1px solid rgba(var(--neon-1-rgb), 0.3)` : "1px solid transparent",
                    }}
                  >
                    {/* Color swatches */}
                    <div className="flex gap-1.5">
                      {[th.colors.neon1, th.colors.neon2, th.colors.neon3, th.colors.neon4].map((color, i) => (
                        <div
                          key={i}
                          className="h-5 w-5 rounded-full"
                          style={{
                            backgroundColor: color,
                            boxShadow: isActive ? `0 0 8px ${color}60` : "none",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {t(`theme.${th.key}`)}
                      </span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex h-4 w-4 items-center justify-center rounded-full"
                          style={{ backgroundColor: "var(--neon-1)" }}
                        >
                          <FontAwesomeIcon icon={faCheck} className="text-[8px] text-white" />
                        </motion.div>
                      )}
                    </div>
                    {/* BG preview bar */}
                    <div className="flex w-full gap-1">
                      <div className="h-2 flex-1 rounded-full" style={{ backgroundColor: th.colors.darkBg, border: "1px solid rgba(255,255,255,0.1)" }} />
                      <div className="h-2 flex-1 rounded-full" style={{ backgroundColor: th.colors.lightBg, border: "1px solid rgba(0,0,0,0.1)" }} />
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faGlobe} className="text-xs" style={{ color: "var(--neon-4)" }} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {t("settings.accessibility")}
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {/* Language */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", backdropFilter: "blur(25px)" }}
          >
            <label className="mb-3 block text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("settings.language")}
            </label>
            <div className="flex gap-2">
              {languages.map((lang) => {
                const isActive = language === lang.code
                return (
                  <motion.button
                    key={lang.code}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLanguage(lang.code)}
                    className="relative flex-1 rounded-xl py-3 text-center text-xs font-bold"
                    style={{
                      backgroundColor: isActive ? `rgba(var(--neon-4-rgb), 0.1)` : "var(--muted)",
                      border: isActive ? `1px solid rgba(var(--neon-4-rgb), 0.3)` : "1px solid transparent",
                      color: isActive ? "var(--neon-4)" : "var(--muted-foreground)",
                    }}
                  >
                    {lang.label}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Currency */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", backdropFilter: "blur(25px)" }}
          >
            <label className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <FontAwesomeIcon icon={faCoins} className="text-[10px]" style={{ color: "var(--neon-2)" }} />
              {t("settings.currency")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {currencies.map((cur) => {
                const isActive = currency === cur.code
                return (
                  <motion.button
                    key={cur.code}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrency(cur.code)}
                    className="flex items-center gap-2 rounded-xl px-3 py-3 text-left"
                    style={{
                      backgroundColor: isActive ? `rgba(var(--neon-2-rgb), 0.1)` : "var(--muted)",
                      border: isActive ? `1px solid rgba(var(--neon-2-rgb), 0.3)` : "1px solid transparent",
                    }}
                  >
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: isActive ? "var(--neon-2)" : "var(--muted-foreground)" }}
                    >
                      {cur.symbol}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {cur.code}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">{cur.label}</p>
                    </div>
                    {isActive && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <FontAwesomeIcon icon={faCheck} className="text-[10px]" style={{ color: "var(--neon-2)" }} />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Section */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faShieldHalved} className="text-xs" style={{ color: "#00D4FF" }} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {t("onboarding.settings.sectionTitle" as any)}
          </h2>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleRepeatProtocol}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: "rgba(0, 212, 255, 0.08)",
            border: "1px solid rgba(0, 212, 255, 0.3)",
            color: "#00D4FF",
            boxShadow: "0 0 12px rgba(0, 212, 255, 0.15)",
          }}
        >
          <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
          {t("onboarding.settings.repeatProtocol" as any)}
        </motion.button>
      </section>

      {/* Account Section */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" style={{ color: "var(--neon-3)" }} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {t("settings.account")}
          </h2>
        </div>
        <AnimatePresence>
          {!showLogoutConfirm ? (
            <motion.button
              key="logout-btn"
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLogoutConfirm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold"
              style={{
                backgroundColor: "rgba(var(--neon-3-rgb), 0.08)",
                border: "1px solid rgba(var(--neon-3-rgb), 0.15)",
                color: "var(--neon-3)",
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
              {t("settings.logout")}
            </motion.button>
          ) : (
            <motion.div
              key="logout-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-3 rounded-2xl p-4"
              style={{
                backgroundColor: "rgba(var(--neon-3-rgb), 0.08)",
                border: "1px solid rgba(var(--neon-3-rgb), 0.2)",
              }}
            >
              <p className="text-center text-sm text-foreground">{t("settings.logoutConfirm")}</p>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 rounded-xl py-2.5 text-xs font-bold text-muted-foreground"
                  style={{ backgroundColor: "var(--muted)" }}
                >
                  {t("common.cancel")}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="flex-1 rounded-xl py-2.5 text-xs font-bold text-white"
                  style={{
                    backgroundColor: "var(--neon-3)",
                    boxShadow: "0 0 12px rgba(var(--neon-3-rgb), 0.3)",
                  }}
                >
                  {t("settings.logout")}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="h-4" />
    </div>
  )
}
