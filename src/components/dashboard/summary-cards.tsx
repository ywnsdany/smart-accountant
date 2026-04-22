'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Receipt, TrendingUp, Calculator } from 'lucide-react';
import { formatCurrency, formatNumber, getCategoryStats } from '@/lib/analysis-engine';
import type { Expense } from '@/types';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SummaryCardsProps {
  expenses: Expense[];
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}
      {suffix === 'SAR' ? formatCurrency(displayValue) : formatNumber(displayValue)}
      {suffix !== 'SAR' && suffix}
    </span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

export function SummaryCards({ expenses }: SummaryCardsProps) {
  const now = new Date();
  const thisMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const transactionCount = thisMonthExpenses.length;

  const categoryStats = getCategoryStats(thisMonthExpenses);
  const topCategory = categoryStats.length > 0 ? categoryStats[0].category : 'لا يوجد';

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = Math.min(now.getDate(), daysInMonth);
  const avgDaily = currentDay > 0 ? totalThisMonth / currentDay : 0;

  const cards = [
    {
      title: 'إجمالي المصاريف',
      value: Math.round(totalThisMonth),
      prefix: '',
      suffix: 'SAR',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      subtitle: 'هذا الشهر',
    },
    {
      title: 'عدد العمليات',
      value: transactionCount,
      prefix: '',
      suffix: 'عملية',
      icon: Receipt,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      subtitle: 'هذا الشهر',
    },
    {
      title: 'أعلى فئة صرف',
      value: 0,
      textValue: topCategory,
      prefix: '',
      suffix: '',
      icon: TrendingUp,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      subtitle: categoryStats.length > 0 ? `${Math.round(categoryStats[0].percentage)}% من المصاريف` : '',
    },
    {
      title: 'متوسط الإنفاق اليومي',
      value: Math.round(avgDaily),
      prefix: '',
      suffix: 'SAR',
      icon: Calculator,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      subtitle: 'هذا الشهر',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  {card.textValue ? (
                    <p className="text-xl font-bold">{card.textValue}</p>
                  ) : (
                    <p className="text-xl font-bold">
                      <AnimatedNumber value={card.value} prefix={card.prefix} suffix={card.suffix} />
                    </p>
                  )}
                  {card.subtitle && (
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  )}
                </div>
                <div className={`${card.bgColor} p-3 rounded-xl`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
