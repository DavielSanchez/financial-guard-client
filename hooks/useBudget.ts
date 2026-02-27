"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { budgetService } from "@/services/budget.service"
import type { BudgetEnvelope, CreateEnvelopePayload, Subscription } from "@/types/budget.types"

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()

export function useBudget(params?: { month?: number; year?: number }) {
  const queryClient = useQueryClient()
  const month = params?.month ?? currentMonth
  const year = params?.year ?? currentYear

  const envelopesQuery = useQuery({
    queryKey: ["budget", "envelopes", month, year],
    queryFn: () => budgetService.getEnvelopes({ month, year }),
    staleTime: 2 * 60 * 1000,
  })

  const subscriptionsQuery = useQuery({
    queryKey: ["budget", "subscriptions"],
    queryFn: budgetService.getSubscriptions,
    staleTime: 2 * 60 * 1000,
  })

  const createEnvelopeMutation = useMutation({
    mutationFn: (payload: CreateEnvelopePayload) => budgetService.createEnvelope(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", "envelopes"] })
    },
  })

  const toggleSubscriptionMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      budgetService.toggleSubscription(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", "subscriptions"] })
    },
  })

  const envelopes = envelopesQuery.data ?? []
  const subscriptions = subscriptionsQuery.data?.subscriptions ?? []
  const totalMonthlyDrain = subscriptionsQuery.data?.total_monthly_drain ?? 0

  const totalBudget = envelopes.reduce((s, e) => s + e.budget_amount, 0)
  const totalSpent = envelopes.reduce((s, e) => s + (e.spent ?? 0), 0)
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return {
    envelopes,
    subscriptions,
    totalMonthlyDrain,
    totalBudget,
    totalSpent,
    totalPercentage,
    isLoadingEnvelopes: envelopesQuery.isLoading,
    isLoadingSubscriptions: subscriptionsQuery.isLoading,
    isCreating: createEnvelopeMutation.isPending,
    isToggling: toggleSubscriptionMutation.isPending,
    createEnvelope: createEnvelopeMutation.mutateAsync,
    toggleSubscription: toggleSubscriptionMutation.mutateAsync,
    refetchEnvelopes: envelopesQuery.refetch,
    refetchSubscriptions: subscriptionsQuery.refetch,
  }
}
