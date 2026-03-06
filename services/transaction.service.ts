import api from "@/lib/axios"
import type {
  CreateTransaction,
  RecentTransaction,
  PaginatedTransactionsResponse,
  TransactionsHistoryParams,
} from "@/types/transactions.types"

export const transactionService = {
  create: async (data: CreateTransaction) => {
    const response = await api.post("/transactions", data)
    return response.data
  },

  getHistory: async (
    params?: TransactionsHistoryParams
  ): Promise<PaginatedTransactionsResponse> => {
    const response = await api.get<PaginatedTransactionsResponse>("/transactions", {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        ...(params?.type && { type: params.type }),
        ...(params?.accountId && { accountId: params.accountId }),
        ...(params?.startDate && { startDate: params.startDate }),
        ...(params?.endDate && { endDate: params.endDate }),
      },
    })
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
