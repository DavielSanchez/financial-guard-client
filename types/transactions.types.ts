export interface CreateTransaction {
  account_id: string;
  category_id: string;
  amount: number;
  type: 'income' | 'expense';
  currency: string;
  note?: string;
  date?: string;
  is_recurring?: boolean;
  receipt_url?: string | null;
}