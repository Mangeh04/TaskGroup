import { getRequestConfig } from "next-intl/server";
import { getUserServer } from "@/lib/getUserServer";
import { cookies, headers } from "next/headers";

const supportedLocales = ["en", "es"] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const parseAcceptLanguage = (header: string): string | null => {
	if (!header) return null;
	const parts = header.split(",").map((p: any) => p.split(";")[0].trim());
	for (const p of parts) {
		const code = p.slice(0, 2).toLowerCase();
		if ((supportedLocales as readonly string[]).includes(code)) return code;
	}
	return null;
};

export default getRequestConfig(async () => {
	const user = await getUserServer();

	// User preference (when logged in)
	const userLang = user?.language as string | undefined;
	if (
		userLang &&
		(supportedLocales as readonly string[]).includes(userLang)
	) {
		const locale = userLang as SupportedLocale;
		return {
			locale,
			messages: (await import(`../locales/${locale}.json`)).default,
		};
	}

	// Cookie fallback (if client stored a locale before logout)
	const cookieStore = await cookies();
	const cookieLang =
		cookieStore.get("locale")?.value || cookieStore.get("lang")?.value;
	if (
		cookieLang &&
		(supportedLocales as readonly string[]).includes(cookieLang)
	) {
		const locale = cookieLang as SupportedLocale;
		return {
			locale,
			messages: (await import(`../locales/${locale}.json`)).default,
		};
	}

	// Accept-Language header
	const hdrs = await headers();
	const accept = hdrs.get("accept-language") || "";
	const fromHeader = parseAcceptLanguage(accept);
	if (
		fromHeader &&
		(supportedLocales as readonly string[]).includes(fromHeader)
	) {
		const locale = fromHeader as SupportedLocale;
		return {
			locale,
			messages: (await import(`../locales/${locale}.json`)).default,
		};
	}

	// Fallback
	const fallback: SupportedLocale = "es";
	return {
		locale: fallback,
		messages: (await import(`../locales/${fallback}.json`)).default,
	};
});
