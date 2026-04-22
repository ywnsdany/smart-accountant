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
  const seedMutation = useSeedData();
  const [showSplash, setShowSplash] = useState(true);

  const dismissSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    seedMutation.mutate();
  }, []);

  useEffect(() => {
    // Dismiss splash when seed is done + minimum time passed
    const minSplashTime = new Promise(resolve => setTimeout(resolve, 2200));
    const seedDone = new Promise(resolve => {
      if (seedMutation.isIdle || seedMutation.isSuccess) {
        resolve(true);
      }
    });

    const checkSeed = () => {
      if (seedMutation.isSuccess || seedMutation.isIdle) {
        dismissSplash();
      }
    };

    Promise.race([minSplashTime, seedDone]).then(() => {
      checkSeed();
    });

    // Also check when mutation status changes
    if (seedMutation.isSuccess) {
      const timer = setTimeout(dismissSplash, 2200);
      return () => clearTimeout(timer);
    }

    // Safety timeout
    const safetyTimer = setTimeout(dismissSplash, 4000);
    return () => clearTimeout(safetyTimer);
  }, [seedMutation.isSuccess, seedMutation.isIdle, dismissSplash]);

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
