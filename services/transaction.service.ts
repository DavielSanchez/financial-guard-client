import api from "@/lib/axios"
import type { CreateTransaction, RecentTransaction } from "@/types/transactions.types"

export const transactionService = {
  create: async (data: CreateTransaction) => {
    const response = await api.post("/transactions", data)
    return response.data
  },

  getHistory: async (params?: any) => {
    const response = await api.get("/transactions", { params })
    return response.data
  },

  getRecent: async (): Promise<RecentTransaction[]> => {
    const response = await api.get<RecentTransaction[]>("/transactions/recent")
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`)
    return response.data
  },
}
