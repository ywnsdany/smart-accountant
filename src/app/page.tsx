'use client';

import { useAppStore } from '@/stores/app-store';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { ExpensesPage } from '@/components/expenses/expenses-page';
import { InsightsPage } from '@/components/insights/insights-page';
import { AnimatePresence, motion } from 'framer-motion';

const pageComponents = {
  dashboard: DashboardPage,
  expenses: ExpensesPage,
  insights: InsightsPage,
};

const pageTitles = {
  dashboard: 'لوحة التحكم',
  expenses: 'المصاريف',
  insights: 'التحليل الذكي',
};

export default function Home() {
  const { currentPage } = useAppStore();
  const PageComponent = pageComponents[currentPage];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <PageComponent />
          </motion.div>
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  );
}
