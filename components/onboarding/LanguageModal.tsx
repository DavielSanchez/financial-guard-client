"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons"
import { useSettings, type LanguageCode } from "@/components/settings-provider"
import { useI18n } from "@/hooks/use-translations"

interface LanguageModalProps {
  open: boolean
  onConfirm: () => void
  onSkip: () => void
}

const languages: { code: LanguageCode; label: string }[] = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
]

export function LanguageModal({ open, onConfirm, onSkip }: LanguageModalProps) {
  const { t } = useI18n()
  const { language, setLanguage } = useSettings()
  const [selected, setSelected] = useState<LanguageCode>(language)

  const handleConfirm = () => {
    setLanguage(selected)
    onConfirm()
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{
          backgroundColor: "rgba(5, 5, 5, 0.92)",
          backdropFilter: "blur(12px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-2xl p-6"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid #00D4FF",
            boxShadow: "0 0 24px rgba(0, 212, 255, 0.2), 0 0 48px rgba(0, 212, 255, 0.08)",
          }}
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="text-xl" style={{ color: "#00D4FF" }} />
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest" style={{ color: "#00D4FF" }}>
              {t("onboarding.languageModal.title" as any)}
            </h2>
          </div>
          <p className="mb-4 text-center text-xs text-muted-foreground">
            {t("onboarding.languageModal.subtitle" as any)}
          </p>

          <div className="mb-6 flex gap-3">
            {languages.map((lang) => {
              const isActive = selected === lang.code
              return (
                <motion.button
                  key={lang.code}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelected(lang.code)}
                  className="flex-1 rounded-xl py-3 text-center font-mono text-sm font-bold uppercase"
                  style={{
                    backgroundColor: isActive ? "rgba(0, 212, 255, 0.15)" : "var(--muted)",
                    border: isActive ? "1px solid rgba(0, 212, 255, 0.4)" : "1px solid transparent",
                    color: isActive ? "#00D4FF" : "var(--muted-foreground)",
                    boxShadow: isActive ? "0 0 12px rgba(0, 212, 255, 0.2)" : "none",
                  }}
                >
                  {lang.label}
                </motion.button>
              )
            })}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            className="mb-3 w-full rounded-xl py-3.5 font-mono text-xs font-bold uppercase tracking-wider"
            style={{
              background: "linear-gradient(135deg, #00D4FF 0%, #8F00FF 100%)",
              color: "#050505",
              boxShadow: "0 0 16px rgba(0, 212, 255, 0.4)",
            }}
          >
            {t("onboarding.languageModal.startProtocol" as any)}
          </motion.button>

          <button
            onClick={onSkip}
            className="w-full py-2 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("onboarding.languageModal.skip" as any)}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
