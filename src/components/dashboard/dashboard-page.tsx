'use client';

import { SummaryCards } from './summary-cards';
import { SpendingOverTimeChart } from './spending-over-time-chart';
import { CategoryChart } from './category-chart';
import { RecentTransactions } from './recent-transactions';
import { Skeleton } from '@/components/ui/skeleton';
import { useExpenses } from '@/hooks/use-expenses';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const { data: expenses = [], isLoading } = useExpenses();

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[350px] rounded-xl" />
          <Skeleton className="h-[350px] rounded-xl" />
        </div>
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-4 md:p-6"
    >
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground text-sm mt-1">نظرة عامة على وضعك المالي</p>
      </div>

      <SummaryCards expenses={expenses} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpendingOverTimeChart expenses={expenses} />
        <CategoryChart expenses={expenses} />
      </div>

      <RecentTransactions expenses={expenses} />
    </motion.div>
  );
}
