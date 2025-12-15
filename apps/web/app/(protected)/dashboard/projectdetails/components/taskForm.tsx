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

import type { ProjectMember } from "@repo/types";
import { StateEnum, PriorityEnum } from "@repo/types";
import type { TaskFormValues } from "@/lib/schemas";
import { useTranslations } from "next-intl";

export type TaskFormProps = {
	values: TaskFormValues;
	users: ProjectMember[];
	loading?: boolean;
	onChange: (
		field: keyof TaskFormValues,
		value: string | boolean | Date | null
	) => void;
};

function toDateInputValue(date?: Date | null) {
	if (!date) return "";
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

function fromDateInputValue(value: string) {
	if (!value) return null;
	const [y, m, d] = value.split("-").map(Number);
	return new Date(y!, m! - 1, d);
}

export function TaskForm({ values, users, loading, onChange }: TaskFormProps) {
	const t = useTranslations("tasks.form");

	const stateOptions = Object.values(StateEnum).filter(
		(v): v is StateEnum => typeof v === "string"
	);

	const priorityOptions = Object.values(PriorityEnum).filter(
		(v): v is PriorityEnum => typeof v === "string"
	);

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
					<SelectTrigger id="task-user" className="w-full">
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

			{/* State */}
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-state">{t("stateLabel")}</Label>
				<Select
					name="state"
					value={values.state}
					onValueChange={(val) => onChange("state", val as StateEnum)}
					disabled={loading}
					required
				>
					<SelectTrigger id="task-state" className="w-full">
						<SelectValue placeholder={t("statePlaceholder")} />
					</SelectTrigger>
					<SelectContent>
						{stateOptions.map((s) => (
							<SelectItem key={s} value={s}>
								{t(`state.${s}`)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Priority */}
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-priority">{t("priorityLabel")}</Label>
				<Select
					name="priority"
					value={values.priority}
					onValueChange={(val) =>
						onChange("priority", val as PriorityEnum)
					}
					disabled={loading}
					required
				>
					<SelectTrigger id="task-priority" className="w-full">
						<SelectValue placeholder={t("priorityPlaceholder")} />
					</SelectTrigger>
					<SelectContent>
						{priorityOptions.map((p) => (
							<SelectItem key={p} value={p}>
								{t(`priority.${p}`)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Dates */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="task-initial-date">
						{t("initialDateLabel")}
					</Label>
					<Input
						id="task-initial-date"
						name="initialDate"
						type="date"
						value={toDateInputValue(values.initialDate)}
						onChange={(e) =>
							onChange(
								"initialDate",
								fromDateInputValue(e.target.value)
							)
						}
						disabled={loading}
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="task-due-date">{t("dueDateLabel")}</Label>
					<Input
						id="task-due-date"
						name="dueDate"
						type="date"
						value={toDateInputValue(values.dueDate)}
						onChange={(e) =>
							onChange(
								"dueDate",
								fromDateInputValue(e.target.value)
							)
						}
						disabled={loading}
						min={toDateInputValue(values.initialDate)}
					/>
				</div>
			</div>
		</div>
	);
}
