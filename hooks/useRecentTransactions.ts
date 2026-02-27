"use client"

import { useQuery } from "@tanstack/react-query"
import { transactionService } from "@/services/transaction.service"
import type { RecentTransaction } from "@/types/transactions.types"

export function useRecentTransactions() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<RecentTransaction[], Error>({
    queryKey: ["transactions", "recent"],
    queryFn: transactionService.getRecent,
    staleTime: 60 * 1000,
  })

  return {
    transactions: data ?? [],
    isLoading,
    isError,
    error,
  }
}

