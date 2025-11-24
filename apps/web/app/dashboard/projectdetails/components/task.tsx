"use client";

import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { CalendarDays, User, Edit, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/custom/confirmation";
import { CustomDialog } from "@/components/custom/dialog";
import { toast } from "sonner";

import { fetcher } from "@/lib/api";
import type { TaskWithAssignments, ProjectMember, Task } from "@repo/types";

import { TaskForm, TaskFormValues, TaskFormSchema } from "./taskForm";

export type TaskCardProps = TaskWithAssignments & {
	projectMembers: ProjectMember[];
	onUpdate: () => void;
};

export function TaskCard({
	id,
	title,
	description,
	isCompleted,
	createdAt,
	assignments,
	projectId,
	projectMembers,
	onUpdate,
}: TaskCardProps) {
	const state = isCompleted ? "Done" : "Pending";
	const badgeVariant = state === "Done" ? "green" : "destructive";

	const primaryUser = assignments[0]?.user.alias || "Sin asignar";

	const [editValues, setEditValues] = useState<TaskFormValues>({
		title,
		description: description ?? "",
		userId: assignments[0]?.user.userId ?? "",
		isCompleted,
	});
	const [isSaving, setIsSaving] = useState(false);

	const handleEditChange = (
		field: keyof TaskFormValues,
		value: string | boolean
	) => {
		setEditValues(
			(prev) => ({ ...prev, [field]: value }) as TaskFormValues
		);
	};

	async function handleEditSubmit() {
		if (isSaving) return;
		setIsSaving(true);

		const parsed = TaskFormSchema.safeParse(editValues);

		if (!parsed.success) {
			parsed.error.issues.forEach((issue) => {
				toast.error(issue.message);
			});
			setIsSaving(false);
			return;
		}

		const apiBody = {
			title: parsed.data.title,
			description: parsed.data.description,
			isCompleted: parsed.data.isCompleted,
			userIds: [parsed.data.userId],
		};

		const { error } = await fetcher<Task, typeof apiBody>(`/task/${id}`, {
			method: "PATCH",
			body: apiBody,
			needsAuth: true,
		});

		if (error) {
			toast.error(error);
			setIsSaving(false);
			return;
		}

		toast.success("Task updated");
		setIsSaving(false);
		onUpdate();
	}

	async function handleDelete() {
		const { error } = await fetcher(`/task/${id}`, {
			method: "DELETE",
			needsAuth: true,
		});

		if (error) {
			toast.error(error);
		} else {
			toast.success("Task deleted");
			onUpdate();
		}
	}

	return (
		<Card className="relative p-5 rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300">
			<Badge
				variant={badgeVariant}
				className="absolute top-3 right-3 px-3 py-1 text-xs"
			>
				{state}
			</Badge>

			<div className="flex items-start gap-4">
				<div className="shrink-0 size-8 rounded-full bg-black flex items-center justify-center text-white font-semibold">
					{title[0]}
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="text-lg font-semibold text-foreground tracking-tight">
						{title}
					</h3>
					<p className="text-sm text-muted-foreground">
						{description}
					</p>

					<div className="flex items-center text-xs text-muted-foreground mt-1">
						<CalendarDays className="size-3.5 mr-1" />
						<span>
							Created: {new Date(createdAt).toLocaleDateString()}
						</span>
					</div>

					<div className="flex items-center text-xs text-muted-foreground mt-1">
						<User className="size-3.5 mr-1" />
						<span>{primaryUser}</span>
						{assignments.length > 1 && (
							<span className="ml-1 font-medium text-muted-foreground/80">
								(+{assignments.length - 1} más)
							</span>
						)}
					</div>
				</div>
			</div>

			<div className="absolute bottom-3 right-3 flex items-center gap-2">
				<CustomDialog
					title={`Editando tarea: "${title}"`}
					subtitle="Modify the fields and save the changes"
					confirmIcon={
						isSaving ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Edit />
						)
					}
					isIcon={true}
					onSubmit={handleEditSubmit}
				>
					<TaskForm
						values={editValues}
						users={projectMembers}
						loading={isSaving}
						onChange={handleEditChange}
					/>
				</CustomDialog>

				<ConfirmationDialog
					dialogAction="delete"
					text={`Task "${title}" will be permantently deleted.`}
					objective={"task"}
					onConfirm={handleDelete}
				/>
			</div>
		</Card>
	);
}

export function SkeletonCard() {
	return (
		<div
			data-task-card
			className="relative p-5 rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300"
		>
			<Skeleton className="absolute top-3 right-3 h-5 w-14 rounded-full bg-neutral-300/70 animate-pulse" />

			<div className="flex items-start gap-4">
				<Skeleton className="size-8 rounded-full bg-neutral-300/80 animate-pulse flex-shrink-0" />

				<div className="flex flex-col gap-1 flex-1">
					<Skeleton className="h-5 w-48 rounded-md bg-neutral-300/80 animate-pulse" />
					<Skeleton className="h-4 w-72 rounded-md bg-neutral-300/80 animate-pulse" />

					<div className="flex items-center mt-2 gap-1">
						<Skeleton className="h-3.5 w-3.5 rounded-sm bg-neutral-300/80 animate-pulse" />
						<Skeleton className="h-3.5 w-40 rounded-md bg-neutral-300/80 animate-pulse" />
					</div>

					<div className="flex items-center mt-1 gap-1">
						<Skeleton className="h-3.5 w-3.5 rounded-sm bg-neutral-300/80 animate-pulse" />
						<Skeleton className="h-3.5 w-28 rounded-md bg-neutral-300/80 animate-pulse" />
					</div>
				</div>
			</div>

			<div className="absolute bottom-3 right-3 flex items-center gap-2">
				<Skeleton className="h-8 w-8 rounded-md bg-neutral-300/80 animate-pulse" />
				<Skeleton className="h-8 w-8 rounded-md bg-neutral-300/80 animate-pulse" />
			</div>
		</div>
	);
}
