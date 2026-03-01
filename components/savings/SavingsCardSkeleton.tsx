"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function SavingsCardSkeleton() {
  return (
    <div
      className="flex h-full min-h-[88px] items-center gap-3 rounded-2xl p-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(var(--neon-1-rgb, 143,0,255), 0.1), rgba(var(--neon-2-rgb, 0,212,255), 0.05))",
        border: "1px solid rgba(var(--neon-1-rgb, 143,0,255), 0.2)",
      }}
    >
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl bg-white/15" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-32 bg-white/15" />
        <Skeleton className="h-3 w-40 bg-white/10" />
        <Skeleton className="h-3 w-24 bg-white/10" />
      </div>
      <Skeleton className="h-4 w-4 shrink-0 rounded bg-white/15" />
    </div>
  )
}
