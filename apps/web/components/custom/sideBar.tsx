"use client";

import * as React from "react";
import { Settings2, InboxIcon, Home, Command } from "lucide-react";

import { NavProjects } from "@/components/nav/nav-projects";
import { NavUser } from "@/components/nav/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
	user: {
		name: "Mangeh04",
		email: "mapsantamaria@esei.uvigo.es",
		avatar: "/avatars/shadcn.jpg",
	},

	projects: [
		{
			name: "Main",
			url: "dashboard",
			icon: Home,
		},
		{
			name: "Inbox",
			url: "inbox",
			icon: InboxIcon,
		},
		{
			name: "Settings",
			url: "settings",
			icon: Settings2,
		},
	],
};

export default function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="#">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<Command className="size-4" />
								</div>
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
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
