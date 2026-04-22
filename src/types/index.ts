export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
}

export interface ExpenseFilters {
  category?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: 'date' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export type PageType = 'dashboard' | 'expenses' | 'insights';

export interface SpendingInsight {
  type: 'warning' | 'positive' | 'info' | 'tip';
  icon: string;
  title: string;
  description: string;
}

export interface SpendingPattern {
  label: string;
  value: string | number;
  detail?: string;
}

export interface CategoryStat {
  category: string;
  total: number;
  count: number;
  percentage: number;
}
