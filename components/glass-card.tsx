"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  glowColor?: "purple" | "cyan" | "pink" | "green" | "none"
  noPadding?: boolean
}

const glowMap = {
  purple: "shadow-[0_0_30px_rgba(143,0,255,0.15)]",
  cyan: "shadow-[0_0_30px_rgba(0,212,255,0.15)]",
  pink: "shadow-[0_0_30px_rgba(255,0,127,0.15)]",
  green: "shadow-[0_0_30px_rgba(0,255,148,0.15)]",
  none: "",
}

export function GlassCard({
  children,
  className,
  glowColor = "none",
  noPadding = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass rounded-2xl",
        !noPadding && "p-5",
        glowMap[glowColor],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
