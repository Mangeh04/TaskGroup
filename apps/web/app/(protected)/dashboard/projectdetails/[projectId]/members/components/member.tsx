"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Status, RoleEnum } from "@repo/types";
import { statusStyles } from "@/components/nav/status";
import { useTranslations } from "next-intl";
import { use } from "react";

export type MemberCardProps = {
	name: string;
	email: string;
	avatar: string;
	status: Status;
	role: RoleEnum;
};

export function MemberCard({
	name,
	email,
	avatar,
	status,
	role,
}: MemberCardProps) {
	const tStatus = useTranslations("status");
	const tRole = useTranslations("roles");
	const currentStatus = statusStyles[status];

	return (
		<Card className="relative p-4 rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-start gap-4">
					<Avatar className="h-8 w-8 rounded-full">
						<AvatarImage src={avatar} alt={name} />
						<AvatarFallback className="rounded-full">
							{name.charAt(0).toLocaleUpperCase()}
						</AvatarFallback>
					</Avatar>

					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{name}</span>
						<span className="truncate text-xs text-muted-foreground">
							{email}
						</span>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<span
						className={cn(
							"flex h-2 w-2 rounded-full",
							currentStatus.color
						)}
					/>
					<span className="text-xs text-muted-foreground">
						{tStatus(currentStatus.key)}
					</span>
				</div>
				<span className="text-xs font-semibold text-muted-foreground">
					{tRole(`${role}`)}
				</span>
			</div>
		</Card>
	);
}
