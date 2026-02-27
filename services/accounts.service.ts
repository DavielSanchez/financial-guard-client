import api from "@/lib/axios"
import type { Account } from "@/types/accounts.types"

export const accountsService = {
  async getAll(): Promise<Account[]> {
    const { data } = await api.get<Account[]>("/accounts")
    return data
  },
}

