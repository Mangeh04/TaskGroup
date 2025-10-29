import type { Metadata } from "next";
import {
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/sideBar";
import { EmptyPage } from "@/components/custom/empty";
import emptyImage from "@/public/images/empty-folder.webp";

export const metadata: Metadata = {
	title: "Task Group",
	description: "A lightweight task management app",
};

export default function DashboardPage({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const hasProjects = false;

	return (
		<SidebarProvider>
			<AppSidebar />

			<SidebarInset className="flex min-h-dvh flex-1 flex-col">
				<header className="flex h-14 shrink-0 items-center gap-2 px-4">
					<SidebarTrigger />
					<h1 className="text-lg font-semibold">Task Group</h1>
				</header>

				{hasProjects ? (
					<div className="px-4 py-6">{children}</div>
				) : (
					<div className="flex flex-1 items-center justify-center p-6">
						<EmptyPage
							title="You don't have any projects yet"
							buttonString="Create Project"
							imageSrc={emptyImage}
							imageAlt="Empty projects illustration"
						/>
					</div>
				)}
			</SidebarInset>
		</SidebarProvider>
	);
}
