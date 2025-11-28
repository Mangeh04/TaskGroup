"use client";

import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export type NotificationCardProps = {
	user: string;
	project: string;
	task?: string;
	type: "Invitation" | "AddedTask";
	onConfirm?: () => void;
	onReject?: () => void;
};

export function NotificationCard(props: NotificationCardProps) {
	const { user, project, task, type, onConfirm, onReject } = props;
	const isInvitation = type === "Invitation";

	const t = useTranslations("notifications.card");

	return (
		<Card className="w-full mb-4">
			<div className="flex items-center justify-between px-4 py-0">
				<div className="flex items-start gap-4">
					<div className="shrink-0 size-8 rounded-full bg-black flex items-center justify-center text-white font-semibold">
						{project[0]}
					</div>

					<div className="flex flex-col gap-1">
						<h3 className="font-semibold text-foreground tracking-tight">
							{isInvitation
								? t("invitationTitle")
								: t("taskTitle", { task: task! })}
						</h3>
						<p className="text-sm text-muted-foreground">
							{isInvitation
								? t("invitationBody", { user, project })
								: t("taskBody", { user, project })}
						</p>
					</div>
				</div>

				{isInvitation ? (
					<div className="flex gap-2">
						<Button
							onClick={onConfirm}
							variant="outline"
							size="icon"
							className="text-green-600 hover:text-green-600 border-green-600/40 hover:bg-green-50"
						>
							<Check className="size-4" />
						</Button>
						<Button
							onClick={onReject}
							variant="outline"
							size="icon"
							className="text-red-600 hover:text-red-600 border-red-600/40 hover:bg-red-50"
						>
							<X className="size-4" />
						</Button>
					</div>
				) : (
					<Button
						onClick={onReject}
						variant="outline"
						size="icon"
						className="text-red-600 hover:text-red-600 border-red-600/40 hover:bg-red-50"
					>
						<X className="size-4" />
					</Button>
				)}
			</div>
		</Card>
	);
}

export function SkeletonNotificationCard() {
	return (
		<Card className="w-full mb-4">
			<div className="flex items-center justify-between px-4 py-0">
				<div className="flex items-start gap-4">
					<Skeleton className="size-8 rounded-full bg-neutral-300/80 animate-pulse shrink-0" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-5 w-32 rounded-md bg-neutral-300/80 animate-pulse" />
						<Skeleton className="h-4 w-64 rounded-md bg-neutral-300/80 animate-pulse" />
					</div>
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-9 w-9 rounded-md bg-neutral-300/80 animate-pulse" />
					<Skeleton className="h-9 w-9 rounded-md bg-neutral-300/80 animate-pulse" />
				</div>
			</div>
		</Card>
	);
}
