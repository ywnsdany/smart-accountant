'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { EXPENSE_CATEGORIES } from '@/lib/analysis-engine';
import { Search, ArrowUpDown } from 'lucide-react';

interface ExpenseFiltersBarProps {
  category: string;
  onCategoryChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function ExpenseFiltersBar({
  category,
  onCategoryChange,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
}: ExpenseFiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ابحث في المصاريف..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-9 h-9 text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue placeholder="جميع الفئات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {EXPENSE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px] h-9 text-sm">
            <ArrowUpDown className="h-4 w-4 ml-1" />
            <SelectValue placeholder="ترتيب حسب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">الأحدث أولاً</SelectItem>
            <SelectItem value="date-asc">الأقدم أولاً</SelectItem>
            <SelectItem value="amount-desc">المبلغ الأعلى</SelectItem>
            <SelectItem value="amount-asc">المبلغ الأقل</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
