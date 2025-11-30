"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

type ProjectFormProps = {
	values: { name: string; description: string };
	onChange: (field: string, value: string) => void;
	loading?: boolean;
};

export function ProjectForm({
	values,
	onChange,
	loading = false,
}: ProjectFormProps) {
	const t = useTranslations("projectForm");

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="project-name">{t("nameLabel")}</Label>
				<Input
					id="project-name"
					name="name"
					placeholder={t("namePlaceholder")}
					value={values.name}
					onChange={(e) => onChange("name", e.target.value)}
					disabled={loading}
					required
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="project-description">
					{t("descriptionLabel")}
				</Label>
				<Input
					id="project-description"
					name="description"
					placeholder={t("descriptionPlaceholder")}
					value={values.description}
					onChange={(e) => onChange("description", e.target.value)}
					disabled={loading}
				/>
			</div>
		</div>
	);
}
