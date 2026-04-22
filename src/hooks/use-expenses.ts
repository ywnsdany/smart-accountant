'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import type { Expense, ExpenseFilters } from '@/types';
import * as db from '@/lib/db-client';
import { useAppStore } from '@/stores/app-store';

interface AppState {
  expenses: Expense[];
  isLoaded: boolean;
}

export function useExpenses(filters?: ExpenseFilters) {
  const { expenses, isLoaded, setExpenses, setLoaded } = useAppStore();

  const refresh = useCallback(() => {
    const data = db.fetchExpenses(filters);
    setExpenses(data);
    setLoaded(true);
  }, [filters, setExpenses, setLoaded]);

  if (!isLoaded) {
    refresh();
  }

  const filtered = filters ? db.fetchExpenses(filters) : expenses;

  return {
    data: filtered,
    isLoading: !isLoaded,
    refetch: refresh,
  };
}

export function useCreateExpense() {
  const { setExpenses } = useAppStore();

  const create = useCallback((data: {
    amount: number;
    description: string;
    category: string;
    date: string;
    notes?: string;
  }) => {
    db.createExpense(data);
    setExpenses(db.fetchExpenses());
    toast.success('تمت إضافة المصروف بنجاح');
    return true;
  }, [setExpenses]);

  return { mutate: create, isPending: false };
}

export function useUpdateExpense() {
  const { setExpenses } = useAppStore();

  const update = useCallback((data: {
    id: string;
    amount?: number;
    description?: string;
    category?: string;
    date?: string;
    notes?: string;
  }) => {
    db.updateExpense(data);
    setExpenses(db.fetchExpenses());
    toast.success('تم تحديث المصروف بنجاح');
    return true;
  }, [setExpenses]);

  return { mutate: update, isPending: false };
}

export function useDeleteExpense() {
  const { setExpenses } = useAppStore();

  const remove = useCallback((id: string) => {
    db.deleteExpense(id);
    setExpenses(db.fetchExpenses());
    toast.success('تم حذف المصروف بنجاح');
    return true;
  }, [setExpenses]);

  return { mutate: remove, isPending: false };
}

export function useSeedData() {
  const { setExpenses, isLoaded } = useAppStore();

  const seed = useCallback(() => {
    const wasSeeded = db.seedIfEmpty();
    if (wasSeeded) {
      setExpenses(db.fetchExpenses());
      toast.success('تم تحميل البيانات التجريبية بنجاح');
    } else {
      setExpenses(db.fetchExpenses());
    }
    return wasSeeded;
  }, [setExpenses]);

  return { mutate: seed, isSuccess: isLoaded };
}
