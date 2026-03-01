export interface CreateGoal {
  name: string
  target_amount: number
  is_piggy_bank: boolean
  piggy_type: "open" | "daily"
  start_amount?: number
  increment_amount?: number
  color: string
  icon: string
  description?: string | null
  saved_already?: number
  currency: string
  deadline: string // YYYY-MM-DD
  notify_inactivity_days?: number
  notify_on_risk?: boolean
}

export interface Goal {
  id: string
  user_id?: string
  name: string
  description?: string | null
  target_amount: number
  /** API returns saved_already as the current saved amount */
  saved_already?: number
  saved_amount?: number // some APIs may use this
  is_piggy_bank?: boolean
  piggy_type?: "open" | "daily"
  start_amount?: number
  increment_amount?: number
  current_day?: number
  last_check_in?: string | null
  last_contribution_date?: string | null // API field
  streak?: number
  challenge_days?: number
  color?: string
  icon?: string
  currency?: string
  deadline?: string
  status?: string
  notify_inactivity_days?: number
  notify_on_risk?: boolean
  created_at?: string
  updated_at?: string
}

export interface GoalAnalyticsArithmeticDay {
  date: string
  amount: number
}

export interface GoalAnalytics {
  currentStreak: number
  nextPaymentAmount: number
  daysRemaining: number
  percentage: number
  statusHealth: string
  statusMessage: string
  projection: number
  streakFreezeAvailable: boolean
  arithmeticProgression: GoalAnalyticsArithmeticDay[]
  isTodayPaid: boolean
  currency: string
}
