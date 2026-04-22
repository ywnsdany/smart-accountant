'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  visible: boolean;
}

const featureItems = [
  { icon: Wallet, text: 'تتبع المصاريف' },
  { icon: TrendingUp, text: 'تحليل ذكي' },
  { icon: Shield, text: 'تخزين آمن' },
];

export function SplashScreen({ visible }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
          }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-primary/5"
              animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-primary/3"
              animate={{ scale: [1, 1.3, 1], y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center px-6 max-w-md w-full">
            {/* Logo */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.div
                className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl shadow-primary/20"
                animate={{ boxShadow: ['0 25px 50px -12px rgba(22,163,74,0.15)', '0 25px 50px -12px rgba(22,163,74,0.3)', '0 25px 50px -12px rgba(22,163,74,0.15)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-5xl">💰</span>
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                المحاسب الذكي
              </h1>
              <motion.p
                className="text-muted-foreground text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                أدواتك الذكية لإدارة أموالك وتحقيق أهدافك المالية
              </motion.p>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-10"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              {featureItems.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 border border-border/50 text-sm text-muted-foreground"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + i * 0.15, type: 'spring', stiffness: 200 }}
                >
                  <item.icon className="w-3.5 h-3.5 text-primary" />
                  {item.text}
                </motion.div>
              ))}
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-full max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-l from-primary to-primary/70"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <motion.p
                className="text-xs text-muted-foreground text-center mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                جاري تحميل بياناتك...
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
