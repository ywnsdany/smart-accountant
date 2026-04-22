'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Expense, ExpenseFilters } from '@/types';
import * as db from '@/lib/db-client';

export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => db.fetchExpenses(filters),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: db.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('تمت إضافة المصروف بنجاح');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: db.updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('تم تحديث المصروف بنجاح');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: db.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('تم حذف المصروف بنجاح');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useSeedData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: db.seedIfEmpty,
    onSuccess: (wasSeeded) => {
      if (wasSeeded) {
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
        toast.success('تم تحميل البيانات التجريبية بنجاح');
      }
    },
  });
}
