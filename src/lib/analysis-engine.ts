import { format, subMonths, subDays, startOfMonth, endOfMonth, differenceInDays, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { Expense, SpendingInsight, SpendingPattern, CategoryStat } from '@/types';

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const ARABIC_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export function analyzeSpendingPatterns(expenses: Expense[]): SpendingPattern[] {
  if (expenses.length === 0) return [];

  const patterns: SpendingPattern[] = [];

  // Day of week analysis
  const dayTotals: number[] = new Array(7).fill(0);
  expenses.forEach(exp => {
    const day = new Date(exp.date).getDay();
    dayTotals[day] += exp.amount;
  });
  const maxDay = dayTotals.indexOf(Math.max(...dayTotals));
  patterns.push({
    label: 'أكثر يوم إنفاق',
    value: ARABIC_DAYS[maxDay],
    detail: `${formatCurrency(dayTotals[maxDay])} إجمالي`
  });

  const minDay = dayTotals.indexOf(Math.min(...dayTotals));
  patterns.push({
    label: 'أقل يوم إنفاق',
    value: ARABIC_DAYS[minDay],
    detail: `${formatCurrency(dayTotals[minDay])} إجمالي`
  });

  // Weekend vs Weekday
  const weekendTotal = expenses
    .filter(exp => { const d = new Date(exp.date).getDay(); return d === 5 || d === 6; })
    .reduce((sum, exp) => sum + exp.amount, 0);
  const weekdayTotal = expenses
    .filter(exp => { const d = new Date(exp.date).getDay(); return d !== 5 && d !== 6; })
    .reduce((sum, exp) => sum + exp.amount, 0);

  if (weekendTotal > weekdayTotal) {
    patterns.push({
      label: 'نمط عطلة نهاية الأسبوع',
      value: 'أعلى إنفاق في العطلات',
      detail: `بنسبة ${Math.round(((weekendTotal / (weekendTotal + weekdayTotal)) - 0.5) * 200)}% أكثر`
    });
  }

  // Monthly averages
  const monthTotals: Record<string, number> = {};
  expenses.forEach(exp => {
    const monthKey = format(new Date(exp.date), 'yyyy-MM');
    monthTotals[monthKey] = (monthTotals[monthKey] || 0) + exp.amount;
  });
  const monthKeys = Object.keys(monthTotals).sort();
  if (monthKeys.length > 0) {
    const avgMonthly = Object.values(monthTotals).reduce((a, b) => a + b, 0) / monthKeys.length;
    patterns.push({
      label: 'متوسط الإنفاق الشهري',
      value: formatCurrency(avgMonthly),
      detail: `خلال ${monthKeys.length} شهر`
    });
  }

  // Weekly average
  const firstDate = new Date(Math.min(...expenses.map(e => new Date(e.date).getTime())));
  const lastDate = new Date(Math.max(...expenses.map(e => new Date(e.date).getTime())));
  const totalDays = Math.max(1, differenceInDays(lastDate, firstDate) + 1);
  const weeksCount = Math.max(1, totalDays / 7);
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  patterns.push({
    label: 'متوسط الإنفاق الأسبوعي',
    value: formatCurrency(totalSpent / weeksCount),
    detail: `${Math.round(weeksCount)} أسبوع`
  });

  return patterns;
}

export function generateInsights(expenses: Expense[]): SpendingInsight[] {
  const insights: SpendingInsight[] = [];
  if (expenses.length === 0) return insights;

  const now = new Date();
  const thisMonth = format(now, 'yyyy-MM');
  const lastMonth = format(subMonths(now, 1), 'yyyy-MM');

  const thisMonthExpenses = expenses.filter(exp => format(new Date(exp.date), 'yyyy-MM') === thisMonth);
  const lastMonthExpenses = expenses.filter(exp => format(new Date(exp.date), 'yyyy-MM') === lastMonth);

  const thisMonthTotal = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

  // Monthly spending trend
  if (lastMonthTotal > 0) {
    const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    if (change > 20) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'ارتفاع في المصاريف',
        description: `مصاريفك ارتفعت بنسبة ${Math.round(change)}% مقارنة بالشهر الماضي. حاول مراجعة نفقاتك.`
      });
    } else if (change < -10) {
      insights.push({
        type: 'positive',
        icon: '✅',
        title: 'تحسن في الإنفاق',
        description: `أحسنت! مصاريفك انخفضت بنسبة ${Math.abs(Math.round(change))}% مقارنة بالشهر الماضي.`
      });
    } else {
      insights.push({
        type: 'info',
        icon: '📊',
        title: 'استقرار مالي',
        description: `مصاريفك مستقرة مقارنة بالشهر الماضي بتغير ${Math.abs(Math.round(change))}%.`
      });
    }
  }

  // Category analysis
  const categoryTotals: Record<string, number> = {};
  thisMonthExpenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const lastCategoryTotals: Record<string, number> = {};
  lastMonthExpenses.forEach(exp => {
    lastCategoryTotals[exp.category] = (lastCategoryTotals[exp.category] || 0) + exp.amount;
  });

  // Check for category spikes
  Object.entries(categoryTotals).forEach(([cat, total]) => {
    const lastTotal = lastCategoryTotals[cat] || 0;
    if (lastTotal > 0) {
      const change = ((total - lastTotal) / lastTotal) * 100;
      if (change > 30) {
        insights.push({
          type: 'warning',
          icon: '🔺',
          title: `ارتفاع في فئة "${cat}"`,
          description: `مصاريف ${cat} ارتفعت بنسبة ${Math.round(change)}% هذا الشهر (${formatCurrency(total - lastTotal)} زيادة).`
        });
      }
    }
  });

  // Most spent category
  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  if (categories.length > 0) {
    const [topCat, topAmount] = categories[0];
    const percentage = (topAmount / thisMonthTotal) * 100;
    insights.push({
      type: 'info',
      icon: '🏷️',
      title: 'أعلى فئة إنفاق',
      description: `"${topCat}" تمثل ${Math.round(percentage)}% من إجمالي مصاريفك هذا الشهر (${formatCurrency(topAmount)}).`
    });
  }

  // Good savings category
  const smallestCat = categories[categories.length - 1];
  if (smallestCat && categories.length > 2) {
    insights.push({
      type: 'positive',
      icon: '✅',
      title: 'توفير جيد',
      description: `أنت تنفق أقل في فئة "${smallestCat[0]}" (${formatCurrency(smallestCat[1])}). حافظ على ذلك!`
    });
  }

  // Transaction frequency
  const avgTransaction = thisMonthTotal / Math.max(1, thisMonthExpenses.length);
  if (avgTransaction > 500) {
    insights.push({
      type: 'warning',
      icon: '💡',
      title: 'متوسط عملية مرتفع',
      description: `متوسط الإنفاق لكل عملية هو ${formatCurrency(avgTransaction)}. حاول البحث عن بدائل أرخص.`
    });
  }

  return insights;
}

