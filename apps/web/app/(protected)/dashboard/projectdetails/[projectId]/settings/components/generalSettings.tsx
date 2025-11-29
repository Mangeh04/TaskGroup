"use client";

import { Save } from "lucide-react";
import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Project } from "@repo/types";
import { useTranslations } from "next-intl";

export type GeneralSettingsProps = {
	project: Project;
	onSubmit: (data: { name: string; description: string }) => void;
};

export function GeneralSettings({ project, onSubmit }: GeneralSettingsProps) {
	const t = useTranslations("projectSettings.general");

	const [name, setName] = useState(project?.name);
	const [desc, setDesc] = useState(project?.description || "");

	useEffect(() => {
		setName(project?.name);
		setDesc(project?.description || "");
	}, [project]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ name, description: desc });
	};

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardHeader>
				<CardTitle className="text-base">{t("title")}</CardTitle>
			</CardHeader>

			<CardContent className="space-y-8">
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-4">
							<Label htmlFor="name">{t("projectName")}</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder={t("projectNamePlaceholder")}
								required
							/>
						</div>
					</div>

					<div className="space-y-4">
						<Label htmlFor="desc" className="mt-6 block">
							{t("description")}
						</Label>
						<Input
							id="desc"
							value={desc}
							onChange={(e) => setDesc(e.target.value)}
							placeholder={t("descriptionPlaceholder")}
						/>
					</div>

					<div className="flex justify-end mt-6">
						<Button type="submit" className="gap-2">
							<Save className="size-4" /> {t("save")}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
