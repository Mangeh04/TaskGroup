"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

import { ProjectCategoryEnum } from "@repo/types";

type ProjectFormValues = {
	name: string;
	description: string;
	category: ProjectCategoryEnum | "";
};

type ProjectFormProps = {
	values: ProjectFormValues;
	onChange: <K extends keyof ProjectFormValues>(
		field: K,
		value: ProjectFormValues[K]
	) => void;
	loading?: boolean;
};

export function ProjectForm({
	values,
	onChange,
	loading = false,
}: ProjectFormProps) {
	const t = useTranslations("projectForm");

	const categories = Object.values(ProjectCategoryEnum).filter(
		(v): v is ProjectCategoryEnum => typeof v === "string"
	);

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

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="project-category">{t("categoryLabel")}</Label>

				<Select
					value={values.category}
					onValueChange={(value) =>
						onChange("category", value as ProjectCategoryEnum)
					}
					disabled={loading}
				>
					<SelectTrigger id="project-category">
						<SelectValue placeholder={t("categoryPlaceholder")} />
					</SelectTrigger>

					<SelectContent>
						{categories.map((cat) => (
							<SelectItem key={cat} value={cat}>
								{t(`categories.${cat}`)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
