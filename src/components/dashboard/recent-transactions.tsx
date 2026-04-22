'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDateShort, CATEGORY_COLORS, formatCurrency } from '@/lib/analysis-engine';
import { useAppStore } from '@/stores/app-store';
import { ArrowLeft, Wallet } from 'lucide-react';
import type { Expense } from '@/types';
import { motion } from 'framer-motion';

interface RecentTransactionsProps {
  expenses: Expense[];
}

export function RecentTransactions({ expenses }: RecentTransactionsProps) {
  const { setCurrentPage } = useAppStore();
  const recent = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">آخر العمليات</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage('expenses')}
            className="text-sm text-primary"
          >
            عرض الكل
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Wallet className="h-12 w-12 mb-3 opacity-40" />
              <p className="text-sm">لا توجد عمليات بعد</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-3">
                {recent.map((expense, i) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: `${CATEGORY_COLORS[expense.category] || '#78716c'}20` }}
                      >
                        {expense.category.split(' ')[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDateShort(expense.date)}</p>
                      </div>
                    </div>
                    <div className="text-left flex flex-col items-end gap-1 shrink-0">
                      <span className="text-sm font-semibold text-destructive">
                        -{formatCurrency(expense.amount)}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[expense.category] || '#78716c'}15`,
                          color: CATEGORY_COLORS[expense.category] || '#78716c',
                        }}
                      >
                        {expense.category.split(' ').slice(1).join(' ')}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
