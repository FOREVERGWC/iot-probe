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
      </body>
    </html>
  );
}
