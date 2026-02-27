import api from "@/lib/axios"
import type { Account } from "@/types/accounts.types"

export interface CreateAccount {
  name: string
  type: string
  balance: number
  currency: string
  icon: string
  color: string
  interest_rate?: number
  is_hidden?: boolean
}

export const accountsService = {
  async getAll(): Promise<Account[]> {
    const { data } = await api.get<Account[]>("/accounts")
    return data
  },

  async create(payload: CreateAccount): Promise<Account> {
    const { data } = await api.post<Account>("/accounts", payload)
    return data
  },
}

