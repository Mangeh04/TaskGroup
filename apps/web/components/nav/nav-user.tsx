"use client";

import React, { useEffect, useState } from "react";
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
import { type ProfileEndpoint, StatusEnum } from "@repo/types";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { statusStyles } from "./status";
import { useUser } from "@/context/UserContext";

type NavUserProps = {
	user: Omit<
		ProfileEndpoint,
		"createdAt" | "language" | "theme" | "preference" | "updatedAt"
	>;
};

const DEFAULT_AVATAR =
	"https://github.com/Mangeh04/Storage/blob/main/dragonite.jpeg";

function NavUserInner({ user }: NavUserProps) {
	const { isMobile } = useSidebar();
	const router = useRouter();

	const [status, setStatus] = useState<StatusEnum>(user.status);

	useEffect(() => {
		setStatus(user.status);
	}, [user.status]);

	const currentStatus =
		statusStyles[status] ?? statusStyles[StatusEnum.ONLINE];

	const initial =
		user.alias.trim()[0]?.toLocaleUpperCase() ||
		user.email.trim()[0]?.toLocaleUpperCase() ||
		"?";

	const { refetchUser } = useUser();

	async function handleStatusChange(newStatus: StatusEnum) {
		setStatus(newStatus);

		const { error } = await fetcher("/user/preference", {
			method: "PATCH",
			body: { status: newStatus },
			needsAuth: true,
		});

		if (error) {
			toast.error("Failed to update status: " + error);
			setStatus(user.status);
		} else {
			toast.success(
				`Status set to ${capitalize(
					newStatus.toLowerCase().replaceAll("_", " ")
				)}`
			);
		}

		refetchUser();
	}

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

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

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
								<AvatarImage
									src={DEFAULT_AVATAR}
									alt={user.alias}
								/>
								<AvatarFallback>{initial}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{user.alias}
								</span>
								<span className="truncate text-xs">
									{user.email}
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
										src={DEFAULT_AVATAR}
										alt={user.alias}
									/>
									<AvatarFallback>{initial}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user.alias}
									</span>
									<span className="truncate text-xs">
										{user.email}
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
								{Object.entries(statusStyles).map(
									([value, info]) => (
										<DropdownMenuItem
											key={value}
											onClick={() =>
												handleStatusChange(
													value as StatusEnum
												)
											}
											className="gap-2"
										>
											<span
												className={cn(
													"flex h-2 w-2 rounded-full",
													info.color
												)}
											/>
											<span>{info.text}</span>
										</DropdownMenuItem>
									)
								)}
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

const NavUserMemo = React.memo(
	NavUserInner,
	(prev, next) =>
		prev.user.id === next.user.id &&
		prev.user.status === next.user.status &&
		prev.user.alias === next.user.alias &&
		prev.user.email === next.user.email
);

export function NavUser({ user }: NavUserProps) {
	if (!user) return null;

	return <NavUserMemo user={user} />;
}
