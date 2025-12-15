"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
	Users,
	CheckCircle2,
	Briefcase,
	Heart,
	Gamepad2,
	Folder,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ProjectCategoryEnum } from "@repo/types";
import { JSX } from "react";

export type ProjectCardProps = {
	title: string;
	description: string;
	numTasks: number;
	numUsers: number;
	category: ProjectCategoryEnum;
};

export function ProjectCard({
	title,
	description,
	numTasks,
	numUsers,
	category,
}: ProjectCardProps) {
	const t = useTranslations("projects.card");
	const f = useTranslations("projectForm");

	const categoryIconMap: Record<ProjectCategoryEnum, JSX.Element> = {
		WORK: <Briefcase className="h-3 w-3 mr-1" />,
		PERSONAL: <Heart className="h-3 w-3 mr-1" />,
		HOBBY: <Gamepad2 className="h-3 w-3 mr-1" />,
		OTHER: <Folder className="h-3 w-3 mr-1" />,
	};

	const categoryBadgeClass: Record<ProjectCategoryEnum, string> = {
		WORK: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
		PERSONAL:
			"border-pink-500/30 bg-pink-500/10 text-pink-700 dark:text-pink-300",
		HOBBY: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
		OTHER: "border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
	};

	return (
		<Card className="relative w-full flex flex-row items-center justify-between p-4 rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
			<div className="flex flex-col justify-center min-w-0">
				<h3 className="text-lg font-semibold text-foreground tracking-tight truncate">
					{title}
				</h3>
				<p className="text-sm text-muted-foreground truncate">
					{description}
				</p>
			</div>

			<div className="flex flex-row items-center gap-8 text-sm text-muted-foreground">
				<div className="flex items-center gap-2">
					<CheckCircle2 className="w-4 h-4 text-primary" />
					<span className="font-medium text-foreground">
						{numTasks}
					</span>
					<Badge variant="destructive">
						{t("tasksBadge", { count: numTasks })}
					</Badge>
				</div>

				<div className="flex items-center gap-2">
					<Users className="w-4 h-4 text-primary" />
					<span className="font-medium text-foreground">
						{numUsers}
					</span>
					<Badge variant="blue">
						{t("usersBadge", { count: numUsers })}
					</Badge>
				</div>
				<div className="flex items-center gap-1">
					<Badge
						variant="outline"
						className={[
							"shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium flex items-center",
							categoryBadgeClass[category],
						].join(" ")}
					>
						{categoryIconMap[category]}
						{f(`categories.${category}`)}
					</Badge>
				</div>
			</div>
		</Card>
	);
}

export function SkeletonCard() {
	return (
		<Card
			data-project-card
			className="
        relative w-full flex flex-row items-center justify-between p-4
        rounded-2xl border border-border/40 bg-card
        shadow-sm hover:shadow-md transition-all duration-300
      "
		>
			<div className="flex flex-col justify-center gap-1 min-w-0">
				<Skeleton className="h-5 w-48 max-w-[60%] rounded-md animate-pulse" />
				<Skeleton className="h-4 w-72 max-w-[80%] rounded-md animate-pulse" />
			</div>

			<div className="flex flex-row items-center gap-8 text-sm">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-lg animate-pulse" />
					<Skeleton className="h-4 w-10 rounded-md animate-pulse" />
					<Skeleton className="h-5 w-16 rounded-full animate-pulse" />
				</div>

				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-lg animate-pulse" />
					<Skeleton className="h-4 w-10 rounded-md animate-pulse" />
					<Skeleton className="h-5 w-16 rounded-full animate-pulse" />
				</div>
			</div>
		</Card>
	);
}
