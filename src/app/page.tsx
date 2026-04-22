'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/stores/app-store';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { ExpensesPage } from '@/components/expenses/expenses-page';
import { InsightsPage } from '@/components/insights/insights-page';
import { SplashScreen } from '@/components/splash-screen';
import { AnimatePresence, motion } from 'framer-motion';
import { useSeedData } from '@/hooks/use-expenses';

const pageComponents = {
  dashboard: DashboardPage,
  expenses: ExpensesPage,
  insights: InsightsPage,
};

export default function Home() {
  const { currentPage } = useAppStore();
  const PageComponent = pageComponents[currentPage];
  const seed = useSeedData();
  const [showSplash, setShowSplash] = useState(true);

  const dismissSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    seed.mutate();
  }, []);

  useEffect(() => {
    if (seed.isSuccess) {
      const timer = setTimeout(dismissSplash, 2000);
      return () => clearTimeout(timer);
    }
  }, [seed.isSuccess, dismissSplash]);

  useEffect(() => {
    const safetyTimer = setTimeout(dismissSplash, 3500);
    return () => clearTimeout(safetyTimer);
  }, [dismissSplash]);

  return (
    <>
      <SplashScreen visible={showSplash} />
      <AnimatePresence mode="wait">
        {!showSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-screen"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
