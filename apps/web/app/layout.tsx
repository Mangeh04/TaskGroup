import "./globals.css";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/sonner";
import { getUserServer } from "@/lib/getUserServer";

export const metadata: Metadata = {
	title: "Task Group",
	description: "A lightweight task management app",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const user = await getUserServer();

	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<UserProvider initialUser={user}>
						{children}
						<Toaster richColors position="top-right" />
					</UserProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
