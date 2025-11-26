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

export type TeamSettingsProps = {
	users: Array<ProjectMember>;
};

export function TeamSettings({ users }: TeamSettingsProps) {
	const [members, setMembers] = useState(users);

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
					<Users className="size-4" /> Team
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex justify-between items-center">
					<div className="text-sm text-muted-foreground">
						Manage roles and invitations.
					</div>
					<CustomDialog
						buttonString="Invite Members"
						title="Invite a new User"
						subtitle="Invite a person here. Introduce his email to invite."
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
						<Label htmlFor="user-email-inv">Task Name</Label>
						<Input
							id="user-email-inv"
							name="User Email Invitation"
							placeholder="a@example.com"
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
									{m.alias[0]}
								</div>
								<div className="leading-tight">
									<div className="font-medium">{m.alias}</div>
									<div className="text-xs text-muted-foreground">
										{m.role}
									</div>
								</div>
							</div>
							<div className="md:col-span-4">
								<Select
									value={m.role}
									onValueChange={(v) =>
										updateRole(m.userId, v as RoleEnum)
									}
								>
									<SelectTrigger className="w-full md:w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Owner">
											Owner
										</SelectItem>
										<SelectItem value="Admin">
											Admin
										</SelectItem>
										<SelectItem value="Member">
											Member
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="md:col-span-3 md:ml-auto flex md:justify-end gap-2">
								{/* @ts-expect-error ConfirmationDialog does not have its type properly defined  */}
								<ConfirmationDialog
									dialogAction="remove"
									objective="member"
									text={`Remove @${m.alias} from project?`}
								>
									<Button
										variant="destructive"
										size="sm"
										className="gap-2"
										onClick={() => removeMember(m.userId)}
									>
										<Trash2 className="size-4" /> Remove
									</Button>
								</ConfirmationDialog>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
