"use client"

import { useQuery } from "@tanstack/react-query"
import { accountsService } from "@/services/accounts.service"
import type { Account } from "@/types/accounts.types"

export function useAccounts() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<Account[], Error>({
    queryKey: ["accounts"],
    queryFn: accountsService.getAll,
    staleTime: 5 * 60 * 1000,
  })

  return {
    accounts: data ?? [],
    isLoading,
    isError,
    error,
  }
}

