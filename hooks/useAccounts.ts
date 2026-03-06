"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  accountsService,
  type CreateAccount,
  type UpdateAccount,
  type BridgePayload,
} from "@/services/accounts.service"
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

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAccount }) =>
      accountsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
  })

  const bridgeMutation = useMutation({
    mutationFn: (payload: BridgePayload) => accountsService.bridge(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
    },
  })

  const accounts = data ?? []
  const walletAccounts = accounts.filter((a) => !a.is_hidden)
  const vaultAccounts = accounts.filter((a) => a.is_hidden)

  return {
    accounts,
    walletAccounts,
    vaultAccounts,
    isLoading,
    isError,
    error,
    createAccount: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAccount: (id: string, payload: UpdateAccount) =>
      updateMutation.mutateAsync({ id, payload }),
    isUpdating: updateMutation.isPending,
    bridgeTransfer: bridgeMutation.mutateAsync,
    isBridging: bridgeMutation.isPending,
  }
}

