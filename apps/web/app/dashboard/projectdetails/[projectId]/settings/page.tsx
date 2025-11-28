"use client";

import { useMemo, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { DangerZone } from "./components/dangerZone";
import { OverviewCard } from "./components/overviewCard";
import { GeneralSettings } from "./components/generalSettings";
import { TeamSettings } from "./components/teamSettings";

import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { BreadCrumbCustom } from "@/components/custom/breadCrumbCustom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { RoleEnum } from "@repo/types";
import type { Project, ProjectMember } from "@repo/types";
import { fetcher } from "@/lib/api";
import { useTranslations } from "next-intl";

export default function ProjectSettingsPage() {
	const router = useRouter();
	const params = useParams();
	const projectId = params.projectId as string;

	const t = useTranslations("projectSettings.page");

	async function handleDelete() {
		const { error } = await fetcher(`/project/${projectId}`, {
			method: "DELETE",
			needsAuth: true,
		});

		if (error) {
			toast.error(error);
			return;
		}

		toast.success(t("toastDeleted"));
		router.push("/dashboard");
	}

	async function handleUpdateProject(updatedProject: Project) {
		const { error } = await fetcher(`/project/update`, {
			method: "PATCH",
			body: updatedProject,
			needsAuth: true,
		});

		if (error) {
			toast.error(error);
			return;
		}

		toast.success(t("toastUpdated"));
		router.push("/dashboard");
	}

	const [project, setProject] = useState<Project | null>();
	const [users, setUsers] = useState<ProjectMember[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	const fetchProject = useCallback(async () => {
		if (!projectId) return;

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

		setProject(data ?? null);
		setIsFetching(false);
	}, [projectId]);

	useEffect(() => {
		void fetchProject();
	}, [fetchProject]);

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
		{ label: t("breadcrumbHome"), href: "/dashboard" },
		{
			label: t("breadcrumbProject"),
			href: `/dashboard/projectdetails/${projectId}`,
		},
	];

	const memberCount = users.length || 0;
	const adminCount = useMemo(
		() => users.filter((u) => u.role !== RoleEnum.MEMBER).length,
		[users]
	);

	return (
		<div className="flex h-dvh overflow-hidden bg-white dark:bg-neutral-950">
			<SidebarInset className="flex flex-1 min-h-0 flex-col bg-white dark:bg-neutral-950">
				<header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
					<SidebarTrigger />
					<BreadCrumbCustom
						items={breadcrumbItems}
						currentPage={t("breadcrumbCurrent")}
					/>

					<div className="ml-auto flex items-center gap-4">
						<Badge variant="secondary" className="rounded-xl">
							{t("membersBadge", { count: memberCount })}
						</Badge>
						<Badge variant="outline" className="rounded-xl">
							{t("adminsBadge", { count: adminCount })}
						</Badge>
					</div>
				</header>

				<div className="flex-1 overflow-y-auto px-4 py-6">
					<div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
						<div className="lg:col-span-4 space-y-4">
							<OverviewCard projectDate={project?.createdAt} />
							<DangerZone onSubmit={handleDelete} />
						</div>

						<div className="lg:col-span-8">
							<Tabs defaultValue="general" className="w-full">
								<TabsList className="grid grid-cols-2 w-full">
									<TabsTrigger value="general">
										{t("tabGeneral")}
									</TabsTrigger>
									<TabsTrigger value="team">
										{t("tabTeam")}
									</TabsTrigger>
								</TabsList>

								<TabsContent
									value="general"
									className="space-y-6"
								>
									{project && (
										<GeneralSettings
											project={project}
											onSubmit={(data) => {
												handleUpdateProject({
													id: projectId,
													name: data.name,
													description:
														data.description,
													createdAt:
														project.createdAt,
												});
											}}
										/>
									)}
								</TabsContent>

								<TabsContent value="team" className="space-y-6">
									<TeamSettings users={users} />
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</div>
			</SidebarInset>
		</div>
	);
}
