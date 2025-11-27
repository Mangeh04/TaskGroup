"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Image from "next/image";
import { toast } from "sonner";
import { fetcher } from "@/lib/api";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { EmptyUser } from "@/components/nav/empty-users";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CustomDialog } from "@/components/custom/dialog";
import { BreadCrumbCustom } from "@/components/custom/breadCrumbCustom";
import { ScrollArea } from "@/components/ui/scroll-area";

import buttonIcon from "@/public/images/add-member.webp";
import { MemberCard } from "./components/member";
import { useTranslations } from "next-intl";
import type { ProjectMember } from "@repo/types";

const DEFAULT_AVATAR =
	"https://raw.githubusercontent.com/Mangeh04/Storage/main/binchilling.png";

export default function MembersPage() {
	const t = useTranslations("members.page");

	const params = useParams();
	const projectId = params.projectId as string;

	const [users, setUsers] = useState<ProjectMember[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	const fetchMembers = useCallback(async () => {
		if (!projectId) return;

		setIsFetching(true);
		const { data, error } = await fetcher<ProjectMember[]>(
			`/project/${projectId}/members`,
			{
				method: "GET",
				needsAuth: true,
			}
		);

		if (error) {
			toast.error(error);
		} else {
			setUsers(data ?? []);
		}
		setIsFetching(false);
	}, [projectId]);

	useEffect(() => {
		void fetchMembers();
	}, [fetchMembers]);

	const hasMembers = users.length > 0;
	const breadcrumbItems = [
		{ label: t("breadcrumbHome"), href: "/dashboard" },
		{
			label: t("breadcrumbProject"),
			href: `/dashboard/projectdetails/${projectId}`,
		},
	];

	return (
		<>
			<header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b border-border">
				<SidebarTrigger />
				<BreadCrumbCustom
					items={breadcrumbItems}
					currentPage={t("breadcrumbCurrent")}
				/>
			</header>

			{hasMembers ? (
				<ScrollArea className="flex-1 min-h-0">
					<div className="p-4 space-y-4">
						<div>
							<CustomDialog
								buttonString={t("inviteButton")}
								title={t("inviteTitle")}
								subtitle={t("inviteSubtitle")}
								confirmIcon={
									<Image
										src={buttonIcon}
										width={15}
										height={15}
										alt={t("inviteIconAlt")}
										className="dark:invert dark:brightness-100"
									/>
								}
							>
								<Label htmlFor="user-email-inv">
									{t("inviteEmailLabel")}
								</Label>
								<Input
									id="user-email-inv"
									name="User Email Invitation"
									placeholder={t("inviteEmailPlaceholder")}
								/>
							</CustomDialog>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{users.map((member, index) => (
								<MemberCard
									key={index}
									name={member.user.alias}
									email={member.user.email}
									avatar={DEFAULT_AVATAR}
									role={member.role}
									status={member.user.config.status}
								/>
							))}
						</div>
					</div>
				</ScrollArea>
			) : (
				<EmptyUser />
			)}
		</>
	);
}
