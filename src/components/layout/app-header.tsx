'use client';

import { useTheme } from 'next-themes';
import { useAppStore } from '@/stores/app-store';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sun, Moon } from 'lucide-react';

export function AppHeader() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { searchQuery, setSearchQuery, setSidebarOpen } = useAppStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger onClick={() => setSidebarOpen(true)} />
        <span className="text-lg font-bold text-foreground">💰 المحاسب الذكي</span>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <SidebarTrigger />
      </div>

      <div className="flex-1 max-w-md">
        <div className="relative">
          <Input
            placeholder="ابحث في المصاريف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pr-4 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">تبديل الوضع</span>
        </Button>
      </div>
    </header>
  );
}
