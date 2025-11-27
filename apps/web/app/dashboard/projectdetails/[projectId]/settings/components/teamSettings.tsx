"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/custom/confirmation";
import { Button } from "@/components/ui/button";
import { ProjectMember, RoleEnum } from "@repo/types";
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import buttonIcon from "@/public/images/add-member.webp";
import { useTranslations } from "next-intl";

export type TeamSettingsProps = {
	users: Array<ProjectMember>;
};

export function TeamSettings({ users }: TeamSettingsProps) {
	const [members, setMembers] = useState(users);

	const t = useTranslations("projectSettings.team");
	const tRoles = useTranslations("roles");

	const updateRole = (id: string, role: RoleEnum) => {
		setMembers((prev) =>
			prev.map((m) => (m.userId === id ? { ...m, role } : m))
		);
	};

	const removeMember = (id: string) =>
		setMembers((prev) => prev.filter((m) => m.userId !== id));

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardHeader>
				<CardTitle className="text-base flex items-center gap-2">
					<Users className="size-4" /> {t("cardTitle")}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex justify-between items-center">
					<div className="text-sm text-muted-foreground">
						{t("cardDescription")}
					</div>
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
				<Separator />

				<div className="space-y-3">
					{members.map((m) => (
						<div
							key={m.userId}
							className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 rounded-xl border p-3"
						>
							<div className="md:col-span-5 flex items-center gap-3">
								<div className="size-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
									{m.user.alias[0]}
								</div>
								<div className="leading-tight">
									<div className="font-medium">
										{m.user.alias}
									</div>
									<div className="text-xs text-muted-foreground">
										{tRoles(m.role)}
									</div>
								</div>
							</div>

							<div className="md:col-span-4">
								<Select
									value={m.role}
									onValueChange={(v) =>
										updateRole(m.userId, v as RoleEnum)
									}
									disabled={m.role === "OWNER"}
								>
									<SelectTrigger className="w-full md:w-48">
										<SelectValue
											placeholder={tRoles(m.role)}
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={RoleEnum.ADMIN}>
											{tRoles("ADMIN")}
										</SelectItem>
										<SelectItem value={RoleEnum.MEMBER}>
											{tRoles("MEMBER")}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="md:col-span-3 md:ml-auto flex md:justify-end gap-2">
								{m.role !== "OWNER" && (
									// @ts-expect-error ConfirmationDialog does not have its type properly defined
									<ConfirmationDialog
										dialogAction="remove"
										objective={t("removeObjective")}
										text={t("removeConfirmText", {
											alias: m.user.alias,
										})}
									>
										<Button
											variant="destructive"
											size="sm"
											className="gap-2"
											onClick={() =>
												removeMember(m.userId)
											}
										>
											<Trash2 className="size-4" />{" "}
											{t("removeButton")}
										</Button>
									</ConfirmationDialog>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
