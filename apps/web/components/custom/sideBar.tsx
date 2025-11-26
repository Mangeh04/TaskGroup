"use client";

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

export type SidebarProps = {
	isProject?: boolean;
	projectId?: string;
	hasMembers?: boolean;
};

export default function AppSidebar({
	isProject,
	projectId,
	hasMembers,
}: React.ComponentProps<typeof Sidebar> & SidebarProps) {
	const dataSideBar = {
		user: {
			alias: "Mangeh04",
			email: "mapsantamaria@esei.uvigo.es",
			avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/dragonite.jpeg",
			status: StatusEnum.ONLINE as Status,
		},
		projects: [
			{
				name: "Main",
				url: "/dashboard",
				icon: Home,
			},
			{
				name: "Inbox",
				url: "/inbox",
				icon: InboxIcon,
			},
		],

		Configuration: [
			{
				name: "Settings",
				url: `/dashboard/projectdetails/${projectId}/settings`,
				icon: Settings2,
			},
			{
				name: "Members",
				url: `/dashboard/projectdetails/${projectId}/members`,
				icon: PersonStandingIcon,
			},
		],
	};

	const { user } = useUser();

	const sidebarUser = user
		? {
				alias: user.alias,
				email: user.email,
				avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/dragonite.jpeg",
				status: user.status,
			}
		: dataSideBar.user;

	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/group-information">
								<Image
									src="/images/logoTM.png"
									alt="Logo"
									width={32}
									height={32}
									className="rounded-lg"
								/>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										Task Group
									</span>
									<span className="truncate text-xs">
										TSW Equipo 1
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
					(hasMembers ? (
						<NavConfiguration config={dataSideBar.Configuration} />
					) : (
						<NavConfiguration
							config={dataSideBar.Configuration.slice(0, 1)}
						/>
					))}
			</SidebarContent>
			<SidebarFooter>
				{isProject && !hasMembers && <EmptyUser />}
				<NavUser user={sidebarUser as unknown as any} />
			</SidebarFooter>
		</Sidebar>
	);
}
