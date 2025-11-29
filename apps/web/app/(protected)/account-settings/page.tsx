import { Suspense } from "react";
import { SettingsPage } from "@/app/(protected)/account-settings/components/settingsPage";
import { useTranslations } from "next-intl";

export default function AccountSettingsWrapper() {
	const t = useTranslations("generic");

	return (
		<Suspense fallback={<div>{t("loading")}</div>}>
			<SettingsPage />
		</Suspense>
	);
}
