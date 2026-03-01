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

export type UpdateAccount = CreateAccount

export interface BridgePayload {
  from_account_id: string
  to_account_id: string
  amount: number
  category_id: string
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

  async update(id: string, payload: UpdateAccount): Promise<Account> {
    const { data } = await api.patch<Account>(`/accounts/${id}`, payload)
    return data
  },

  async bridge(payload: BridgePayload): Promise<unknown> {
    const { data } = await api.post("/accounts/bridge", payload)
    return data
  },
}

