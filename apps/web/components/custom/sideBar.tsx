"use client";

import { useCallback, useEffect, useState } from "react";
import { Settings2, InboxIcon, Home, PersonStandingIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

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
import { fetcher } from "@/lib/api";

import { type Status, User, StatusEnum } from "@repo/types";

const data = {
	user: {
		name: "Mangeh04",
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
			url: "/dashboard/projectdetails/settings",
			icon: Settings2,
		},
		{
			name: "Members",
			url: "/dashboard/projectdetails/members",
			icon: PersonStandingIcon,
		},
	],
};

export type SidebarProps = {
	isProject?: boolean;
	hasMembers?: boolean;
};

export default function AppSidebar({
	isProject,
	hasMembers,
}: React.ComponentProps<typeof Sidebar> & SidebarProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loadingUser, setLoadingUser] = useState(true);

	const fetchUser = useCallback(async () => {
		setLoadingUser(true);

		const { data, error } = await fetcher<User>("/user/profile", {
			method: "GET",
			needsAuth: true,
		});

		if (error) {
			toast.error("Failed to load user profile");
			console.error(error);
		} else {
			setUser(data);
		}
	}, []);

	useEffect(() => void fetchUser(), [fetchUser]);

	const sidebarUser = user
		? {
				name: user.alias,
				email: user.email,
				avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/dragonite.jpeg",
				status: user.status,
			}
		: data.user;

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
				<NavProjects projects={data.projects} />
				{isProject &&
					(hasMembers ? (
						<NavConfiguration config={data.Configuration} />
					) : (
						<NavConfiguration
							config={data.Configuration.slice(0, 1)}
						/>
					))}
			</SidebarContent>
			<SidebarFooter>
				{isProject && !hasMembers && <EmptyUser />}
				<NavUser user={sidebarUser} />
			</SidebarFooter>
		</Sidebar>
	);
}
