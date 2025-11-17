"use client";

import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import {
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import AppSidebar from "@/components/custom/sideBar";
import { EmptyPage } from "@/components/custom/empty";
import { ProjectCard, SkeletonCard } from "./components/project";
import { CustomDialog } from "@/components/custom/dialog";

import emptyImage from "@/public/images/empty-folder.webp";
import { fetcher } from "@/lib/api";
import { usePaginatedView } from "@/hooks/usePaginatedView";
import type { Project } from "@repo/types";

import { PlusIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { ProjectForm } from "./components/projectForm";

type ProjectResponse = Project & {
	membersCount: number;
	tasksCount: number;
};

export default function DashboardPage() {
	const listContainerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const [projects, setProjects] = useState<ProjectResponse[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	const [formValues, setFormValues] = useState({
		name: "",
		description: "",
	});

	const fetchData = useCallback(async () => {
		setIsFetching(true);

		const { data, error } = await fetcher<ProjectResponse[]>(
			`/project/recover-all/`,
			{
				method: "GET",
				needsAuth: true,
			}
		);

		if (error) {
			toast.error(error);
			setIsFetching(false);
			return;
		}

		setProjects(data ?? []);
		setIsFetching(false);
	}, []);

	useEffect(() => {
		void fetchData();
	}, [fetchData]);

	const {
		currentPage,
		totalPages,
		currentData,
		visibleCount,
		isLoading: isSkeletonLoading,
		isPaginating,
		setItemsPerPage,
		handlePrevious,
		handleNext,
		handlePageClick,
	} = usePaginatedView(projects, 6, 350);

	const hasProjects = useMemo(() => projects.length > 0, [projects]);

	const updateItemsPerPage = useCallback(() => {
		if (!listContainerRef.current || !listRef.current) return;

		const availableHeight = listContainerRef.current.clientHeight;

		const style = getComputedStyle(listRef.current);
		const gap = parseInt(style.rowGap || style.gap || "16", 10) || 16;

		const sampleCard = listRef.current.querySelector<HTMLElement>(
			"[data-project-card]"
		);
		const cardHeight = sampleCard?.offsetHeight ?? 120;

		const rows = Math.max(
			1,
			Math.floor((availableHeight + gap) / (cardHeight + gap))
		);

		setItemsPerPage(rows);
	}, [setItemsPerPage]);

	useEffect(() => {
		updateItemsPerPage();
		window.addEventListener("resize", updateItemsPerPage);

		const ro = new ResizeObserver(updateItemsPerPage);
		if (listContainerRef.current) {
			ro.observe(listContainerRef.current);
		}
		if (listRef.current) {
			ro.observe(listRef.current);
		}

		return () => {
			window.removeEventListener("resize", updateItemsPerPage);
			ro.disconnect();
		};
	}, [updateItemsPerPage]);

	const showList = hasProjects || isFetching || isSkeletonLoading;

	const [isCreating, setIsCreating] = useState(false);

	const onProjectSubmit = useCallback(async () => {
		if (isCreating) return;

		setIsCreating(true);

		const { name, description } = formValues;

		const { data, error } = await fetcher<
			{ message?: string },
			{ name: string; description: string }
		>("/project/create", {
			method: "POST",
			body: { name, description },
			needsAuth: true,
		});

		if (error) {
			toast.error(error);
			setIsCreating(false);
			return;
		}

		toast.success(data?.message ?? "Project created successfully!");
		await fetchData();

		setFormValues({ name: "", description: "" });

		setIsCreating(false);
	}, [fetchData, formValues, isCreating]);

	return (
		<div className="flex h-dvh overflow-hidden">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="flex flex-1 min-h-0 flex-col">
					<header className="flex h-14 shrink-0 items-center gap-2 px-4">
						<SidebarTrigger />
						<h1 className="text-lg font-semibold">Home</h1>

						{(isFetching || isPaginating) && (
							<div className="ml-auto flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground/80" />
								<span className="text-xs text-muted-foreground">
									Loading…
								</span>
							</div>
						)}
					</header>

					{showList ? (
						<div className="flex flex-col gap-4 flex-1 min-h-0 px-4 py-6 overflow-hidden">
							<div className="shrink-0">
								<CustomDialog
									buttonString="Create Project"
									title="Create a new Project"
									subtitle="Create your new projects here. Click save when you're done"
									confirmIcon={
										isCreating ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<PlusIcon />
										)
									}
									onSubmit={onProjectSubmit}
								>
									<ProjectForm
										values={formValues}
										onChange={setFormValues}
										isSubmitting={isCreating}
									/>
								</CustomDialog>
							</div>

							<div
								ref={listContainerRef}
								className="relative flex-1 overflow-y-auto"
							>
								{isPaginating && (
									<div className="pointer-events-none absolute inset-0 z-10" />
								)}

								<div
									ref={listRef}
									className="flex flex-col gap-4"
								>
									{isSkeletonLoading || isFetching
										? Array.from({
												length: visibleCount || 6,
											}).map((_, i) => (
												<div
													key={`project_skeleton_${i}`}
													data-project-card
													className="min-h-[88px]"
												>
													<SkeletonCard />
												</div>
											))
										: currentData.map((item, index) => (
												<div
													key={item.id ?? index}
													data-project-card
													className="min-h-[88px]"
												>
													<Link
														href={`/dashboard/projectdetails?projectId=${item.id}`}
													>
														<ProjectCard
															title={item.name}
															description={
																item.description ??
																"No description available"
															}
															numTasks={
																item.tasksCount
															}
															numUsers={
																item.membersCount
															}
														/>
													</Link>
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
												aria-disabled={
													currentPage === 1
												}
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
													isActive={
														currentPage === page
													}
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
								title="You don't have any projects yet"
								buttonString="Create Project"
								imageSrc={emptyImage}
								imageAlt="Empty projects illustration"
								customDialog={{
									title: "You don't have any projects yet",
									subtitle:
										"Create your new projects here. Click save when you're done",
								}}
							>
								<ProjectForm
									values={formValues}
									onChange={setFormValues}
									isSubmitting={isCreating}
								/>
							</EmptyPage>
						</div>
					)}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
