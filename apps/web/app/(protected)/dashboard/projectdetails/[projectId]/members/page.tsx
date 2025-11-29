"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { fetcher } from "@/lib/api";
import type { ProjectMember } from "@repo/types";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { EmptyUser } from "@/components/nav/empty-users";
import { BreadCrumbCustom } from "@/components/custom/breadCrumbCustom";
import { ScrollArea } from "@/components/ui/scroll-area";

import { InviteMember } from "@/components/custom/inviteMember";
import { MemberCard } from "./components/member";

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
							<InviteMember />
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
