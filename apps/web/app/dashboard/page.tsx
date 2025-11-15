"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
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
import {
	ProjectCard,
	type ProjectCardProps,
	SkeletonCard,
} from "./components/project";
import { CustomDialog } from "@/components/custom/dialog";

import emptyImage from "@/public/images/empty-folder.webp";
import { PlusIcon, Loader2 } from "lucide-react";

import { usePaginatedView } from "@/hooks/usePaginatedView";
import { ProjectForm } from "./components/projectForm";
import Link from "next/link";

const data: Array<ProjectCardProps> = [
	{
		title: "Proyecto Fénix",
		description: "Refactorización completa del backend monolítico.",
		numTasks: 45,
		numUsers: 8,
	},
	{
		title: "E-commerce Relaunch",
		description:
			"Rediseño y migración de la tienda online (Shopify a Next.js).",
		numTasks: 28,
		numUsers: 5,
	},
	{
		title: "Portal de Onboarding (RRHH)",
		description: "Crear una herramienta interna para los nuevos empleados.",
		numTasks: 12,
		numUsers: 3,
	},
	{
		title: "App Móvil v2.0",
		description: "Desarrollo de la nueva app nativa (iOS y Android).",
		numTasks: 35,
		numUsers: 6,
	},
	{
		title: "Optimización SEO (Marketing)",
		description: "Mejorar Core Web Vitals y estrategia de keywords.",
		numTasks: 9,
		numUsers: 2,
	},
	{
		title: "Integración API (Cliente Acme)",
		description: "Conectar nuestro sistema con el ERP del cliente Acme.",
		numTasks: 14,
		numUsers: 4,
	},
	{
		title: "Dashboard de Analíticas",
		description: "Implementación de Metabase para Business Intelligence.",
		numTasks: 11,
		numUsers: 3,
	},
	{
		title: "Iniciativa Titán",
		description: "Expansión de la plataforma a mercados de LATAM.",
		numTasks: 5,
		numUsers: 4,
	},
	{
		title: "Sprint Deuda Técnica (Q4)",
		description: "Resolución de bugs críticos y mejora de performance.",
		numTasks: 52,
		numUsers: 10,
	},
	{
		title: "Sistema de Notificaciones",
		description: "Crear el microservicio de alertas y emails.",
		numTasks: 17,
		numUsers: 3,
	},
];

export default function DashboardPage() {
	const listContainerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const hasProjects = useMemo(() => data.length > 0, []);

	const {
		currentPage,
		totalPages,
		currentData,
		visibleCount,
		isLoading, // For initial skeleton load
		isPaginating, // For page-change spinner
		setItemsPerPage, // We get the setter from the hook
		handlePrevious,
		handleNext,
		handlePageClick,
	} = usePaginatedView(data, 6, 350); // Pass in the data

	const updateItemsPerPage = useCallback(() => {
		if (!listContainerRef.current || !listRef.current) return;

		const availableHeight = listContainerRef.current.clientHeight;

		const style = getComputedStyle(listRef.current);
		const gap = parseInt(style.rowGap || style.gap || "16", 10) || 16;

		const sampleCard = listRef.current.querySelector<HTMLElement>(
			"[data-project-card]"
		);
		const cardHeight = sampleCard?.offsetHeight ?? 120; // Default height

		const rows = Math.max(
			1,
			Math.floor((availableHeight + gap) / (cardHeight + gap))
		);

		// Call the setter from our hook
		setItemsPerPage(rows);
	}, [setItemsPerPage]); // Dependency is stable

	// This effect observes layout changes specific to this component
	useEffect(() => {
		updateItemsPerPage();
		window.addEventListener("resize", updateItemsPerPage);

		const ro = new ResizeObserver(updateItemsPerPage);
		if (listContainerRef.current) {
			ro.observe(listContainerRef.current);
		}
		if (listRef.current) {
			ro.observe(listRef.current); // Observes the list
		}

		return () => {
			window.removeEventListener("resize", updateItemsPerPage);
			ro.disconnect();
		};
	}, [updateItemsPerPage]); // Runs when the memoized function changes

	return (
		<div className="flex h-dvh overflow-hidden">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="flex flex-1 min-h-0 flex-col">
					<header className="flex h-14 shrink-0 items-center gap-2 px-4">
						<SidebarTrigger />
						<h1 className="text-lg font-semibold">Home</h1>

						{isLoading && (
							<div className="ml-auto flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground/80" />
								<span className="text-xs text-muted-foreground">
									Loading…
								</span>
							</div>
						)}
					</header>

					{hasProjects ? (
						<div className="flex flex-col gap-4 flex-1 min-h-0 px-4 py-6 overflow-hidden">
							<div className="shrink-0">
								<CustomDialog
									buttonString="Create Project"
									title="Create a new Project"
									subtitle="Create your new projects here. Click save when you're done"
									confirmIcon={<PlusIcon />}
								>
									<ProjectForm />
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
									{isLoading
										? Array.from({
												length: visibleCount,
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
													key={index}
													data-project-card
													className="min-h-[88px]"
												>
													<Link href="/dashboard/projectdetails">
														<ProjectCard
															title={item.title}
															description={
																item.description
															}
															numTasks={
																item.numTasks
															}
															numUsers={
																item.numUsers
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
								<ProjectForm />
							</EmptyPage>
						</div>
					)}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
