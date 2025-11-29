"use client";

import { type LucideIcon } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

export function NavConfiguration({
	config,
}: {
	config: {
		name: string;
		url: string;
		icon: LucideIcon;
	}[];
}) {
	const t = useTranslations("sidebar");
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>{t("labelConfiguration")}</SidebarGroupLabel>
			<SidebarMenu>
				{config.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
							<a href={item.url}>
								<item.icon />
								<span>{item.name}</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
				<SidebarMenuItem></SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