export function getSavingsTips(expenses: Expense[]): SpendingInsight[] {
  const tips: SpendingInsight[] = [];
  if (expenses.length === 0) return tips;

  const now = new Date();
  const thisMonth = format(now, 'yyyy-MM');
  const thisMonthExpenses = expenses.filter(exp => format(new Date(exp.date), 'yyyy-MM') === thisMonth);
  const totalThisMonth = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);

  const categoryTotals: Record<string, number> = {};
  thisMonthExpenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const categories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  // Top category reduction tip
  if (categories.length > 0) {
    const [topCat, topAmount] = categories[0];
    const potentialSaving = topAmount * 0.2;
    tips.push({
      type: 'tip',
      icon: '💡',
      title: 'قلّل أعلى فئة إنفاق',
      description: `بتقليل مصاريف "${topCat}" بنسبة 20% يمكنك توفير ${formatCurrency(potentialSaving)} شهرياً.`
    });
  }

  // Entertainment reduction
  const entertainment = categoryTotals['🎬 ترفيه'] || 0;
  if (entertainment > totalThisMonth * 0.15) {
    tips.push({
      type: 'tip',
      icon: '🎬',
      title: 'وفر في الترفيه',
      description: `مصاريف الترفيه تمثل نسبة عالية. حاول البحث عن أنشطة مجانية أو أقل تكلفة لتوفير ${formatCurrency(entertainment * 0.3)}.`
    });
  }

  // Food reduction
  const food = categoryTotals['🍔 طعام وشراب'] || 0;
  if (food > totalThisMonth * 0.3) {
    tips.push({
      type: 'tip',
      icon: '🍳',
      title: 'خطط وجباتك',
      description: `مصاريف الطعام مرتفعة. خطط لوجباتك الأسبوعية وطبخ في المنزل لتوفير ${formatCurrency(food * 0.25)}.`
    });
  }

  // Transportation tip
  const transport = categoryTotals['🚗 مواصلات'] || 0;
  if (transport > totalThisMonth * 0.1) {
    tips.push({
      type: 'tip',
      icon: '🚌',
      title: 'وفر في المواصلات',
      description: `جرب استخدام المواصلات العامة أو مشاركة السيارات لتوفير ${formatCurrency(transport * 0.3)} شهرياً.`
    });
  }

  // Shopping tip
  const shopping = categoryTotals['🛒 تسوق'] || 0;
  if (shopping > totalThisMonth * 0.1) {
    tips.push({
      type: 'tip',
      icon: '🏷️',
      title: 'استراتيجية التسوق الذكي',
      description: `انتظر العروض والخصومات قبل الشراء. يمكنك توفير ${formatCurrency(shopping * 0.2)} بشراء الأشياء المطلوبة فقط.`
    });
  }

  // General savings goal tip
  const dailyAverage = totalThisMonth / Math.max(1, differenceInDays(now, startOfMonth(now)) + 1);
  tips.push({
    type: 'tip',
    icon: '🎯',
    title: 'ضع ميزانية يومية',
    description: `متوسط إنفاقك اليومي ${formatCurrency(dailyAverage)}. حدد ميزانية يومية أقل بـ 10% لتوفير ${formatCurrency(dailyAverage * 0.1 * 30)} شهرياً.`
  });

  // Bills optimization
  const bills = categoryTotals['💡 فواتير'] || 0;
  if (bills > 0) {
    tips.push({
      type: 'tip',
      icon: '⚡',
      title: 'قلّل استهلاك الطاقة',
      description: `مراجعة فواتيرك واقتراح خطط توفير يمكن أن يقلل مصاريف الفواتير بنسبة 10-15%.`
    });
  }

  return tips;
}

