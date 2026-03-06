"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { budgetService } from "@/services/budget.service"
import type {
  BudgetEnvelope,
  CreateEnvelopePayload,
  CreateSubscriptionPayload,
  Subscription,
  UpsertTemplatePayload,
} from "@/types/budget.types"

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

  const nearestSubscriptionQuery = useQuery({
    queryKey: ["budget", "subscriptions", "nearest"],
    queryFn: () => budgetService.getNearestSubscription(),
    staleTime: 2 * 60 * 1000,
  })

  const createEnvelopeMutation = useMutation({
    mutationFn: (payload: CreateEnvelopePayload) => budgetService.createEnvelope(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", "envelopes"] })
    },
  })

  const updateEnvelopeMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Pick<CreateEnvelopePayload, "budget_amount" | "color" | "icon">>
    }) => budgetService.updateEnvelope(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", "envelopes"] })
    },
  })

  const upsertTemplateMutation = useMutation({
    mutationFn: (payload: UpsertTemplatePayload) => budgetService.upsertTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", "envelopes"] })
    },
  })

  const createSubscriptionMutation = useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) =>
      budgetService.createSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", "subscriptions"] })
      queryClient.invalidateQueries({ queryKey: ["budget", "subscriptions", "nearest"] })
    },
  })

  const toggleSubscriptionMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      budgetService.toggleSubscription(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", "subscriptions"] })
      queryClient.invalidateQueries({ queryKey: ["budget", "subscriptions", "nearest"] })
    },
  })

  const envelopes = envelopesQuery.data ?? []
  const subscriptions = subscriptionsQuery.data?.subscriptions ?? []
  const totalMonthlyDrain = subscriptionsQuery.data?.total_monthly_drain ?? 0
  const nearestSubscription = nearestSubscriptionQuery.data ?? null

  const totalBudget = envelopes.reduce((s, e) => s + e.budget_amount, 0)
  const totalSpent = envelopes.reduce((s, e) => s + (e.spent ?? 0), 0)
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return {
    envelopes,
    subscriptions,
    nearestSubscription,
    totalMonthlyDrain,
    totalBudget,
    totalSpent,
    totalPercentage,
    isLoadingEnvelopes: envelopesQuery.isLoading,
    isLoadingSubscriptions: subscriptionsQuery.isLoading,
    isLoadingNearestSubscription: nearestSubscriptionQuery.isLoading,
    isCreating: createEnvelopeMutation.isPending,
    isCreatingSubscription: createSubscriptionMutation.isPending,
    isToggling: toggleSubscriptionMutation.isPending,
    createEnvelope: createEnvelopeMutation.mutateAsync,
    updateEnvelope: updateEnvelopeMutation.mutateAsync,
    upsertTemplate: upsertTemplateMutation.mutateAsync,
    createSubscription: createSubscriptionMutation.mutateAsync,
    toggleSubscription: toggleSubscriptionMutation.mutateAsync,
    isUpdatingEnvelope: updateEnvelopeMutation.isPending,
    isUpsertingTemplate: upsertTemplateMutation.isPending,
    refetchEnvelopes: envelopesQuery.refetch,
    refetchSubscriptions: subscriptionsQuery.refetch,
  }
}
