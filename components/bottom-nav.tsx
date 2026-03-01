"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useI18n } from "@/hooks/use-translations"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGrip,
  faChartPie,
  faPlus,
  faWallet,
  faRobot,
} from "@fortawesome/free-solid-svg-icons"
import { cn } from "@/lib/utils"

const leftItems = [
  { href: "/dashboard", icon: faGrip, labelKey: "nav.home" },
  { href: "/budgeting", icon: faChartPie, labelKey: "nav.budgeting" },
] as const

const rightItems = [
  { href: "/wallet", icon: faWallet, labelKey: "nav.wallet" },
  { href: "/ai-coach", icon: faRobot, labelKey: "nav.aiCoach" },
] as const

export function BottomNav() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { t } = useI18n()

  useEffect(() => {
    setMounted(true)
  }, [])

  const renderItem = (item: { href: string; icon: typeof faGrip; labelKey: string }) => {
    const isActive = pathname === item.href
    return (
      <Link
        key={item.href}
        href={item.href}
        className="relative flex flex-col items-center gap-1 px-4 py-1.5"
      >
        {isActive && (
          <motion.div
            layoutId="nav-active-bar"
            className="absolute -top-[1px] h-[2px] w-10 rounded-full bg-neon-purple"
            style={{ boxShadow: "0 0 8px var(--neon-1), 0 0 20px rgba(var(--neon-1-rgb),0.4)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <FontAwesomeIcon
          icon={item.icon}
          className={cn(
            "text-lg transition-all duration-200",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}
          style={isActive ? { filter: "drop-shadow(0 0 6px rgba(var(--neon-1-rgb),0.5))" } : {}}
        />
        <span
          className={cn(
            "text-[10px] font-medium tracking-wide",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {t(item.labelKey as any)}
        </span>
      </Link>
    )
  }

  if (!mounted) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom lg:hidden"
      style={{
        backgroundColor: "var(--background)",
        borderTop: "1px solid var(--neon-1)",
        boxShadow: "0 -2px 20px rgba(var(--neon-1-rgb),0.15)",
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between px-2 py-1.5">
        {/* Left tabs */}
        <div className="flex items-center gap-1">
          {leftItems.map(renderItem)}
        </div>

        {/* Center FAB */}
        <Link
          href="/transactions"
          className="relative -mt-7 flex items-center justify-center"
          data-tour="fab-new-transaction"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("onboarding-fab-clicked"))
            }
          }}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, var(--neon-1) 0%, var(--neon-2) 100%)",
              boxShadow:
                "0 0 20px rgba(var(--neon-1-rgb),0.4), 0 0 40px rgba(var(--neon-2-rgb),0.2), 0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="text-xl text-white" />
          </motion.div>
          {/* Ring border around FAB */}
          <div
            className="pointer-events-none absolute -inset-1 rounded-full"
            style={{
              border: "3px solid var(--background)",
            }}
          />
        </Link>

        {/* Right tabs */}
        <div className="flex items-center gap-1">
          {rightItems.map(renderItem)}
        </div>
      </div>
    </nav>
  )
}
