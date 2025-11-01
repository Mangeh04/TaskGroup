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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MemberStatus } from "@/app/dashboard/projectdetails/members/components/member";

// --> Array de estados
const statusOptions = [
  { value: "online", label: "Online", color: "bg-green-500" },
  { value: "away", label: "Away", color: "bg-yellow-500" },
  { value: "do not disturb", label: "Do not disturb", color: "bg-gray-500" },
  { value: "offline", label: "Offline", color: "bg-destructive" },
];

const statusStyles: Record<MemberStatus, { color: string; text: string }> = {
  online: { color: "bg-green-500", text: "Online" },
  offline: { color: "bg-destructive", text: "Offline" },
  away: { color: "bg-yellow-500", text: "Away" },
  "do not disturb": { color: "bg-gray-500", text: "Do not disturb" },
};

export function NavUser({
    user,
  }: {
  user: {
    name: string;
    email: string;
    avatar: string;
    status: MemberStatus;
  };
}) {
  const { isMobile } = useSidebar();
  const currentStatus = statusStyles[user.status];

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
                  src={user.avatar}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{user.name}
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
                    src={user.avatar}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user.name}
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
              <DropdownMenuItem>
                <BadgeCheck className="mr-2 h-4 w-4" />
                <Link href="/account-settings?section=account">
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <Link href="/account-settings?section=notifications">
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}