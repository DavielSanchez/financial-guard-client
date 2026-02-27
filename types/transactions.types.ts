export interface CreateTransaction {
  account_id: string
  category_id: string
  amount: number
  type: "income" | "expense"
  currency: string
  note?: string
  date?: string
  is_recurring?: boolean
  receipt_url?: string | null
}

export interface RecentTransactionCategory {
  icon: string
  name: string
  color: string
}

export interface RecentTransactionAccount {
  name: string
}

export interface RecentTransaction {
  id: string
  user_id: string
  account_id: string
  category_id: string
  amount: number
  currency: string
  date: string
  note: string | null
  receipt_url: string | null
  is_recurring: boolean
  created_at: string
  type: "income" | "expense"
  categories: RecentTransactionCategory
  accounts: RecentTransactionAccount
}
