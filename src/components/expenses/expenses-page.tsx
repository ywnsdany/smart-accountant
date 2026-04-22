'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExpenseFormDialog } from './expense-form-dialog';
import { ExpenseFiltersBar } from './expense-filters';
import { useExpenses, useDeleteExpense } from '@/hooks/use-expenses';
import { useAppStore } from '@/stores/app-store';
import { formatCurrency, formatDateShort, CATEGORY_COLORS } from '@/lib/analysis-engine';
import { Plus, Pencil, Trash2, Wallet, AlertTriangle } from 'lucide-react';
import type { Expense, ExpenseFilters } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export function ExpensesPage() {
  const { searchQuery } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const deleteMutation = useDeleteExpense();

  const filters: ExpenseFilters = useMemo(() => {
    const [sortField, sortOrder] = sortBy.split('-') as [string, string];
    return {
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      search: searchFilter || searchQuery || undefined,
      sortBy: sortField as 'date' | 'amount',
      sortOrder: sortOrder as 'asc' | 'desc',
    };
  }, [categoryFilter, searchFilter, searchQuery, sortBy]);

  const { data: expenses = [], isLoading } = useExpenses(filters);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingExpense(null);
  };

  const handleAddNew = () => {
    setEditingExpense(null);
    setDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 pb-0">
        <div>
          <h1 className="text-2xl font-bold">المصاريف</h1>
          <p className="text-muted-foreground text-sm mt-1">
            إدارة وتتبع جميع مصاريفك
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة مصروف
        </Button>
      </div>

      {/* Filters */}
      <ExpenseFiltersBar
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        search={searchFilter}
        onSearchChange={setSearchFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Expense List */}
      <div className="flex-1 px-4 md:px-6 pb-4 md:pb-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Wallet className="h-16 w-16 mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">لا توجد مصاريف</p>
            <p className="text-sm">اضغط على &quot;إضافة مصروف&quot; لإضافة أول مصروف</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(100vh-300px)]">
            <div className="space-y-2">
              <AnimatePresence>
                {expenses.map((expense, i) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div
                              className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                              style={{
                                backgroundColor: `${CATEGORY_COLORS[expense.category] || '#78716c'}15`,
                              }}
                            >
                              {expense.category.split(' ')[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{expense.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="secondary"
                                  className="text-[10px]"
                                  style={{
                                    backgroundColor: `${CATEGORY_COLORS[expense.category] || '#78716c'}15`,
                                    color: CATEGORY_COLORS[expense.category] || '#78716c',
                                  }}
                                >
                                  {expense.category.split(' ').slice(1).join(' ')}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDateShort(expense.date)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 mr-4">
                            <span className="text-base font-bold text-destructive">
                              {formatCurrency(expense.amount)}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(expense)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(expense.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {expense.notes && (
                          <p className="text-xs text-muted-foreground mt-2 pr-13">
                            {expense.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Form Dialog */}
      <ExpenseFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        expense={editingExpense}
      />
    </motion.div>
  );
}
