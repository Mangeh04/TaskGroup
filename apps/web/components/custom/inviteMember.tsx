"use client";
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import Image from "next/image";
import { useCallback, useState } from "react";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import buttonIcon from "@/public/images/add-member.webp";

export function InviteMember() {
	const params = useParams();
	const projectId = params.projectId as string;
	const t = useTranslations("sidebar");

	const [email, setEmail] = useState("");

	const onSubmit = useCallback(async () => {
		if (!email || email.trim() === "") {
			toast.error(t("emptyMember.form.emptyEmailToast"));
			return;
		}

		const { error } = await fetcher(`/project/${projectId}/invite`, {
			method: "POST",
			body: { email: email },
			needsAuth: true,
		});

		if (error) {
			toast.error(t("emptyMember.form.invitationFailedToast", { email }));
		} else {
			toast.success(t("emptyMember.form.invitedToast", { email }));
		}
	}, [email, projectId, t]);

	return (
		<CustomDialog
			buttonString={t("emptyMember.button")}
			title={t("emptyMember.form.title")}
			subtitle={t("emptyMember.form.subtitle")}
			confirmIcon={
				<Image
					src={buttonIcon}
					width={15}
					height={15}
					alt={t("emptyMember.form.alt")}
					className="dark:invert dark:brightness-100"
				/>
			}
			onSubmit={onSubmit}
		>
			<Label htmlFor="user-email-inv">
				{t("emptyMember.form.email")}
			</Label>
			<Input
				id="user-email-inv"
				name="User Email Invitation"
				placeholder={t("emptyMember.form.example")}
				onChange={(e) => setEmail(e.target.value)}
			/>
		</CustomDialog>
	);
}
