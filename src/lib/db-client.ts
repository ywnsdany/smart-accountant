'use client';

import type { Expense, ExpenseFilters } from '@/types';
import { subMonths, format } from 'date-fns';

const STORAGE_KEY = 'smart_accountant_expenses';
const SEEDED_KEY = 'smart_accountant_seeded';

function loadExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExpenses(expenses: Expense[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function fetchExpenses(filters?: ExpenseFilters): Expense[] {
  let expenses = loadExpenses();

  if (filters?.category) {
    expenses = expenses.filter(e => e.category === filters.category);
  }

  if (filters?.fromDate) {
    expenses = expenses.filter(e => e.date >= filters.fromDate!);
  }

  if (filters?.toDate) {
    expenses = expenses.filter(e => e.date <= filters.toDate!);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    expenses = expenses.filter(
      e =>
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.notes && e.notes.toLowerCase().includes(q))
    );
  }

  const sortBy = filters?.sortBy || 'date';
  const sortOrder = filters?.sortOrder || 'desc';

  expenses.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'date') {
      cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'amount') {
      cmp = a.amount - b.amount;
    }
    return sortOrder === 'desc' ? -cmp : cmp;
  });

  return expenses;
}

export function createExpense(data: {
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
}): Expense {
  const now = new Date().toISOString();
  const expense: Expense = {
    id: crypto.randomUUID(),
    amount: data.amount,
    description: data.description,
    category: data.category,
    date: data.date,
    notes: data.notes || null,
    createdAt: now,
    updatedAt: now,
  };
  const all = loadExpenses();
  all.push(expense);
  saveExpenses(all);
  return expense;
}

export function updateExpense(data: {
  id: string;
  amount?: number;
  description?: string;
  category?: string;
  date?: string;
  notes?: string;
}): Expense {
  const all = loadExpenses();
  const index = all.findIndex(e => e.id === data.id);
  if (index === -1) throw new Error('المصروف غير موجود');

  const existing = all[index];
  all[index] = {
    ...existing,
    ...data,
    notes: data.notes !== undefined ? (data.notes || null) : existing.notes,
    updatedAt: new Date().toISOString(),
  };
  saveExpenses(all);
  return all[index];
}

export function deleteExpense(id: string): void {
  const all = loadExpenses();
  const filtered = all.filter(e => e.id !== id);
  if (filtered.length === all.length) throw new Error('المصروف غير موجود');
  saveExpenses(filtered);
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const SAMPLE_TEMPLATES = [
  { description: 'غداء في المطعم', category: '🍔 طعام وشراب', amountRange: [30, 120] },
  { description: 'شاي وقهوة', category: '🍔 طعام وشراب', amountRange: [10, 35] },
  { description: 'مواد بقالة', category: '🍔 طعام وشراب', amountRange: [80, 250] },
  { description: 'طلب وجبات', category: '🍔 طعام وشراب', amountRange: [25, 80] },
  { description: 'فطور صباحي', category: '🍔 طعام وشراب', amountRange: [15, 45] },
  { description: 'عشاء عائلي', category: '🍔 طعام وشراب', amountRange: [100, 300] },
  { description: 'تنقل أوبر', category: '🚗 مواصلات', amountRange: [15, 50] },
  { description: 'تزويد بنزين', category: '🚗 مواصلات', amountRange: [80, 200] },
  { description: 'إيجار الشهر', category: '🏠 سكن', amountRange: [1500, 3000] },
  { description: 'فاتورة الكهرباء', category: '💡 فواتير', amountRange: [150, 400] },
  { description: 'فاتورة الإنترنت', category: '💡 فواتير', amountRange: [100, 250] },
  { description: 'فاتورة الماء', category: '💡 فواتير', amountRange: [30, 100] },
  { description: 'تسوق ملابس', category: '🛒 تسوق', amountRange: [100, 500] },
  { description: 'مشتريات السوبرماركت', category: '🛒 تسوق', amountRange: [50, 200] },
  { description: 'زيارة طبيب', category: '💊 صحة', amountRange: [100, 500] },
  { description: 'أدوية', category: '💊 صحة', amountRange: [20, 150] },
  { description: 'تذاكر سينما', category: '🎬 ترفيه', amountRange: [30, 100] },
  { description: 'اشتراك نتفليكس', category: '🎬 ترفيه', amountRange: [30, 60] },
  { description: 'نادي رياضي', category: '🎬 ترفيه', amountRange: [100, 300] },
  { description: 'كتب تعليمية', category: '📚 تعليم', amountRange: [30, 150] },
  { description: 'دورة تدريبية', category: '📚 تعليم', amountRange: [200, 800] },
  { description: 'قميص جديد', category: '👕 ملابس', amountRange: [50, 250] },
  { description: 'حذاء رياضي', category: '👕 ملابس', amountRange: [150, 500] },
  { description: 'شحن هاتف', category: '📱 تقنية', amountRange: [20, 50] },
  { description: 'إكسسوار هاتف', category: '📱 تقنية', amountRange: [30, 100] },
  { description: 'هدية عيد ميلاد', category: '🎁 هدايا', amountRange: [50, 300] },
  { description: 'حجز فندق', category: '✈️ سفر', amountRange: [200, 800] },
  { description: 'تذاكر طيران', category: '✈️ سفر', amountRange: [300, 1500] },
];

export function generateSeedData(): Expense[] {
  const now = new Date();
  const expenses: Expense[] = [];

  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const baseDate = subMonths(now, monthOffset);
    const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
    const maxDay = monthOffset === 0 ? now.getDate() : daysInMonth;
    const entriesThisMonth = randomBetween(10, 16);

    for (let i = 0; i < entriesThisMonth; i++) {
      const template = SAMPLE_TEMPLATES[Math.floor(Math.random() * SAMPLE_TEMPLATES.length)];
      const day = randomBetween(1, maxDay);
      const hour = randomBetween(8, 22);
      const minute = randomBetween(0, 59);
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), day, hour, minute);
      const iso = date.toISOString();

      expenses.push({
        id: crypto.randomUUID(),
        description: template.description,
        category: template.category,
        amount: randomBetween(template.amountRange[0], template.amountRange[1]),
        date: format(date, 'yyyy-MM-dd'),
        notes: null,
        createdAt: iso,
        updatedAt: iso,
      });
    }
  }

  saveExpenses(expenses);
  return expenses;
}

export function isSeeded(): boolean {
  try {
    return localStorage.getItem(SEEDED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markAsSeeded(): void {
  try {
    localStorage.setItem(SEEDED_KEY, 'true');
  } catch {
    // ignore
  }
}

export function seedIfEmpty(): boolean {
  if (isSeeded()) return false;

  const existing = loadExpenses();
  if (existing.length > 0) {
    markAsSeeded();
    return false;
  }

  generateSeedData();
  markAsSeeded();
  return true;
}
