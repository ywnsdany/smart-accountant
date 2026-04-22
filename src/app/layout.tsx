import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "المحاسب الذكي - إدارة المالية الشخصية",
  description: "تطبيق احترافي لإدارة وتحليل المصاريف الشخصية مع تحليل ذكي ونصائح لتوفير المال",
  keywords: ["المحاسب الذكي", "إدارة مالية", "مصاريف", "توفير", "تحليل مالي"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>
          {children}
          <Toaster position="top-left" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
