import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "平行人生档案",
  description: "一个手机端优先的未发生人生线可点击原型。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
