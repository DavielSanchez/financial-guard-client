"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface OnboardingContextValue {
  languageModalConfirmed: boolean
  setLanguageModalConfirmed: (v: boolean) => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [languageModalConfirmed, setLanguageModalConfirmed] = useState(false)

  return (
    <OnboardingContext.Provider
      value={{
        languageModalConfirmed,
        setLanguageModalConfirmed,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboardingContext() {
  const ctx = useContext(OnboardingContext)
  return ctx
}
