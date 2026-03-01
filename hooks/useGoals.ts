"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { goalsService } from "@/services/goals.service"
import type { CreateGoal } from "@/types/goals.types"

export const GOALS_QUERY_KEY = ["goals"]

export function useGoals() {
  const queryClient = useQueryClient()

  const { data: goals = [], isLoading, error } = useQuery({
    queryKey: GOALS_QUERY_KEY,
    queryFn: goalsService.getAll,
    staleTime: 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateGoal) => goalsService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY }),
  })

  const contributeMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      goalsService.contribute(id, amount),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => goalsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY }),
  })

  return {
    goals,
    isLoading,
    error,
    createGoal: createMutation.mutateAsync,
    contribute: contributeMutation.mutateAsync,
    deleteGoal: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isContributing: contributeMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
