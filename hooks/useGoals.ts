"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { goalsService } from "@/services/goals.service"
import type { CreateGoal, Goal } from "@/types/goals.types"

export const GOALS_QUERY_KEY = ["goals"]

function todayUtc(): string {
  return new Date().toISOString().split("T")[0]
}

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
    onMutate: async ({ id, amount }) => {
      await queryClient.cancelQueries({ queryKey: GOALS_QUERY_KEY })
      const previous = queryClient.getQueryData<Goal[]>(GOALS_QUERY_KEY)
      const today = todayUtc()
      queryClient.setQueryData<Goal[]>(GOALS_QUERY_KEY, (old) =>
        (old ?? []).map((g) =>
          g.id === id
            ? {
                ...g,
                last_contribution_date: today,
                streak: (g.streak ?? 0) + 1,
                saved_already: (g.saved_already ?? g.saved_amount ?? 0) + amount,
              }
            : g
        )
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous != null) {
        queryClient.setQueryData(GOALS_QUERY_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY })
    },
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
