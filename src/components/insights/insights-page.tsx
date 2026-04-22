'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  useExpenses,
} from '@/hooks/use-expenses';
import {
  analyzeSpendingPatterns,
  generateInsights,
  getSavingsTips,
  getCategoryStats,
  CATEGORY_COLORS,
  formatCurrency,
} from '@/lib/analysis-engine';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  DollarSign,
  Activity,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const insightIcons: Record<string, React.ElementType> = {
  warning: AlertTriangle,
  positive: CheckCircle2,
  info: Info,
  tip: Lightbulb,
};

const insightColors: Record<string, string> = {
  warning: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30',
  positive: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30',
  info: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30',
  tip: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30',
};

const insightTextColors: Record<string, string> = {
  warning: 'text-red-700 dark:text-red-400',
  positive: 'text-green-700 dark:text-green-400',
  info: 'text-blue-700 dark:text-blue-400',
  tip: 'text-amber-700 dark:text-amber-400',
};

export function InsightsPage() {
  const { data: expenses = [], isLoading } = useExpenses();

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  const patterns = analyzeSpendingPatterns(expenses);
  const insights = generateInsights(expenses);
  const tips = getSavingsTips(expenses);
  const categoryStats = getCategoryStats(expenses);

  // Calculate key metrics
  const now = new Date();
  const thisMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  });
  const lastMonthTotal = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

  const trendPercent = lastMonthTotal > 0
    ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)
    : 0;

  const isTrendUp = trendPercent > 0;

  // Most active spending day
  const dayTotals: Record<string, number> = {};
  expenses.forEach(exp => {
    const dayName = new Date(exp.date).toLocaleDateString('ar-SA', { weekday: 'long' });
    dayTotals[dayName] = (dayTotals[dayName] || 0) + exp.amount;
  });
  const mostActiveDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];

  // Category bar chart data
  const barData = categoryStats.slice(0, 8).map(stat => ({
    name: stat.category.split(' ').slice(1).join(' '),
    amount: Math.round(stat.total),
    fill: CATEGORY_COLORS[stat.category] || '#78716c',
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-4 md:p-6"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">التحليل الذكي</h1>
            <p className="text-muted-foreground text-sm mt-0.5">تحليل متقدم لأنماط إنفاقك ونصائح ذكية</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">اتجاه الإنفاق الشهري</p>
                  <div className="flex items-center gap-2 mt-1">
                    {isTrendUp ? (
                      <TrendingUp className="h-5 w-5 text-red-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-green-500" />
                    )}
                    <span className={`text-xl font-bold ${isTrendUp ? 'text-red-500' : 'text-green-500'}`}>
                      {trendPercent > 0 ? '+' : ''}{trendPercent}%
                    </span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي هذا الشهر</p>
                  <p className="text-xl font-bold mt-1">{formatCurrency(thisMonthTotal)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">أكثر يوم إنفاق</p>
                  <p className="text-xl font-bold mt-1">{mostActiveDay?.[0] || '-'}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Spending Patterns */}
      {patterns.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">أنماط الإنفاق</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {patterns.map((pattern, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">{pattern.label}</p>
                    <p className="text-sm font-semibold mt-0.5">{String(pattern.value)}</p>
                    {pattern.detail && (
                      <p className="text-xs text-muted-foreground mt-0.5">{pattern.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">رؤى ذكية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.map((insight, i) => {
                  const Icon = insightIcons[insight.type] || Info;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className={`p-4 rounded-xl border ${insightColors[insight.type]}`}
                    >
                      <div className="flex gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${insightTextColors[insight.type]}`} />
                        <div>
                          <p className={`text-sm font-semibold ${insightTextColors[insight.type]}`}>
                            {insight.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Category Breakdown Chart */}
      {barData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">توزيع الفئات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                        direction: 'rtl',
                      }}
                      formatter={(value: number) => [`${value.toLocaleString('ar-SA')} ر.س`, 'المبلغ']}
                    />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Savings Tips */}
      {tips.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                نصائح لتوفير المال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-2xl shrink-0">{tip.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{tip.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{tip.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && expenses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Brain className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg font-medium mb-1">لا توجد بيانات كافية</p>
          <p className="text-sm">أضف بعض المصاريف لعرض التحليل الذكي</p>
        </div>
      )}
    </motion.div>
  );
}
