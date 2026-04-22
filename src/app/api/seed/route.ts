import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { subDays, format, subMonths } from 'date-fns';

const SAMPLE_EXPENSES = [
  // This month expenses
  { description: 'غداء في المطعم', category: '🍔 طعام وشراب', amountRange: [30, 120], daysAgoRange: [0, 5] },
  { description: 'شاي وقهوة', category: ' Burger طعام وشراب', amountRange: [10, 35], daysAgoRange: [0, 10] },
  { description: 'مواد بقالة', category: '🍔 طعام وشراب', amountRange: [80, 250], daysAgoRange: [0, 20] },
  { description: 'طلب وجبات', category: '🍔 طعام وشراب', amountRange: [25, 80], daysAgoRange: [0, 15] },
  { description: 'فطور صباحي', category: '🍔 طعام وشراب', amountRange: [15, 45], daysAgoRange: [0, 10] },
  { description: 'عشاء عائلي', category: '🍔 طعام وشراب', amountRange: [100, 300], daysAgoRange: [2, 20] },
  { description: 'تنقل أوبر', category: '🚗 مواصلات', amountRange: [15, 50], daysAgoRange: [0, 15] },
  { description: 'تزويّد بنزين', category: '🚗 مواصلات', amountRange: [80, 200], daysAgoRange: [3, 25] },
  { description: 'إيجار الشهر', category: '🏠 سكن', amountRange: [1500, 3000], daysAgoRange: [1, 5] },
  { description: 'فاتورة الكهرباء', category: '💡 فواتير', amountRange: [150, 400], daysAgoRange: [1, 10] },
  { description: 'فاتورة الإنترنت', category: '💡 فواتير', amountRange: [100, 250], daysAgoRange: [2, 15] },
  { description: 'فاتورة الماء', category: '💡 فواتير', amountRange: [30, 100], daysAgoRange: [5, 20] },
  { description: 'تسوق ملابس', category: '🛒 تسوق', amountRange: [100, 500], daysAgoRange: [5, 30] },
  { description: 'مشتريات السوبرماركت', category: '🛒 تسوق', amountRange: [50, 200], daysAgoRange: [0, 20] },
  { description: 'زيارة طبيب', category: '💊 صحة', amountRange: [100, 500], daysAgoRange: [10, 50] },
  { description: 'أدوية', category: '💊 صحة', amountRange: [20, 150], daysAgoRange: [5, 30] },
  { description: 'تذاكر سينما', category: '🎬 ترفيه', amountRange: [30, 100], daysAgoRange: [0, 25] },
  { description: 'اشتراك نتفليكس', category: '🎬 ترفيه', amountRange: [30, 60], daysAgoRange: [1, 5] },
  { description: 'نادي رياضي', category: '🎬 ترفيه', amountRange: [100, 300], daysAgoRange: [5, 10] },
  { description: 'كتب تعليمية', category: '📚 تعليم', amountRange: [30, 150], daysAgoRange: [10, 60] },
  { description: 'دورة تدريبية', category: '📚 تعليم', amountRange: [200, 800], daysAgoRange: [15, 60] },
  { description: 'قميص جديد', category: '👕 ملابس', amountRange: [50, 250], daysAgoRange: [10, 40] },
  { description: 'حذاء رياضي', category: '👕 ملابس', amountRange: [150, 500], daysAgoRange: [20, 60] },
  { description: 'شحن هاتف', category: '📱 تقنية', amountRange: [20, 50], daysAgoRange: [0, 10] },
  { description: 'إكسسوار هاتف', category: '📱 تقنية', amountRange: [30, 100], daysAgoRange: [5, 30] },
  { description: 'هدية عيد ميلاد', category: '🎁 هدايا', amountRange: [50, 300], daysAgoRange: [15, 60] },
  { description: 'حجز فندق', category: '✈️ سفر', amountRange: [200, 800], daysAgoRange: [30, 90] },
  { description: 'تذاكر طيران', category: '✈️ سفر', amountRange: [300, 1500], daysAgoRange: [40, 90] },
];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSeedData() {
  const data = [];
  const now = new Date();

  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const baseDate = subMonths(now, monthOffset);
    const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
    const maxDay = monthOffset === 0 ? now.getDate() : daysInMonth;

    const entriesThisMonth = randomBetween(8, 15);

    for (let i = 0; i < entriesThisMonth; i++) {
      const template = SAMPLE_EXPENSES[Math.floor(Math.random() * SAMPLE_EXPENSES.length)];
      const day = randomBetween(1, maxDay);
      const hour = randomBetween(8, 22);
      const minute = randomBetween(0, 59);

      const date = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        day,
        hour,
        minute
      );

      data.push({
        description: template.description,
        category: template.category.startsWith(' Burger') ? '🍔 طعام وشراب' : template.category,
        amount: randomBetween(template.amountRange[0], template.amountRange[1]),
        date,
        notes: null,
      });
    }
  }

  return data;
}

export async function GET() {
  try {
    // Check if data already exists
    const existingCount = await db.expense.count();
    if (existingCount > 0) {
      return NextResponse.json({ message: 'Database already seeded', count: existingCount });
    }

    const data = generateSeedData();

    for (const expense of data) {
      await db.expense.create({
        data: expense,
      });
    }

    const totalCount = await db.expense.count();
    return NextResponse.json({ message: 'Database seeded successfully', count: totalCount });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Clear existing data and re-seed
    await db.expense.deleteMany({});
    const data = generateSeedData();

    for (const expense of data) {
      await db.expense.create({
        data: expense,
      });
    }

    const totalCount = await db.expense.count();
    return NextResponse.json({ message: 'Database re-seeded successfully', count: totalCount });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
