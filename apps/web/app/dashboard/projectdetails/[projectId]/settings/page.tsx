"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { DangerZone } from "./components/dangerZone";
import { OverviewCard } from "./components/overviewCard";
import { GeneralSettings } from "./components/generalSettings";
import { TeamSettings } from "./components/teamSettings";

import {
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/sideBar";
import { BreadCrumbCustom } from "@/components/custom/breadCrumbCustom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { fetcher } from "@/lib/api";
import { RoleEnum } from "@repo/types";
import type { Project, ProjectMember } from "@repo/types";

export default function ProjectSettingsPage() {
	const router = useRouter();
	const params = useParams();
	const projectId = params.projectId as string;

	async function handleDelete() {
		const { error } = await fetcher(`/project/${projectId}`, {
			method: "DELETE",
			needsAuth: true,
		});

		if (error) {
			toast.error(error);
			return;
		}

		toast.success("Project deleted");
		router.push("/dashboard");
	}

	const [project, setProjects] = useState<Project | null>(null);
	const [users, setUsers] = useState<ProjectMember[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	const fetchData = useCallback(async () => {
		setIsFetching(true);

		const { data, error } = await fetcher<Project>(
			`/project/${projectId}`,
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

		setProjects(data ?? null);
		setIsFetching(false);
	}, [projectId]);

	useEffect(() => {
		void fetchData();
	}, [fetchData]);

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

	const breadcrumbItems = [
		{ label: "Home", href: "/dashboard" },
		{ label: "Project", href: `/dashboard/projectdetails/${projectId}` },
	];

	const memberCount = users.length || 0;
	const adminCount = useMemo(
		() => users.filter((u) => u.role !== RoleEnum.MEMBER).length,
		[users]
	);

	return (
		<div className="flex h-dvh overflow-hidden bg-white dark:bg-neutral-950">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="flex flex-1 min-h-0 flex-col bg-white dark:bg-neutral-950">
					<header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
						<SidebarTrigger />
						<BreadCrumbCustom
							items={breadcrumbItems}
							currentPage="Settings"
						/>

						<div className="ml-auto flex items-center gap-4">
							<Badge variant="secondary" className="rounded-xl">
								{memberCount} members
							</Badge>
							<Badge variant="outline" className="rounded-xl">
								{adminCount} admins
							</Badge>
						</div>
					</header>

					<div className="flex-1 overflow-y-auto px-4 py-6">
						<div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
							<div className="lg:col-span-4 space-y-4">
								<OverviewCard />
								<DangerZone onSubmit={handleDelete} />
							</div>

							<div className="lg:col-span-8">
								<Tabs defaultValue="general" className="w-full">
									<TabsList className="grid grid-cols-2 w-full">
										<TabsTrigger value="general">
											General
										</TabsTrigger>
										<TabsTrigger value="team">
											Team
										</TabsTrigger>
									</TabsList>

									<TabsContent
										value="general"
										className="space-y-6"
									>
										<GeneralSettings project={project!} />
									</TabsContent>

									<TabsContent
										value="team"
										className="space-y-6"
									>
										<TeamSettings users={users} />
									</TabsContent>
								</Tabs>
							</div>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
