"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { Users, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export type ProjectCardProps = {
	title: string;
	description: string;
	numTasks: number;
	numUsers: number;
};

export function ProjectCard({
	title,
	description,
	numTasks,
	numUsers,
}: ProjectCardProps) {
	const t = useTranslations("projects.card");

	return (
		<Card className="w-full flex flex-row items-center justify-between p-4 rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
			<div className="flex flex-col justify-center">
				<h3 className="text-lg font-semibold text-foreground tracking-tight">
					{title}
				</h3>
				<p className="text-sm text-muted-foreground">{description}</p>
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
			</div>
		</Card>
	);
}

export function SkeletonCard() {
	return (
		<Card
			data-project-card
			className="
        w-full flex flex-row items-center justify-between p-4
        rounded-2xl border border-border/40 bg-card
        shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer
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
