export interface BudgetEnvelopeCategory {
  id: string
  name: string
  icon: string
  color: string
}

export interface BudgetEnvelope {
  id: string
  user_id: string
  category_id: string
  category?: BudgetEnvelopeCategory
  budget_amount: number
  currency: string
  period_type?: string
  period_month?: number
  period_year?: number
  spent: number
  color?: string
  gradient?: string
  icon?: string
  sort_order?: number
  created_at: string
  updated_at: string
}

export interface CreateEnvelopePayload {
  category_id: string
  budget_amount: number
  currency: string
  period_type?: string
  period_month?: number
  period_year?: number
  color?: string
  icon?: string
}

export interface UpsertTemplatePayload {
  category_id: string
  budget_amount: number
}

export interface Subscription {
  id: string
  user_id: string
  name: string
  amount: number
  currency: string
  billing_cycle: "monthly" | "yearly" | "weekly"
  next_bill_date: string
  color?: string
  icon?: string
  is_active: boolean
  category_id?: string
  created_at: string
  updated_at: string
}

export interface CreateSubscriptionPayload {
  name: string
  amount: number
  currency: string
  billing_cycle: "monthly" | "yearly" | "weekly"
  next_bill_date?: string // YYYY-MM-DD
  color?: string
  icon?: string
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[]
  total_monthly_drain?: number
}
