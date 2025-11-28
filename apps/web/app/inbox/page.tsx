"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";

import AppSidebar from "@/components/custom/sideBar";
import { EmptyPage } from "@/components/custom/empty";
import { Loader2 } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";

import emptyInboxImage from "@/public/images/empty-inbox.webp";

import {
	NotificationCard,
	SkeletonNotificationCard,
} from "@/app/inbox/components/notification";
import { useTranslations } from "next-intl";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";
import type {
	NotificationsEndpoint,
	ProjectInviteDTO,
	TaskAssignedDTO,
} from "@repo/types";

export default function InboxPage() {
	const [isLoading, setIsLoading] = useState(true);

	const [notifications, setNotis] = useState<NotificationsEndpoint[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	const fetchData = useCallback(async () => {
		setIsFetching(true);

		const { data, error } = await fetcher<NotificationsEndpoint[]>(
			`/notification/`,
			{
				method: "GET",
				needsAuth: true,
			}
		);

		if (error) {
			toast.error(error);
			setNotis([]);
			setIsFetching(false);
			return;
		}

		setNotis(data!);
		setIsFetching(false);
	}, []);

	useEffect(() => {
		void fetchData();
	}, [fetchData]);

	const t = useTranslations("inbox");
	const tg = useTranslations("generic");

	const hasNotifications = useMemo(
		() => notifications.some((e) => e.length > 0),
		[notifications]
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	const handleConfirm = useCallback(() => {
		console.log("Invitation Confirmed");
	}, []);

	const handleReject = useCallback(() => {
		console.log("Invitation Rejected");
	}, []);

	return (
		<div className="flex h-dvh overflow-hidden bg-white">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="flex flex-1 min-h-0 flex-col bg-white dark:bg-neutral-950">
					<header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
						<SidebarTrigger />
						<h1 className="text-lg font-semibold">{t("title")}</h1>

						{isLoading && (
							<div className="ml-auto flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground/80" />
								<span className="text-xs text-muted-foreground">
									{tg("loading")}
								</span>
							</div>
						)}
					</header>

					{hasNotifications ? (
						<div className="flex-1 overflow-hidden">
							{isLoading ? (
								<div className="flex flex-col p-4 lg:p-6">
									{Array.from({ length: 4 }).map((_, i) => (
										<SkeletonNotificationCard
											key={`skeleton_${i}`}
										/>
									))}
								</div>
							) : (
								<ScrollArea className="h-full p-4 lg:p-6">
									{(
										notifications[0] as unknown as ProjectInviteDTO[]
									).map((item, index) => (
										<NotificationCard
											key={index}
											user={item.inviter.alias}
											project={item.project.name}
											type={"Invitation"}
											onConfirm={handleConfirm}
											onReject={handleReject}
										/>
									))}
									{(
										notifications[1] as unknown as TaskAssignedDTO[]
									).map((item, index) => (
										<NotificationCard
											key={index}
											user={item.inviter.alias}
											project={item.project.name}
											task={item.task.title}
											type={"AddedTask"}
											onConfirm={handleConfirm}
											onReject={handleReject}
										/>
									))}
								</ScrollArea>
							)}
						</div>
					) : (
						<div className="flex flex-1 items-center justify-center p-6 overflow-hidden">
							<EmptyPage
								title={t("emptyTitle")}
								buttonString={t("emptyButton")}
								imageSrc={emptyInboxImage}
								imageAlt="Empty inbox illustration"
							/>
						</div>
					)}
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
