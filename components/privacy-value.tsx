"use client"

import { usePrivacy } from "@/components/providers"
import { cn } from "@/lib/utils"
import type { ReactNode, CSSProperties } from "react"

export function PrivacyValue({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const { privacyMode } = usePrivacy()

  return (
    <span className={cn(privacyMode && "privacy-blur", className)} style={style}>
      {children}
    </span>
  )
}
