import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/libs/utils";
import { SWRProvider } from "@/provider/swr.provider";
import { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "电网探针",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <SWRProvider>{children}</SWRProvider>
        <footer className="text-center py-4">
          <p>Copyright © 2023-2024 徐州九溪云商贸有限公司 All Rights Reserved 版权所有 <a target="_blank" href="https://beian.miit.gov.cn/">苏ICP备2024095635号</a></p>
        </footer>
      </body>
    </html>
  );
}
