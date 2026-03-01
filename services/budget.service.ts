import api from "@/lib/axios"
import type {
  BudgetEnvelope,
  CreateEnvelopePayload,
  CreateSubscriptionPayload,
  Subscription,
  SubscriptionsResponse,
} from "@/types/budget.types"

const now = new Date()

export const budgetService = {
  async getEnvelopes(params?: { month?: number; year?: number }): Promise<BudgetEnvelope[]> {
    const month = params?.month ?? now.getMonth() + 1
    const year = params?.year ?? now.getFullYear()
    const { data } = await api.get<BudgetEnvelope[]>("/budget/envelopes", {
      params: { month, year },
    })
    return data
  },

  async createEnvelope(payload: CreateEnvelopePayload): Promise<BudgetEnvelope> {
    const { data } = await api.post<BudgetEnvelope>("/budget/envelopes", payload)
    return data
  },

  async updateEnvelope(
    id: string,
    updates: Partial<Pick<CreateEnvelopePayload, "budget_amount" | "color" | "icon">>
  ): Promise<BudgetEnvelope> {
    const { data } = await api.patch<BudgetEnvelope>(`/budget/envelopes/${id}`, updates)
    return data
  },

  async deleteEnvelope(id: string): Promise<void> {
    await api.delete(`/budget/envelopes/${id}`)
  },

  async getSubscriptions(): Promise<{ subscriptions: Subscription[]; total_monthly_drain: number }> {
    const { data } = await api.get<SubscriptionsResponse | Subscription[]>("/budget/subscriptions")
    if (Array.isArray(data)) {
      const active = data.filter((s) => s.is_active)
      const total = active.reduce((sum, s) => {
        if (s.billing_cycle === "monthly") return sum + s.amount
        if (s.billing_cycle === "yearly") return sum + s.amount / 12
        if (s.billing_cycle === "weekly") return sum + s.amount * 4.33
        return sum + s.amount
      }, 0)
      return { subscriptions: data, total_monthly_drain: total }
    }
    const total = data.total_monthly_drain ?? 0
    return {
      subscriptions: data.subscriptions,
      total_monthly_drain: total,
    }
  },

  async createSubscription(payload: CreateSubscriptionPayload): Promise<Subscription> {
    const { data } = await api.post<Subscription>("/budget/subscriptions", payload)
    return data
  },

  async toggleSubscription(id: string, is_active: boolean): Promise<Subscription> {
    const { data } = await api.patch<Subscription>(`/budget/subscriptions/${id}`, { is_active })
    return data
  },
}
