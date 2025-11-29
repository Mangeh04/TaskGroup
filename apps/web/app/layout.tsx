import "./globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "Task Group",
	description: "A lightweight task management app",
};

type Props = { children: ReactNode };

export default async function RootLayout({ children }: Props) {
	const [locale] = await getLocale();

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
						{children}
						<Toaster richColors position="top-right" />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
