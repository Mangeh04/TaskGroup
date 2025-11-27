import { getRequestConfig } from "next-intl/server";
import { getUserServer } from "@/lib/getUserServer";

const supportedLocales = ["en", "es"] as const;
type SupportedLocale = (typeof supportedLocales)[number];

export default getRequestConfig(async () => {
	const user = await getUserServer();

	const rawLocale = (user?.language as string | undefined) || "en";

	const locale: SupportedLocale = supportedLocales.includes(
		rawLocale as SupportedLocale
	)
		? (rawLocale as SupportedLocale)
		: "en";

	return {
		locale,
		messages: (await import(`../locales/${locale}.json`)).default,
	};
});
