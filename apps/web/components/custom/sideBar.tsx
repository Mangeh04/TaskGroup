"use client";

import * as React from "react";
import { Settings2, InboxIcon, Home, Command, PersonStandingIcon} from "lucide-react";

import { NavProjects } from "@/components/nav/nav-projects";
import { NavUser } from "@/components/nav/nav-user";
import { NavSecondary } from "@/components/nav/nav-secondary";
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
			url: "/dashboard",
			icon: Home,
		},
		{
			name: "Inbox",
			url: "/inbox",
			icon: InboxIcon,
		},
		{
			name: "Settings",
			url: "/settings",
			icon: Settings2,
		},

	],
};

export type SidebarProps = {
  isProject?: boolean;
  hasMembers?: boolean;
}

export default function AppSidebar({
  isProject,
  hasMembers,
	children
}: React.ComponentProps<typeof Sidebar> & SidebarProps)  {
	return (
		<Sidebar variant="inset">
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
        {isProject ? (
          hasMembers ? (
            <NavSecondary items={[{
              title: "Members",
              url: "/members",
              icon: PersonStandingIcon
            }]} className="mt-auto" />
          ) : (
            <EmptyUser/>
          )
        ) : (
          <div></div>
        )}
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
