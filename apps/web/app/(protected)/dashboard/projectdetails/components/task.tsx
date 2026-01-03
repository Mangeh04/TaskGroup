"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
	CalendarDays,
	User,
	Edit,
	Loader2,
	Flag,
	PlayCircle,
	CalendarClock,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/custom/confirmation";
import { CustomDialog } from "@/components/custom/dialog";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { TaskFormSchema, type TaskFormValues } from "@/lib/schemas";
import type { ProjectMember, TaskEndpoint } from "@repo/types";

import { TaskForm } from "./taskForm";
import { useFormatter, useTranslations } from "next-intl";
import { useFetcherToast } from "@/hooks/useFetcherToast";

export type TaskCardProps = {
	task: TaskEndpoint;
	projectMembers: ProjectMember[];
	onUpdate: () => void;
};

type StateValue =
	| "TODO"
	| "IN_PROGRESS"
	| "REVIEW"
	| "CANCELLED"
	| "ARCHIVED"
	| "DONE";
type PriorityValue = "LOW" | "MEDIUM" | "HIGH";

function asDate(value: unknown): Date | null {
	if (!value) return null;
	const d = value instanceof Date ? value : new Date(String(value));
	return Number.isNaN(d.getTime()) ? null : d;
}

export function TaskCard({ task, projectMembers, onUpdate }: TaskCardProps) {
	const {
		id,
		title,
		description,
		createdAt,
		assignedUser,
		assignedUserId,
		state,
		priority,
		initialDate,
		dueDate,
	} = task as TaskEndpoint & {
		state: StateValue;
		priority: PriorityValue;
		initialDate?: Date | string | null;
		dueDate?: Date | string | null;
	};

	const t = useTranslations("tasks.card");
	const f = useTranslations("tasks.form");
	const format = useFormatter();

	const stateOptions = useMemo(
		() =>
			[
				"TODO",
				"IN_PROGRESS",
				"REVIEW",
				"CANCELLED",
				"ARCHIVED",
				"DONE",
			] as const,
		[]
	);

	const badgeVariant = useMemo(() => {
		switch (state) {
			case "DONE":
				return "green";
			case "IN_PROGRESS":
				return "blue";
			case "REVIEW":
				return "yellow";
			case "CANCELLED":
				return "destructive";
			case "ARCHIVED":
				return "outline";
			case "TODO":
				return "white";
			default:
				return "secondary";
		}
	}, [state]);

	const priorityBadgeVariant = useMemo(() => {
		switch (priority) {
			case "HIGH":
				return "destructive";
			case "MEDIUM":
				return "secondary";
			case "LOW":
				return "white";
			default:
				return "outline";
		}
	}, [priority]);

	const priorityIcon = useMemo(() => {
		switch (priority) {
			case "HIGH":
				return <Flag className="size-3.5" />;
			case "MEDIUM":
				return <Flag className="size-3.5" />;
			case "LOW":
			default:
				return <Flag className="size-3.5" />;
		}
	}, [priority]);

	const primaryUser = assignedUser?.alias ?? t("notAssigned");

	const start = asDate(initialDate);
	const due = asDate(dueDate);

	const [editValues, setEditValues] = useState<TaskFormValues>({
		title,
		description: description ?? "",
		userId: assignedUserId ?? "",
		state: state as TaskFormValues["state"],
		priority: priority as TaskFormValues["priority"],
		initialDate: start!,
		dueDate: due!,
	});

	const [isSaving, setIsSaving] = useState(false);
	const [isChangingState, setIsChangingState] = useState(false);

	const handleEditChange = (
		field: keyof TaskFormValues,
		value: string | boolean | Date | null
	) => {
		setEditValues(
			(prev) => ({ ...prev, [field]: value }) as TaskFormValues
		);
	};

	const fetcherToast = useFetcherToast();

	async function handleStateChange(nextState: StateValue) {
		if (isChangingState || isSaving) return;

		setIsChangingState(true);
		setEditValues((prev) => ({ ...prev, state: nextState as any }));

		const apiBody = {
			id,
			title,
			description: description ?? "",
			state: nextState,
			priority,
			initialDate: start,
			dueDate: due,
			assignedUserId: assignedUserId ?? null,
		};

		const { error } = await fetcherToast<TaskEndpoint, typeof apiBody>(
			`/task/${id}`,
			{
				method: "PATCH",
				body: apiBody,
				needsAuth: true,
			}
		);

		if (!error) {
			toast.success(t("toastStateUpdated"));
			onUpdate();
		}

		setIsChangingState(false);
	}

	async function handleEditSubmit() {
		if (isSaving) return;
		setIsSaving(true);

		const parsed = TaskFormSchema.safeParse(editValues);

		if (!parsed.success) {
			parsed.error.issues.forEach((issue) => toast.error(issue.message));
			setIsSaving(false);
			return;
		}

		const apiBody = {
			id,
			title: parsed.data.title,
			description: parsed.data.description,
			state: parsed.data.state,
			priority: parsed.data.priority,
			initialDate: parsed.data.initialDate,
			dueDate: parsed.data.dueDate,
			assignedUserId: parsed.data.userId || null,
		};

		const { error } = await fetcherToast<TaskEndpoint, typeof apiBody>(
			`/task/${id}`,
			{
				method: "PATCH",
				body: apiBody,
				needsAuth: true,
			}
		);

		if (error) {
			setIsSaving(false);
			return;
		}

		toast.success(t("toastUpdated"));
		setIsSaving(false);
		onUpdate();
	}

	async function handleDelete() {
		const { error } = await fetcherToast(`/task/${id}`, {
			method: "DELETE",
			needsAuth: true,
		});

		if (!error) {
			toast.success(t("toastDeleted"));
			onUpdate();
		}
	}

	return (
		<Card className="relative p-5 rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300">
			<Badge
				variant={badgeVariant as any}
				className="absolute top-3 right-3 px-3 py-1 text-xs"
			>
				{f(`state.${state}`)}
			</Badge>

			<div className="absolute top-3 left-3">
				<Badge
					variant={priorityBadgeVariant as any}
					className="px-2 py-1 text-xs gap-1"
				>
					{priorityIcon}
					{f(`priority.${priority}`)}
				</Badge>
			</div>

			<div className="flex items-start gap-4 pt-6">
				<div className="shrink-0 size-8 rounded-full bg-black flex items-center justify-center text-white font-semibold">
					{title[0]}
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="text-lg font-semibold text-foreground tracking-tight">
						{title}
					</h3>

					{description ? (
						<p className="text-sm text-muted-foreground">
							{description}
						</p>
					) : null}

					<div className="flex items-center text-xs text-muted-foreground mt-1">
						<User className="size-3.5 mr-1" />
						<span>{primaryUser}</span>
					</div>

					{(start || due) && (
						<div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
							{start && (
								<div className="flex items-center">
									<PlayCircle className="size-3.5 mr-1" />
									<span>
										{t("startDateLabel")}:{" "}
										{format.dateTime(start, {
											dateStyle: "medium",
										})}
									</span>
								</div>
							)}
							{due && (
								<div className="flex items-center">
									<CalendarClock className="size-3.5 mr-1" />
									<span>
										{t("dueDateLabel")}:{" "}
										{format.dateTime(due, {
											dateStyle: "medium",
										})}
									</span>
								</div>
							)}
						</div>
					)}

					<div className="flex items-center text-xs text-muted-foreground mt-1">
						<CalendarDays className="size-3.5 mr-1" />
						<span>
							{t("createdPrefix")}{" "}
							{format.dateTime(new Date(createdAt), {
								dateStyle: "medium",
							})}
						</span>
					</div>

					<div className="mt-3 w-56">
						<Select
							value={state}
							onValueChange={(v) =>
								handleStateChange(v as StateValue)
							}
							disabled={isChangingState || isSaving}
						>
							<SelectTrigger>
								<SelectValue
									placeholder={t("statePlaceholder")}
								/>
							</SelectTrigger>
							<SelectContent>
								{stateOptions.map((s) => (
									<SelectItem key={s} value={s}>
										{f(`state.${s}`)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{isChangingState && (
							<div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								<span>{t("updatingState")}</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="absolute bottom-3 right-3 flex items-center gap-2">
				<CustomDialog
					title={t("editTitle", { title })}
					subtitle={t("editSubtitle")}
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
					text={t("deleteConfirmationText", { title })}
					objective={t("deleteObjective")}
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
			<Skeleton className="absolute top-3 left-3 h-5 w-20 rounded-full bg-neutral-300/70 animate-pulse" />

			<div className="flex items-start gap-4 pt-6">
				<Skeleton className="size-8 rounded-full bg-neutral-300/80 animate-pulse shrink-0" />

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

					<div className="mt-2">
						<Skeleton className="h-3.5 w-56 rounded-md bg-neutral-300/80 animate-pulse" />
						<Skeleton className="h-3.5 w-44 rounded-md bg-neutral-300/80 animate-pulse mt-2" />
					</div>

					<div className="mt-3">
						<Skeleton className="h-9 w-56 rounded-md bg-neutral-300/80 animate-pulse" />
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
