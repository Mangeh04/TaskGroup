"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";

import { fetcher } from "@/lib/api";
import type { ProjectMember, TaskWithAssignments, Task } from "@repo/types";

export type TaskFormProps = {
	projectId: string;
	// users: ProjectMember[];
	taskToEdit?: TaskWithAssignments;
	onSuccess: () => void;
};

const FormSchema = z.object({
	title: z.string().min(1, "Title is required").max(60),
	description: z.string().optional(),
	userId: z.string().min(1, "You must assign the task to a user"),
	isCompleted: z.boolean().default(false),
});

export function TaskForm({
	projectId,
	// users,
	taskToEdit,
	onSuccess,
}: TaskFormProps) {
	const [loading, setLoading] = useState(false);
	const isEditing = !!taskToEdit;

	const [title, setTitle] = useState(taskToEdit?.title || "");
	const [description, setDescription] = useState(
		taskToEdit?.description || ""
	);
	const [isCompleted, setIsCompleted] = useState(
		taskToEdit?.isCompleted || false
	);

	const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
		taskToEdit?.assignments[0]?.user.id
	);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const bodyToValidate = {
			title,
			description,
			isCompleted,
			userId: selectedUserId,
		};

		const parsed = FormSchema.safeParse(bodyToValidate);

		if (!parsed.success) {
			parsed.error.issues.forEach((issue) => {
				toast.error(issue.message);
			});
			return setLoading(false);
		}

		const apiBody = {
			title: parsed.data.title,
			description: parsed.data.description,
			isCompleted: parsed.data.isCompleted,
			userIds: [parsed.data.userId],
		};

		const path = isEditing ? `/task/${taskToEdit.id}` : "/task";
		const method = isEditing ? "PATCH" : "POST";

		const finalBody = isEditing ? apiBody : { ...apiBody, projectId };

		const { data, error } = await fetcher<Task, typeof finalBody>(path, {
			method,
			body: finalBody,
			needsAuth: true,
		});

		if (error) {
			toast.error(error);
			return setLoading(false);
		}

		toast.success(isEditing ? "Task updated" : "Task created");
		setLoading(false);
		onSuccess();
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-name">Task name</Label>
				<Input
					id="task-name"
					name="title"
					placeholder="Incredible Task"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-description">Task description</Label>
				<Input
					id="task-description"
					name="description"
					placeholder="Description of the Task"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="task-user">Assigned User</Label>
				{/* Este es un <Select> simple. Para 'userIds' real, necesitarías un MultiSelect */}
				<Select
					name="userId"
					onValueChange={setSelectedUserId}
					defaultValue={selectedUserId}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Asign Task" />
					</SelectTrigger>
					<SelectContent>
						{/* {users.map((user) => (
							<SelectItem key={user.id} value={user.id}>
								{user.alias}
							</SelectItem>
						))} */}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center space-x-2 pt-2">
				<Switch
					id="task-state"
					name="isCompleted"
					checked={isCompleted}
					onCheckedChange={setIsCompleted}
				/>
				<Label htmlFor="task-state">Marcar como completada</Label>
			</div>

			<Button type="submit" disabled={loading} className="mt-4">
				{loading
					? "Saving..."
					: isEditing
						? "Save Changes"
						: "Create Task"}
			</Button>
		</form>
	);
}
