"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useTranslations, useLocale } from "next-intl";
import { useFetcherToast } from "@/hooks/useFetcherToast";

const LANGUAGES = [
	{ id: "en", label: "English" },
	{ id: "es", label: "Español" },
];

export function LanguageSection() {
	const t = useTranslations("settings.language");
	const router = useRouter();
	const locale = useLocale();

	const [value, setValue] = useState(locale);
	const [isPending, startTransition] = useTransition();

	const fetcherToast = useFetcherToast();

	async function updateLanguagePreference(lang: string) {
		await fetcherToast("/user/preference", {
			method: "PATCH",
			needsAuth: true,
			body: { language: lang },
		});
	}

	function handleChange(lang: string) {
		setValue(lang);

		startTransition(async () => {
			await updateLanguagePreference(lang);
			router.refresh();
		});
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">{t("title")}</h1>
				<p className="text-muted-foreground mt-1">{t("description")}</p>
			</div>

			<Card>
				<CardContent className="space-y-6 p-6">
					<div className="space-y-4">
						<h3 className="font-medium">{t("languageTitle")}</h3>

						<RadioGroup
							value={value}
							onValueChange={handleChange}
							className="grid gap-3 sm:grid-cols-2"
							disabled={isPending}
						>
							{LANGUAGES.map((lang) => (
								<LanguageOption
									key={lang.id}
									id={lang.id}
									label={lang.label}
								/>
							))}
						</RadioGroup>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function LanguageOption({ id, label }: { id: string; label: string }) {
	return (
		<label
			htmlFor={id}
			className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-secondary/50 transition-colors"
		>
			<RadioGroupItem id={id} value={id} />
			<div className="font-medium">{label}</div>
		</label>
	);
}