export function getCategoryStats(expenses: Expense[]): CategoryStat[] {
  if (expenses.length === 0) return [];

  const categoryTotals: Record<string, { total: number; count: number }> = {};
  expenses.forEach(exp => {
    if (!categoryTotals[exp.category]) {
      categoryTotals[exp.category] = { total: 0, count: 0 };
    }
    categoryTotals[exp.category].total += exp.amount;
    categoryTotals[exp.category].count += 1;
  });

  const grandTotal = expenses.reduce((s, e) => s + e.amount, 0);

  return Object.entries(categoryTotals)
    .map(([category, { total, count }]) => ({
      category,
      total,
      count,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function getSpendingByDay(expenses: Expense[], days: number = 30) {
  const result: { date: string; amount: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTotal = expenses
      .filter(exp => format(new Date(exp.date), 'yyyy-MM-dd') === dateStr)
      .reduce((sum, exp) => sum + exp.amount, 0);

    result.push({
      date: format(date, 'dd/MM'),
      amount: dayTotal,
    });
  }

  return result;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ar-SA').format(num);
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMMM yyyy', { locale: ar });
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'dd/MM/yyyy');
}

export const CATEGORY_COLORS: Record<string, string> = {
  '🍔 طعام وشراب': '#f97316',
  '🚗 مواصلات': '#3b82f6',
  '🏠 سكن': '#8b5cf6',
  '🛒 تسوق': '#ec4899',
  '💊 صحة': '#ef4444',
  '🎬 ترفيه': '#f59e0b',
  '📚 تعليم': '#06b6d4',
  '💡 فواتير': '#6366f1',
  '👕 ملابس': '#d946ef',
  '📱 تقنية': '#14b8a6',
  '🎁 هدايا': '#f43f5e',
  '✈️ سفر': '#0ea5e9',
  '📦 أخرى': '#78716c',
};

export const EXPENSE_CATEGORIES = [
  '🍔 طعام وشراب',
  '🚗 مواصلات',
  '🏠 سكن',
  '🛒 تسوق',
  '💊 صحة',
  '🎬 ترفيه',
  '📚 تعليم',
  '💡 فواتير',
  '👕 ملابس',
  '📱 تقنية',
  '🎁 هدايا',
  '✈️ سفر',
  '📦 أخرى',
];
