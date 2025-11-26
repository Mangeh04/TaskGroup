"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { EmptyUser } from "@/components/nav/empty-users";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CustomDialog } from "@/components/custom/dialog";
import { BreadCrumbCustom } from "@/components/custom/breadCrumbCustom";
import { ScrollArea } from "@/components/ui/scroll-area";

import buttonIcon from "@/public/images/add-member.webp";
import { type Status, StatusEnum } from "@repo/types";
import { MemberCard, MemberCardProps } from "./components/member";

type UserData = MemberCardProps & { status: Status };

export default function MembersPage() {
	const users: Array<UserData> = [
		{
			name: "mangeh04",
			email: "mapsantamaria@esei.uvigo.es",
			avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/dragonite.jpeg",
			status: StatusEnum.ONLINE,
		},
		{
			name: "blackfox099",
			email: "urgonzalez@esei.uvigo.es",
			avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/mike.jpg",
			status: StatusEnum.ONLINE,
		},
		{
			name: "axiur",
			email: "axiur@esei.uvigo.es",
			avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/speed.webp",
			status: StatusEnum.DO_NOT_DISTURB,
		},
		{
			name: "alejandropxrez",
			email: "apmosquera@esei.uvigo.es",
			avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/miketyson.jpg",
			status: StatusEnum.AWAY,
		},
	];
	const params = useParams();
	const projectId = params.projectId as string;

	const hasMembers = users.length > 1;
	const breadcrumbItems = [
		{ label: "Home", href: "/dashboard" },
		{ label: "Project", href: `/dashboard/projectdetails/${projectId}` },
	];

	return (
		<>
			<header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b border-border">
				<SidebarTrigger />
				<BreadCrumbCustom
					items={breadcrumbItems}
					currentPage="Members"
				/>
			</header>

			{hasMembers ? (
				<ScrollArea className="flex-1 min-h-0">
					<div className="p-4 space-y-4">
						<div>
							<CustomDialog
								buttonString="Invite Members"
								title="Invite a new User"
								subtitle="Invite a person here. Enter their email to send an invite."
								confirmIcon={
									<Image
										src={buttonIcon}
										width={15}
										height={15}
										alt="Add new members to the project"
										className="dark:invert dark:brightness-100"
									/>
								}
							>
								<Label htmlFor="user-email-inv">
									User Email
								</Label>
								<Input
									id="user-email-inv"
									name="User Email Invitation"
									placeholder="a@example.com"
								/>
							</CustomDialog>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{users.map((user, index) => (
								<MemberCard
									key={index}
									name={user.name}
									email={user.email}
									avatar={user.avatar}
									status={user.status}
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
