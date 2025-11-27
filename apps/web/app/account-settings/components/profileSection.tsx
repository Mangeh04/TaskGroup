"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import type { User } from "@repo/types";

import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProfileSection({
	user,
}: {
	user: Omit<User, "id" | "createdAt" | "updatedAt" | "status"> & {
		avatar: string;
	};
}) {
	const t = useTranslations("settings.profile");

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-balance">
					{t("title")}
				</h1>
			</div>

			<Card>
				<CardContent className="p-6">
					<div className="space-y-6">
						<div className="flex items-center gap-4">
							<Avatar className="h-20 w-20">
								<AvatarImage src={user.avatar} />
								<AvatarFallback>AG</AvatarFallback>
							</Avatar>
							<div className="flex gap-2">
								<Button size="sm">
									<Upload />
									{t("uploadImage")}
								</Button>
								<Button variant="outline" size="sm">
									{t("removeImage")}
								</Button>
							</div>
						</div>

						{/* Personal info form */}
						<div className="space-y-2">
							<Label htmlFor="userName">
								{t("userNameLabel")}
							</Label>
							<Input id="userName" defaultValue={user.alias} />
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">{t("emailLabel")}</Label>
							<Input
								id="email"
								type="email"
								defaultValue={user.email}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
