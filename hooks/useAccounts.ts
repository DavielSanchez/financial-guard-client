"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { accountsService, type CreateAccount } from "@/services/accounts.service"
import type { Account } from "@/types/accounts.types"

export function useAccounts() {
  const queryClient = useQueryClient()
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

  const createMutation = useMutation({
    mutationFn: (payload: CreateAccount) => accountsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
  })

  return {
    accounts: data ?? [],
    isLoading,
    isError,
    error,
    createAccount: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  }
}

