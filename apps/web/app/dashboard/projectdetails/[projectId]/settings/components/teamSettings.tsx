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
import { InviteMemberDialog } from "../../settings/components/inviteMembersDialog";
import { RoleEnum } from "@repo/types";

export function TeamSettings({
	users,
}: {
	users: Array<{
		id: string;
		username: string;
		role: RoleEnum;
	}>;
}) {
	const [members, setMembers] = useState(users);

	const updateRole = (id: string, role: RoleEnum) => {
		setMembers((prev) =>
			prev.map((m) => (m.id === id ? { ...m, role } : m))
		);
	};

	const removeMember = (id: string) =>
		setMembers((prev) => prev.filter((m) => m.id !== id));

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
					<InviteMemberDialog />
				</div>
				<Separator />

				<div className="space-y-3">
					{members.map((m) => (
						<div
							key={m.id}
							className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 rounded-xl border p-3"
						>
							<div className="md:col-span-5 flex items-center gap-3">
								<div className="size-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
									{m.username[0]}
								</div>
								<div className="leading-tight">
									<div className="font-medium">
										{m.username}
									</div>
									<div className="text-xs text-muted-foreground">
										{m.role}
									</div>
								</div>
							</div>
							<div className="md:col-span-4">
								<Select
									value={m.role}
									onValueChange={(v) =>
										updateRole(m.id, v as RoleEnum)
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
									text={`Remove @${m.username} from project?`}
								>
									<Button
										variant="destructive"
										size="sm"
										className="gap-2"
										onClick={() => removeMember(m.id)}
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
