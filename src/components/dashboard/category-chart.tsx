'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategoryStats, CATEGORY_COLORS } from '@/lib/analysis-engine';
import type { Expense } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface CategoryChartProps {
  expenses: Expense[];
}

export function CategoryChart({ expenses }: CategoryChartProps) {
  const categoryStats = getCategoryStats(expenses);
  const data = categoryStats.map(stat => ({
    name: stat.category,
    value: Math.round(stat.total),
    percentage: Math.round(stat.percentage),
  }));

  const COLORS = data.map(d => CATEGORY_COLORS[d.name] || '#78716c');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">توزيع المصاريف حسب الفئة</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-[280px] text-muted-foreground">
              لا توجد بيانات لعرضها
            </div>
          ) : (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
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
                  <Legend
                    layout="vertical"
                    align="left"
                    verticalAlign="middle"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', direction: 'rtl' }}
                    formatter={(value: string) => <span className="text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
