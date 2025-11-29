"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/sideBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-dvh overflow-hidden">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="flex flex-1 min-h-0 flex-col">
					{children}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
