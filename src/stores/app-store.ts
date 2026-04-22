import { create } from 'zustand';
import type { PageType, Expense } from '@/types';

interface AppState {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  isLoaded: boolean;
  setLoaded: (loaded: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  expenses: [],
  setExpenses: (expenses) => set({ expenses }),
  isLoaded: false,
  setLoaded: (loaded) => set({ isLoaded: loaded }),
}));
