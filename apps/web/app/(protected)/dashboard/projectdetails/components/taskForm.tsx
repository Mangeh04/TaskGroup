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
import { Switch } from "@/components/ui/switch";
import type { ProjectMember } from "@repo/types";
import type { TaskFormValues } from "@/lib/schemas";
import { useTranslations } from "next-intl";

export type TaskFormProps = {
	values: TaskFormValues;
	users: ProjectMember[];
	loading?: boolean;
	onChange: (field: keyof TaskFormValues, value: string | boolean) => void;
};

export function TaskForm({ values, users, loading, onChange }: TaskFormProps) {
	const t = useTranslations("tasks.form");

	return (
		<div className="flex flex-col gap-4">
			{/* Title */}
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-name">{t("titleLabel")}</Label>
				<Input
					id="task-name"
					name="title"
					placeholder={t("titlePlaceholder")}
					value={values.title}
					onChange={(e) => onChange("title", e.target.value)}
					disabled={loading}
				/>
			</div>

			{/* Description */}
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-description">
					{t("descriptionLabel")}
				</Label>
				<Input
					id="task-description"
					name="description"
					placeholder={t("descriptionPlaceholder")}
					value={values.description ?? ""}
					onChange={(e) => onChange("description", e.target.value)}
					disabled={loading}
				/>
			</div>

			{/* Assigned User */}
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-user">{t("assignedUserLabel")}</Label>
				<Select
					name="userId"
					onValueChange={(val) => onChange("userId", val)}
					value={values.userId}
					disabled={loading}
					required
				>
					<SelectTrigger className="w-full">
						<SelectValue
							placeholder={t("assignedUserPlaceholder")}
						/>
					</SelectTrigger>
					<SelectContent>
						{users.map((member) => (
							<SelectItem
								key={member.userId}
								value={member.userId}
							>
								{member.user.alias}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Completed */}
			<div className="flex items-center space-x-2 pt-2">
				<Switch
					id="task-state"
					name="isCompleted"
					checked={values.isCompleted}
					onCheckedChange={(val) => onChange("isCompleted", val)}
					disabled={loading}
				/>
				<Label htmlFor="task-state">{t("isCompletedLabel")}</Label>
			</div>
		</div>
	);
}
