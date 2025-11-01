"use client";

import * as React from "react";
import { Settings2, InboxIcon, Home, PersonStandingIcon} from "lucide-react";
import Image from "next/image";

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

import { MemberStatus } from "@/app/dashboard/projectdetails/members/components/member";
import { NavConfiguration } from "@/components/nav/nav-configuration";

const data = {
	user: {
		name: "Mangeh04",
		email: "mapsantamaria@esei.uvigo.es",
		avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/dragonite.jpeg",
    status: "online" as MemberStatus
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
      icon: PersonStandingIcon
    },
  ],
};

export type SidebarProps = {
  isProject?: boolean;
  hasMembers?: boolean;
}

export default function AppSidebar({
  isProject,
  hasMembers
}: React.ComponentProps<typeof Sidebar> & SidebarProps)  {
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
        {isProject && (
          (hasMembers) ? (
            <NavConfiguration config={data.Configuration}/>
          ):(
            <NavConfiguration config={data.Configuration.slice(0,1)}/>
        ))}
			</SidebarContent>
			<SidebarFooter>
        {isProject && (
          (!hasMembers) && (
            <EmptyUser/>
          )
        )}
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
