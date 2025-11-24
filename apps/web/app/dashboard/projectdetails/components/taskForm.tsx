"use client";

import { z } from "zod";
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

export const TaskFormSchema = z.object({
	title: z.string().min(1, "Title is required").max(60),
	description: z.string().optional(),
	userId: z.string().min(1, "You must assign the task to a user"),
	isCompleted: z.boolean().default(false),
});

export type TaskFormValues = z.infer<typeof TaskFormSchema>;

export type TaskFormProps = {
	values: TaskFormValues;
	users: ProjectMember[];
	loading?: boolean;
	onChange: (field: keyof TaskFormValues, value: string | boolean) => void;
};

export function TaskForm({ values, users, loading, onChange }: TaskFormProps) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-name">Task name</Label>
				<Input
					id="task-name"
					name="title"
					placeholder="Incredible Task"
					value={values.title}
					onChange={(e) => onChange("title", e.target.value)}
					disabled={loading}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-description">Task description</Label>
				<Input
					id="task-description"
					name="description"
					placeholder="Description of the Task"
					value={values.description ?? ""}
					onChange={(e) => onChange("description", e.target.value)}
					disabled={loading}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-user">Assigned User</Label>
				<Select
					name="userId"
					onValueChange={(val) => onChange("userId", val)}
					value={values.userId}
					disabled={loading}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Assign Task" />
					</SelectTrigger>
					<SelectContent>
						{users.map((user) => (
							<SelectItem key={user.userId} value={user.userId}>
								{user.alias}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center space-x-2 pt-2">
				<Switch
					id="task-state"
					name="isCompleted"
					checked={values.isCompleted}
					onCheckedChange={(val) => onChange("isCompleted", val)}
					disabled={loading}
				/>
				<Label htmlFor="task-state">Marcar como completada</Label>
			</div>
		</div>
	);
}
