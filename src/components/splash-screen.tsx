'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp, Shield, Sparkles, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  visible: boolean;
}

const featureItems = [
  { icon: Wallet, text: 'تتبع المصاريف' },
  { icon: TrendingUp, text: 'تحليل ذكي' },
  { icon: Shield, text: 'تخزين آمن' },
];

const loadingSteps = [
  'تهيئة البيئة...',
  'تحميل البيانات...',
  'إعداد لوحة التحكم...',
  'تحليل الأنماط المالية...',
  'جاري الإنهاء...',
];

export function SplashScreen({ visible }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!visible) return;

    // Dots animation
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    // Progress bar - slow and smooth over ~5 seconds
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Non-linear progress: fast at start, slow in middle, fast at end
        let increment;
        if (prev < 20) increment = 1.2;
        else if (prev < 50) increment = 0.6;
        else if (prev < 75) increment = 0.4;
        else if (prev < 90) increment = 0.5;
        else increment = 1.0;
        return Math.min(prev + increment, 99.5);
      });
    }, 40);

    // Step transitions
    const stepTimers = loadingSteps.map((_, i) =>
      setTimeout(() => setCurrentStep(i), 800 + i * 900)
    );

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
      stepTimers.forEach(clearTimeout);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: 'blur(20px)',
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
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
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(22,163,74,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(22,163,74,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center px-6 max-w-md w-full">
            {/* Logo */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-primary/20"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-primary/10"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              />

              <motion.div
                className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl shadow-primary/20"
                animate={{ boxShadow: ['0 25px 50px -12px rgba(22,163,74,0.15)', '0 25px 50px -12px rgba(22,163,74,0.35)', '0 25px 50px -12px rgba(22,163,74,0.15)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span
                  className="text-5xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  💰
                </motion.span>
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                المحاسب الذكي
              </h1>
              <motion.p
                className="text-muted-foreground text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                أدواتك الذكية لإدارة أموالك وتحقيق أهدافك المالية
              </motion.p>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-12"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {featureItems.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 border border-border/50 text-sm text-muted-foreground"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + i * 0.2, type: 'spring', stiffness: 200 }}
                >
                  <item.icon className="w-3.5 h-3.5 text-primary" />
                  {item.text}
                </motion.div>
              ))}
            </motion.div>

            {/* Loading section */}
            <motion.div
              className="w-full max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              {/* Progress bar */}
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-l from-primary via-primary/80 to-primary/60 relative"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Shimmer effect on progress bar */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent"
                    animate={{ x: ['200%', '-200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              </div>

              {/* Percentage + step text */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-3.5 h-3.5 text-primary" />
                  </motion.div>
                  <span className="text-xs text-muted-foreground">
                    {loadingSteps[currentStep]}{dots}
                  </span>
                </div>
                <motion.span
                  className="text-xs font-mono text-muted-foreground tabular-nums"
                  key={Math.floor(progress)}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {Math.floor(progress)}%
                </motion.span>
              </div>

              {/* Step indicators */}
              <div className="flex justify-center gap-1.5 mt-5">
                {loadingSteps.map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    initial={{ backgroundColor: 'hsl(var(--muted))' }}
                    animate={{
                      backgroundColor: i <= currentStep
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted))',
                      scale: i === currentStep ? 1.4 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
