"use client"

import { motion } from "framer-motion"
import { Flame } from "lucide-react"

interface StreakBadgeProps {
  currentStreak: number
  streakFreezeAvailable?: boolean
  t: (key: string, params?: Record<string, string | number>) => string
}

export function StreakBadge({
  currentStreak,
  streakFreezeAvailable,
  t,
}: StreakBadgeProps) {
  const isLegendary = currentStreak >= 7
  const isWarm = currentStreak >= 3
  const isCold = currentStreak >= 1 && currentStreak <= 2
  const isOff = currentStreak === 0

  const getCopy = () => {
    if (isOff) return t("savings.igniteStreak")
    if (isLegendary) return t("savings.legendaryStreak", { count: currentStreak })
    return t("goals.dayStreak", { count: currentStreak })
  }

  const getFlameStyle = () => {
    if (isOff) {
      return {
        color: "#64748b",
        filter: "none",
        opacity: 0.6,
      }
    }
    if (isCold) {
      return {
        color: "#0ea5e9",
        filter: "drop-shadow(0 0 4px #0ea5e9)",
      }
    }
    if (isWarm && !isLegendary) {
      return {
        color: "#FF8C00",
        filter: "drop-shadow(0 0 6px #FF8C00)",
      }
    }
    return {
      color: "#a855f7",
      filter: "drop-shadow(0 0 8px rgba(168,85,247,0.6))",
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
        style={{
          backgroundColor: isOff ? "rgba(100,116,139,0.15)" : "rgba(255,127,0,0.1)",
          border: `1px solid ${isOff ? "rgba(100,116,139,0.2)" : "rgba(255,127,0,0.2)"}`,
        }}
        animate={
          isLegendary
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(168,85,247,0)",
                  "0 0 12px 2px rgba(168,85,247,0.3)",
                  "0 0 0 0 rgba(168,85,247,0)",
                ],
              }
            : {}
        }
        transition={
          isLegendary
            ? {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5,
              }
            : {}
        }
      >
        <motion.span
          animate={
            isLegendary
              ? {
                  scale: [1, 1.15, 1],
                  opacity: [1, 0.9, 1],
                }
              : {}
          }
          transition={
            isLegendary
              ? {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }
              : {}
          }
        >
          <Flame
            className="h-4 w-4 shrink-0"
            style={getFlameStyle()}
            fill={isOff ? "transparent" : "currentColor"}
          />
        </motion.span>
        <span
          className="font-mono text-xs font-bold"
          style={{
            color: isOff ? "#64748b" : isLegendary ? "#a855f7" : "#FF8C00",
          }}
        >
          {getCopy()}
        </span>
        {streakFreezeAvailable && (
          <span
            className="text-sm"
            title={t("savings.streakFreeze")}
            aria-label={t("savings.streakFreeze")}
          >
            ❄️
          </span>
        )}
      </motion.div>
    </div>
  )
}
