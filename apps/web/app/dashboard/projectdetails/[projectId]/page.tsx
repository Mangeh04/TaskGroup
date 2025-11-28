"use client";

import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlusIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import { EmptyPage } from "@/components/custom/empty";
import { CustomDialog } from "@/components/custom/dialog";
import { Progress } from "@/components/ui/progress";
import { BreadCrumbCustom } from "@/components/custom/breadCrumbCustom";
import { usePaginatedView } from "@/hooks/usePaginatedView";

import emptyImage from "@/public/images/empty-task.webp";
import type { TaskEndpoint, ProjectMember, Task } from "@repo/types";

import { fetcher } from "@/lib/api";
import { TaskFormSchema, type TaskFormValues } from "@/lib/schemas";

import { TaskCard, SkeletonCard } from "../components/task";
import { TaskForm } from "../components/taskForm";
import { useTranslations } from "next-intl";

export default function ProjectPage() {
	const params = useParams();
	const projectId = params.projectId as string;
	const router = useRouter();

	const t = useTranslations("tasks");
	const genericT = useTranslations("generic");

	useEffect(() => {
		if (!projectId) {
			router.replace("/dashboard");
		}
	}, [projectId, router]);

	const listContainerRef = useRef<HTMLDivElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);

	const [tasks, setTasks] = useState<TaskEndpoint[]>([]);
	const [users, setUsers] = useState<ProjectMember[]>([]);
	const [isFetching, setIsFetching] = useState(true);

	const [createValues, setCreateValues] = useState<TaskFormValues>({
		title: "",
		description: "",
		userId: "",
		isCompleted: false,
	});
	const [isSavingTask, setIsSavingTask] = useState(false);

	const fetchTasks = useCallback(async () => {
		if (!projectId) return;

		setIsFetching(true);
		const { data, error } = await fetcher<TaskEndpoint[]>(
			`/task/${projectId}`,
			{
				method: "GET",
				needsAuth: true,
			}
		);

		if (error) {
			toast.error(error);
		} else {
			setTasks(data ?? []);
		}
		setIsFetching(false);
	}, [projectId]);

	useEffect(() => {
		void fetchTasks();
	}, [fetchTasks]);

	const fetchMembers = useCallback(async () => {
		if (!projectId) return;

		setIsFetching(true);
		const { data, error } = await fetcher<ProjectMember[]>(
			`/project/${projectId}/members`,
			{
				method: "GET",
				needsAuth: true,
			}
		);

		if (error) {
			toast.error(error);
		} else {
			setUsers(data ?? []);
		}
		setIsFetching(false);
	}, [projectId]);

	useEffect(() => {
		void fetchMembers();
	}, [fetchMembers]);

	const { totalTasks, completedTasks, pendingTasks, progressPercentage } =
		useMemo(() => {
			const totalTasks = tasks.length;
			const completedTasks = tasks.filter(
				(task) => task.isCompleted
			).length;
			const pendingTasks = totalTasks - completedTasks;
			const progressPercentage =
				totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
			return {
				totalTasks,
				completedTasks,
				pendingTasks,
				progressPercentage,
			};
		}, [tasks]);

	const hasTasks = totalTasks > 0;
	const breadcrumbItems = [
		{ label: t("page.breadcrumbHome"), href: "/dashboard" },
	];

	const {
		currentPage,
		totalPages,
		currentData,
		visibleCount,
		isLoading: isInitialLoading,
		isPaginating,
		setItemsPerPage,
		handlePrevious,
		handleNext,
		handlePageClick,
	} = usePaginatedView(tasks, 6, 350);

	const updateItemsPerPage = useCallback(() => {
		if (!listContainerRef.current || !gridRef.current) return;
		const availableHeight = listContainerRef.current.clientHeight;
		const gridStyle = getComputedStyle(gridRef.current);
		const gap = parseInt(gridStyle.gap || "16", 10) || 16;

		let columns = 1;
		const gtc = gridStyle.gridTemplateColumns;
		if (gtc && gtc !== "none") {
			columns = gtc.split(" ").length;
		}

		const DEFAULT_CARD_MIN_H = 160;
		const sampleCard =
			gridRef.current.querySelector<HTMLElement>("[data-task-card]");
		const cardHeight = sampleCard?.offsetHeight ?? DEFAULT_CARD_MIN_H;

		const rows = Math.max(
			1,
			Math.floor((availableHeight + gap) / (cardHeight + gap))
		);
		const count = rows * columns;
		setItemsPerPage(count);
	}, [setItemsPerPage]);

	useEffect(() => {
		updateItemsPerPage();
		window.addEventListener("resize", updateItemsPerPage);

		const ro = new ResizeObserver(updateItemsPerPage);
		if (listContainerRef.current) ro.observe(listContainerRef.current);
		const sampleCardNode =
			gridRef.current?.querySelector("[data-task-card]");
		if (sampleCardNode) ro.observe(sampleCardNode as HTMLElement);

		return () => {
			window.removeEventListener("resize", updateItemsPerPage);
			ro.disconnect();
		};
	}, [updateItemsPerPage]);

	const handleCreateSubmit = async () => {
		if (!projectId) return;
		if (isSavingTask) return;

		setIsSavingTask(true);

		const parsed = TaskFormSchema.safeParse(createValues);

		if (!parsed.success) {
			parsed.error.issues.forEach((issue) => toast.error(issue.message));
			setIsSavingTask(false);
			return;
		}

		const apiBody = {
			title: parsed.data.title,
			description: parsed.data.description,
			isCompleted: parsed.data.isCompleted,
			assignedUserId: parsed.data.userId,
			projectId,
		};

		const { error } = await fetcher<Task, typeof apiBody>("/task", {
			method: "POST",
			body: apiBody,
			needsAuth: true,
		});

		if (error) {
			toast.error(error);
			setIsSavingTask(false);
			return;
		}

		toast.success(t("page.toast"));
		setIsSavingTask(false);
		setCreateValues({
			title: "",
			description: "",
			userId: "",
			isCompleted: false,
		});
		void fetchTasks();
	};

	const handleCreateChange = (
		field: keyof TaskFormValues,
		value: string | boolean
	) => {
		setCreateValues(
			(prev) => ({ ...prev, [field]: value }) as TaskFormValues
		);
	};

	if (!projectId) return null;

	return (
		<>
			<header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
				<SidebarTrigger />
				<BreadCrumbCustom
					items={breadcrumbItems}
					currentPage={t("page.breadcrumbProject")}
				/>

				{hasTasks && (
					<div className="ml-auto flex items-center gap-6">
						<div className="flex items-baseline gap-1">
							<span className="text-2xl font-bold">
								{totalTasks}
							</span>
							<span className="text-xs font-medium text-muted-foreground">
								{t("progress.total")}
							</span>
						</div>
						<div className="flex items-baseline gap-1">
							<span className="text-2xl font-bold">
								{pendingTasks}
							</span>
							<span className="text-xs font-medium text-muted-foreground">
								{t("progress.pending")}
							</span>
						</div>
						<div className="flex items-baseline gap-1">
							<span className="text-2xl font-bold">
								{completedTasks}
							</span>
							<span className="text-xs font-medium text-muted-foreground">
								{t("progress.completed")}
							</span>
						</div>
						<div className="flex items-baseline gap-1">
							<span className="text-2xl font-bold">
								{Math.round(progressPercentage)}%
							</span>
							<span className="text-xs font-medium text-muted-foreground">
								{t("progress.progress")}
							</span>
						</div>
					</div>
				)}

				{isFetching && (
					<div className="ml-4 flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin text-muted-foreground/80" />
						<span className="text-xs text-muted-foreground">
							{genericT("loading")}
						</span>
					</div>
				)}
			</header>

			{hasTasks && (
				<div className="flex items-center justify-between gap-4 px-4 py-4 border-b">
					<div className="shrink-0">
						<CustomDialog
							buttonString={t("page.button")}
							title={t("page.formTitle")}
							subtitle={t("page.formDesc")}
							confirmIcon={
								isSavingTask ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<PlusIcon />
								)
							}
							onSubmit={handleCreateSubmit}
						>
							<TaskForm
								values={createValues}
								users={users}
								loading={isSavingTask}
								onChange={handleCreateChange}
							/>
						</CustomDialog>
					</div>
					<div className="flex-1 max-w-sm">
						<div className="flex justify-between items-center mb-1">
							<span className="text-sm font-medium">
								{t("progress.taskPro")}
							</span>
							<span className="text-sm font-medium text-muted-foreground">
								{Math.round(progressPercentage)}%
							</span>
						</div>
						<Progress
							value={progressPercentage}
							className="w-full"
						/>
					</div>
				</div>
			)}

			{hasTasks ? (
				<div className="flex flex-col gap-4 flex-1 min-h-0 px-4 py-6 overflow-hidden">
					<div
						ref={listContainerRef}
						className="relative flex-1 overflow-y-auto"
					>
						{isPaginating && (
							<div className="pointer-events-none absolute inset-0 z-10" />
						)}

						<div
							ref={gridRef}
							className="grid grid-cols-1 md:grid-cols-2 gap-4"
						>
							{isInitialLoading
								? Array.from({
										length: visibleCount,
									}).map((_, i) => (
										<div
											key={`skeleton_${i}`}
											data-task-card
											className="min-h-40"
										>
											<SkeletonCard />
										</div>
									))
								: currentData.map((task) => (
										<div
											key={task.id}
											data-task-card
											className="min-h-40"
										>
											<TaskCard
												task={task}
												projectMembers={users}
												onUpdate={fetchTasks}
											/>
										</div>
									))}
						</div>
					</div>

					<div className="shrink-0">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={handlePrevious}
										aria-disabled={currentPage === 1}
										className={
											currentPage === 1
												? "pointer-events-none opacity-50"
												: ""
										}
									/>
								</PaginationItem>

								{Array.from(
									{ length: totalPages },
									(_, i) => i + 1
								).map((page) => (
									<PaginationItem key={page}>
										<PaginationLink
											href="#"
											onClick={(e) =>
												handlePageClick(e, page)
											}
											isActive={currentPage === page}
										>
											{page}
										</PaginationLink>
									</PaginationItem>
								))}

								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={handleNext}
										aria-disabled={
											currentPage === totalPages
										}
										className={
											currentPage === totalPages
												? "pointer-events-none opacity-50"
												: ""
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</div>
			) : (
				<div className="flex flex-1 items-center justify-center p-6 overflow-hidden">
					<EmptyPage
						title={t("emptyTasks.title")}
						buttonString={t("emptyTasks.buttonString")}
						imageSrc={emptyImage}
						imageAlt={t("emptyTasks.alt")}
						customDialog={{
							title: t("page.formTitle"),
							subtitle: t("page.formDesc"),
							confirmIcon: isSavingTask ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<PlusIcon />
							),
							onSubmit: handleCreateSubmit,
						}}
					>
						<TaskForm
							values={createValues}
							users={users}
							loading={isSavingTask}
							onChange={handleCreateChange}
						/>
					</EmptyPage>
				</div>
			)}
		</>
	);
}
