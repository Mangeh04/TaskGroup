import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Task Group",
  description: "A lightweight task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
