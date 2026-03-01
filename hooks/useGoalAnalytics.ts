"use client"

import { useQuery } from "@tanstack/react-query"
import { goalsService } from "@/services/goals.service"

const GOALS_QUERY_KEY = ["goals"]

export function useGoalAnalytics(goalId: string | null) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...GOALS_QUERY_KEY, "analytics", goalId],
    queryFn: () => goalsService.getAnalytics(goalId!),
    enabled: !!goalId,
    staleTime: 30 * 1000,
  })

  return {
    analytics: data,
    isLoading,
    error,
    refetch,
  }
}
