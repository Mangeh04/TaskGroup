"use client";

import {
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/sideBar";
import {
	MemberCard,
	MemberCardProps,
} from "@/app/dashboard/projectdetails/[projectId]/members/components/member";
import { type Status, StatusEnum } from "@repo/types";

import { useTranslations } from "next-intl";

type DeveloperData = MemberCardProps & { status: Status };

export default function GroupInformationPage() {
	const t = useTranslations("groupInformation");

	const developers: Array<DeveloperData> = [
		{
			name: "Miguel Ángel Prol Santamaría",
			email: "mapsantamaria@esei.uvigo.es",
			avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/dragonite.jpeg",
			status: StatusEnum.ONLINE,
			role: "OWNER",
		},
		{
			name: "Uxío Raluy González",
			email: "urgonzalez@esei.uvigo.es",
			avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/binchilling.png",
			status: StatusEnum.ONLINE,
			role: "OWNER",
		},
		{
			name: "Alejandro Pérez Mosquera",
			email: "apmosquera@esei.uvigo.es",
			avatar: "https://raw.githubusercontent.com/Mangeh04/Storage/main/miketyson.jpg",
			status: StatusEnum.ONLINE,
			role: "OWNER",
		},
	];

	return (
		<div className="flex h-dvh overflow-hidden bg-white">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="flex flex-1 min-h-0 flex-col bg-white dark:bg-neutral-950">
					<header className="relative flex h-14 shrink-0 items-center gap-6 px-4 border-b">
						<SidebarTrigger />
						<h1 className="text-lg font-semibold">{t("title")}</h1>
					</header>

					<div className="flex-1 overflow-y-auto p-4 md:p-6">
						<div className="max-w-4xl mx-auto">
							<div className="mb-8">
								<h2 className="text-2xl font-bold tracking-tight">
									{t("heroTitle")}
								</h2>
								<p className="text-muted-foreground mt-2">
									{t("heroDescription")}
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{developers.map((user, index) => (
									<MemberCard
										key={index}
										name={user.name}
										email={user.email}
										avatar={user.avatar}
										status={user.status}
										role={user.role}
									/>
								))}
							</div>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
