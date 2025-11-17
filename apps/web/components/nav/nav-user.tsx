"use client";

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	LogOut,
	CircleSmall,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/api";
import { type Status, StatusEnum } from "@repo/types";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { statusStyles } from "./status";

const statusOptions = [
	{ value: "online", label: "Online", color: "bg-green-500" },
	{ value: "away", label: "Away", color: "bg-yellow-500" },
	{ value: "do not disturb", label: "Do not disturb", color: "bg-gray-500" },
	{ value: "offline", label: "Offline", color: "bg-destructive" },
];

export function NavUser({
	user,
}: {
	user: {
		name?: string | null;
		email?: string;
		avatar?: string;
		status: Status;
	};
}) {
	const { isMobile } = useSidebar();
	const currentStatus =
		statusStyles[user.status] ?? statusStyles[StatusEnum.ONLINE];
	const router = useRouter();

	const safeName = (user?.name && user.name.trim()) || "ERROR";
	const safeEmail = user?.email ?? "";

	const initial =
		safeName.trim()[0]?.toLocaleUpperCase() ||
		safeEmail.trim()[0]?.toLocaleUpperCase() ||
		"?";

	async function handleLogout() {
		const { data, error } = await fetcher<{ message?: string }>(
			"/auth/log-out",
			{
				method: "POST",
				needsAuth: true,
			}
		);

		if (error) {
			toast.error(error);
			return;
		}

		toast.success(data?.message ?? "Logged out successfully!");

		router.push("/login");
	}

	if (!user) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar>
								<AvatarImage src={user.avatar} alt={safeName} />
								<AvatarFallback>{initial}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{safeName}
								</span>
								<span className="truncate text-xs">
									{safeEmail}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={cn(
										"flex h-2 w-2 rounded-full",
										currentStatus.color
									)}
								/>
								<span className="text-xs text-muted-foreground">
									{currentStatus.text}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar>
									<AvatarImage
										src={user.avatar}
										alt={safeName}
									/>
									<AvatarFallback>{initial}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{safeName}
									</span>
									<span className="truncate text-xs">
										{safeEmail}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<CircleSmall className="mr-2 h-4 w-4 text-gray-500" />
								<span>Status</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								{statusOptions.map((status) => (
									<DropdownMenuItem
										key={status.value}
										className="gap-2"
									>
										<span
											className={cn(
												"flex h-2 w-2 rounded-full",
												status.color
											)}
										/>
										<span>{status.label}</span>
									</DropdownMenuItem>
								))}
							</DropdownMenuSubContent>
						</DropdownMenuSub>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<Link href="/account-settings?section=account">
								<DropdownMenuItem>
									<BadgeCheck className="mr-2 h-4 w-4" />
									Account
								</DropdownMenuItem>
							</Link>
							<Link href="/account-settings?section=notifications">
								<DropdownMenuItem>
									<Bell className="mr-2 h-4 w-4" />
									Notifications
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut className="mr-2 h-4 w-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
