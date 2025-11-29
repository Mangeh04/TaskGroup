"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { Settings2, InboxIcon, Home, PersonStandingIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { NavProjects } from "@/components/nav/nav-projects";
import { NavUser } from "@/components/nav/nav-user";
import { EmptyUser } from "@/components/nav/empty-users";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavConfiguration } from "@/components/nav/nav-configuration";

import { type Status, StatusEnum } from "@repo/types";
import { useUser } from "@/context/UserContext";
import { useTranslations } from "next-intl";
import { fetcher } from "@/lib/api";
import { ProjectMember } from "@repo/types";
import { toast } from "sonner";

export type SidebarProps = React.ComponentProps<typeof Sidebar>;

export default function AppSidebar(props: SidebarProps) {
	const t = useTranslations("sidebar");
	const pathname = usePathname();
	const params = useParams() as { projectId?: string };

	const { user } = useUser();

	const loggedUserId = user ? (user as any).sub || user.id : undefined;

	const isProject = pathname.startsWith("/dashboard/projectdetails");
	const projectId = params.projectId;

	const [users, setUsers] = useState<ProjectMember[]>([]);
	const [isFetchingMembers, setIsFetchingMembers] = useState(true);

	const fetchMembers = useCallback(async () => {
		if (!isProject) return;
		if (!projectId) return;

		setIsFetchingMembers(true);
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
		setIsFetchingMembers(false);
	}, [projectId, isProject]);

	useEffect(() => {
		void fetchMembers();
	}, [fetchMembers]);

	const currentUser = useMemo(() => {
		if (!users.length || !loggedUserId) return undefined;

		return users.find((u) => String(u.userId) === String(loggedUserId));
	}, [loggedUserId, users]);

	const isMemberRole = currentUser?.role?.toUpperCase() === "MEMBER";

	const isLoading = isProject && (isFetchingMembers || !user);

	const hasMembers = users ? users.length > 1 : false;

	const dataSideBar = useMemo(
		() => ({
			user: {
				alias: "Mangeh04",
				email: "mapsantamaria@esei.uvigo.es",
				status: StatusEnum.ONLINE as Status,
			},
			projects: [
				{
					name: t("projects.main"),
					url: "/dashboard",
					icon: Home,
				},
				{
					name: t("projects.inbox"),
					url: "/inbox",
					icon: InboxIcon,
				},
			],
			Configuration:
				projectId != null
					? [
							{
								name: t("projectDetail.settings"),
								url: `/dashboard/projectdetails/${projectId}/settings`,
								icon: Settings2,
							},
							{
								name: t("projectDetail.members"),
								url: `/dashboard/projectdetails/${projectId}/members`,
								icon: PersonStandingIcon,
							},
						]
					: [],
		}),
		[projectId, t]
	);

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/group-information">
								<Image
									src="/images/calvo.png"
									alt="Logo"
									width={32}
									height={32}
									className="rounded-lg"
								/>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{t("groupInfo.name")}
									</span>
									<span className="truncate text-xs">
										{t("groupInfo.info")}
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavProjects projects={dataSideBar.projects} />

				{isProject &&
					!isLoading &&
					dataSideBar.Configuration.length > 0 &&
					(hasMembers ? (
						currentUser ? (
							isMemberRole ? (
								<NavConfiguration
									config={dataSideBar.Configuration.slice(1)}
								/>
							) : (
								<NavConfiguration
									config={dataSideBar.Configuration}
								/>
							)
						) : (
							<NavConfiguration
								config={dataSideBar.Configuration.slice(1)}
							/>
						)
					) : (
						<NavConfiguration
							config={dataSideBar.Configuration.slice(0, 1)}
						/>
					))}
			</SidebarContent>

			<SidebarFooter>
				{isProject && !hasMembers && <EmptyUser />}
				{user && (
					<NavUser
						user={{
							id: loggedUserId || "unknown",
							alias: user.alias || "User",
							email: user.email || "",
							status: user.status || StatusEnum.OFFLINE,
						}}
					/>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
