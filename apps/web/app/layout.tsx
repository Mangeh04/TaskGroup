import "./globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { UserProvider } from "@/context/UserContext";
import { Toaster } from "@/components/ui/sonner";
import { getUserServer } from "@/lib/getUserServer";

export const metadata: Metadata = {
	title: "Task Group",
	description: "A lightweight task management app",
};

type Props = { children: ReactNode };

export default async function RootLayout({ children }: Props) {
	const [user, locale] = await Promise.all([getUserServer(), getLocale()]);

	return (
		<html lang={locale} suppressHydrationWarning>
			<body>
				<NextIntlClientProvider>
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
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
