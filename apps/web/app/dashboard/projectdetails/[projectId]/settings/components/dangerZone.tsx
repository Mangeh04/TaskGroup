"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/custom/confirmation";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function DangerZone({
	onSubmit,
}: {
	onSubmit: () => Promise<void> | void;
}) {
	const t = useTranslations("projectSettings.danger");

	return (
		<Card className="rounded-2xl border-red-200/40 dark:border-red-900/40">
			<CardHeader>
				<CardTitle className="text-base flex items-center gap-2 text-red-600 dark:text-red-400">
					<Trash2 className="size-4" /> {t("title")}
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					{t("description")}
				</p>
			</CardHeader>

			<CardContent>
				{/* @ts-expect-error ConfirmationDialog does not have its type properly defined */}
				<ConfirmationDialog
					dialogAction="delete"
					objective="project"
					text={t("confirmText")}
					onConfirm={onSubmit}
				>
					<Button
						variant="destructive"
						className="w-full h-12 text-base font-semibold gap-2"
					>
						<Trash2 className="size-5" />
						{t("button")}
					</Button>
				</ConfirmationDialog>
			</CardContent>
		</Card>
	);
}
