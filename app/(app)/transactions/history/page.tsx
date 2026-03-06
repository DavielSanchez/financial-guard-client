"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faHistory } from "@fortawesome/free-solid-svg-icons"
import { useI18n } from "@/hooks/use-translations"
import { useSettings } from "@/components/settings-provider"
import { useAccounts } from "@/hooks/useAccounts"
import { CategoryIcon } from "@/components/category-icon"
import { transactionService } from "@/services/transaction.service"
import type { RecentTransaction } from "@/types/transactions.types"
import { hexToRgba } from "@/lib/hexToRgba "

const LIMIT = 10
type HistoryFilterType = "all" | "income" | "expense"

export default function TransactionsHistoryPage() {
  const { t } = useI18n()
  const { formatCurrency } = useSettings()
  const { accounts } = useAccounts()
  const [allTransactions, setAllTransactions] = useState<RecentTransaction[]>([])
  const [historyPage, setHistoryPage] = useState(1)
  const [hasMoreHistory, setHasMoreHistory] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [filterHistoryType, setFilterHistoryType] = useState<HistoryFilterType>("all")
  const [filterHistoryAccountId, setFilterHistoryAccountId] = useState<string>("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const fetchTransactions = useCallback(
    async (pageNum: number, append: boolean = false) => {
      setLoadingHistory(true)
      try {
        const params: any = {
          page: pageNum,
          limit: LIMIT,
        }
        if (filterHistoryType !== "all") params.type = filterHistoryType
        if (filterHistoryAccountId) params.accountId = filterHistoryAccountId
        if (startDate) params.startDate = startDate
        if (endDate) params.endDate = endDate

        const data = await transactionService.getHistory(params)
        if (append) {
          setAllTransactions((old) => [...old, ...data.transactions])
        } else {
          setAllTransactions(data.transactions)
        }
        setHasMoreHistory(data.pagination.hasMore)
        setHistoryPage(data.pagination.page)
      } catch (err) {
        console.error("Error fetching history:", err)
        if (!append) setAllTransactions([])
        setHasMoreHistory(false)
      } finally {
        setLoadingHistory(false)
      }
    },
    [filterHistoryType, filterHistoryAccountId, startDate, endDate]
  )

  useEffect(() => {
    fetchTransactions(1, false)
  }, [fetchTransactions])

  const handleHistoryFilterChange = useCallback(
    (updates: { type?: HistoryFilterType; accountId?: string }) => {
      setAllTransactions([])
      setHistoryPage(1)
      if (updates.type !== undefined) setFilterHistoryType(updates.type)
      if (updates.accountId !== undefined) setFilterHistoryAccountId(updates.accountId)
    },
    []
  )

  const loadMoreHistory = () => {
    if (!loadingHistory && hasMoreHistory) {
      fetchTransactions(historyPage + 1, true)
    }
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-8 lg:px-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/transactions"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHistory} className="text-sm" style={{ color: "var(--neon-2)" }} />
            <h1 className="font-serif text-xl font-bold tracking-wider text-foreground">
              {t("transactions.history" as any)}
            </h1>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-glass-border bg-glass-bg p-1">
          {(["all", "income", "expense"] as const).map((type) => {
            const isActive = filterHistoryType === type
            return (
              <motion.button
                key={type}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleHistoryFilterChange({ type })}
                className={`relative rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="history-type-pill"
                    className="absolute inset-0 rounded-lg bg-white/10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {type === "all" ? t("transactions.filterAll" as any) : t(`transactions.types.${type}` as any)}
                </span>
              </motion.button>
            )
          })}
        </div>
        <select
          value={filterHistoryAccountId}
          onChange={(e) => handleHistoryFilterChange({ accountId: e.target.value })}
          className="rounded-xl border border-glass-border bg-glass-bg px-3 py-2 text-xs text-foreground outline-none"
        >
          <option value="">{t("transactions.filterByAccount" as any)}</option>
          {accounts.map((acc) => (
            <option className="text-black" key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-xl border border-glass-border bg-glass-bg px-3 py-2 text-xs text-foreground outline-none"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-xl border border-glass-border bg-glass-bg px-3 py-2 text-xs text-foreground outline-none"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-2xl border border-glass-border bg-glass-bg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-glass-border/60 text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3 font-medium">{t("dashboard.table.movement" as any)}</th>
                <th className="px-4 py-3 font-medium">{t("dashboard.table.account" as any)}</th>
                <th className="px-4 py-3 font-medium">{t("dashboard.table.category" as any)}</th>
                <th className="px-4 py-3 font-medium">{t("dashboard.table.date" as any)}</th>
                <th className="px-4 py-3 text-right font-medium">{t("dashboard.table.amount" as any)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/60">
              {loadingHistory && allTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                    {t("common.loading" as any)}
                  </td>
                </tr>
              )}
              {!loadingHistory && allTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                    {t("transactions.noTransactions" as any)}
                  </td>
                </tr>
              )}
              {allTransactions.map((tx) => {
                const isIncome = tx.type === "income"
                const date = new Date(tx.date)
                const formattedDate = date.toLocaleString(undefined, {
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                return (
                  <tr key={tx.id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: tx.categories?.color
                              ? hexToRgba(tx.categories.color, 0.15)
                              : "rgba(255,255,255,0.06)",
                          }}
                        >
                          <CategoryIcon
                            name={tx.categories?.icon}
                            color={tx.categories?.color ?? "#888"}
                            size={18}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {tx.note || tx.categories?.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {t(`transactions.types.${tx.type}` as any).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 truncate text-xs text-muted-foreground">
                      {tx.accounts?.name}
                    </td>
                    <td className="px-4 py-3 truncate text-xs text-muted-foreground">
                      {tx.categories?.name}
                    </td>
                    <td className="px-4 py-3 truncate text-xs text-muted-foreground">
                      {formattedDate}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono text-sm font-bold ${
                          isIncome ? "text-neon-green" : "text-foreground"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(Math.abs(tx.amount), tx.currency)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {hasMoreHistory && (
          <div className="border-t border-glass-border/60 p-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={loadMoreHistory}
              disabled={loadingHistory}
              className="w-full rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              style={{ backgroundColor: "var(--muted)" }}
            >
              {loadingHistory ? t("common.loading" as any) : t("transactions.loadMore" as any)}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
