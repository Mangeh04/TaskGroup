"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations, useFormatter } from "next-intl";

export type OverViewCardProps = {
	projectDate: Date | undefined;
};

export function OverviewCard({ projectDate }: OverViewCardProps) {
	const t = useTranslations("projectSettings.overview");
	const format = useFormatter();

	const formattedDate =
		projectDate != null
			? format.dateTime(new Date(projectDate), {
					dateStyle: "medium",
				})
			: t("notAvailable");

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardHeader>
				<CardTitle className="text-base">{t("title")}</CardTitle>
			</CardHeader>

			<CardContent className="text-sm text-muted-foreground space-y-3">
				<div className="flex items-center justify-between">
					<span>{t("created")}</span>
					<span>{formattedDate}</span>
				</div>
			</CardContent>
		</Card>
	);
}
