'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Expense, ExpenseFilters } from '@/types';

async function fetchExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.fromDate) params.set('fromDate', filters.fromDate);
  if (filters?.toDate) params.set('toDate', filters.toDate);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.sortBy) params.set('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder);

  const response = await fetch(`/api/expenses?${params.toString()}`);
  if (!response.ok) {
    throw new Error('فشل في تحميل المصاريف');
  }
  return response.json();
}

async function createExpense(data: {
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
}): Promise<Expense> {
  const response = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'فشل في إنشاء المصروف');
  }
  return response.json();
}

async function updateExpense(data: {
  id: string;
  amount?: number;
  description?: string;
  category?: string;
  date?: string;
  notes?: string;
}): Promise<Expense> {
  const response = await fetch('/api/expenses', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('فشل في تحديث المصروف');
  }
  return response.json();
}

async function deleteExpense(id: string): Promise<void> {
  const response = await fetch(`/api/expenses?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('فشل في حذف المصروف');
  }
}

export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => fetchExpenses(filters),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
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
    mutationFn: updateExpense,
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
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('تم حذف المصروف بنجاح');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
