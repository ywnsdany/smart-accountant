'use client';

import { useAppStore } from '@/stores/app-store';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Receipt, Brain } from 'lucide-react';
import type { PageType } from '@/types';

const navItems: { key: PageType; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { key: 'expenses', label: 'المصاريف', icon: Receipt },
  { key: 'insights', label: 'التحليل الذكي', icon: Brain },
];

export function AppSidebar() {
  const { currentPage, setCurrentPage, setSidebarOpen } = useAppStore();

  const handleNavClick = (page: PageType) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-lg font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            المحاسب الذكي
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={currentPage === item.key}
                    onClick={() => handleNavClick(item.key)}
                    tooltip={item.label}
                  >
                    <item.icon className="size-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
