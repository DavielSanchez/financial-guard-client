export interface DashboardResponse {
  balance: number
  income: number
  expense: number
  delta: number
  deltaLabel: string
  /** Total of hidden (vault) accounts; excluded from balance by default */
  vaults_balance?: number
  chartBalance: ChartPoint[]
  chartIncome: ChartPoint[]
  chartExpense: ChartPoint[]
}

export interface ChartPoint {
  d: string; // Fecha u hora
  v: number; // Valor
}

export interface DashboardChartProps {
  data: ChartPoint[];
  isLoading?: boolean;
  color?: string; // Color principal (ej: #8F00FF para balance, #10b981 para ingresos)
  gradientId: string; // ID único para evitar conflictos entre múltiples gráficos
}