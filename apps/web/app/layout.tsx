import "./globals.css";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/sonner";

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
				<UserProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster richColors position="top-right" />
					</ThemeProvider>
				</UserProvider>
			</body>
		</html>
	);
}
