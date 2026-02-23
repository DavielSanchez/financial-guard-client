"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, createContext, useContext, type ReactNode } from "react"
import { AnimatePresence } from "framer-motion"

type PrivacyContextType = {
  privacyMode: boolean
  togglePrivacy: () => void
}

const PrivacyContext = createContext<PrivacyContextType>({
  privacyMode: false,
  togglePrivacy: () => {},
})

export function usePrivacy() {
  return useContext(PrivacyContext)
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  )
  const [privacyMode, setPrivacyMode] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <PrivacyContext.Provider
        value={{
          privacyMode,
          togglePrivacy: () => setPrivacyMode((p) => !p),
        }}
      >
        <AnimatePresence initial={false} mode="wait">
          {children}
        </AnimatePresence>
      </PrivacyContext.Provider>
    </QueryClientProvider>
  )
}
