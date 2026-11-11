import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "秘典工坊 · 西幻排版", description: "欢迎转生塔泽里亚！以塔泽里亚大陆为灵感的西幻排版、人物档案与图片导出工坊。", icons: { icon: "/favicon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body>{children}</body></html>; }
