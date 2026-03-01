import api from "@/lib/axios"
import type { CreateGoal, Goal, GoalAnalytics } from "@/types/goals.types"

export const goalsService = {
  getAll: async (): Promise<Goal[]> => {
    const { data } = await api.get<Goal[] | { goals: Goal[] }>("/goals")
    return Array.isArray(data) ? data : (data?.goals ?? [])
  },

  getAnalytics: async (id: string): Promise<GoalAnalytics> => {
    const { data } = await api.get<{ analytics: GoalAnalytics }>(`/goals/${id}/analytics`)
    return data?.analytics ?? data
  },

  create: async (payload: CreateGoal): Promise<Goal> => {
    const { data } = await api.post<Goal>("/goals", payload)
    return data
  },

  contribute: async (id: string, amount: number): Promise<Goal> => {
    const { data } = await api.post<Goal>(`/goals/${id}/contribute`, { amount })
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`)
  },
}
