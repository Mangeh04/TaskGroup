import { PlusIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { CustomDialog } from "@/components/custom/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import buttonIcon from "@/public/images/add-member.webp";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function EmptyUser() {
	const params = useParams();
	const projectId = params.projectId as string;
	const t = useTranslations("sidebar");

	const [email, setEmail] = useState("");

	const onSubmit = useCallback(async () => {
		if (!email || email.trim() === "") {
			toast.error("Please enter an email address");
			return;
		}

		const { error } = await fetcher(`/project/${projectId}/invite`, {
			method: "POST",
			body: { email: email },
			needsAuth: true,
		});

		if (error) {
			toast.error("Failed to send invite: " + error);
		} else {
			toast.success("Invitation sent to" + email);
		}
	}, [email, projectId]);

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
						<Avatar>
							<AvatarImage
								src="https://raw.githubusercontent.com/Mangeh04/Storage/main/perro.jpeg"
								alt="@shadcn"
							/>
							<AvatarFallback>M</AvatarFallback>
						</Avatar>
						<Avatar>
							<AvatarImage
								src="https://raw.githubusercontent.com/Mangeh04/Storage/main/speed.webp"
								alt="@maxleiter"
							/>
							<AvatarFallback>U</AvatarFallback>
						</Avatar>
						<Avatar>
							<AvatarImage
								src="https://raw.githubusercontent.com/Mangeh04/Storage/main/mike.jpg"
								alt="@evilrabbit"
							/>
							<AvatarFallback>A</AvatarFallback>
						</Avatar>
					</div>
				</EmptyMedia>
				<EmptyTitle>{t("emptyMember.title")}</EmptyTitle>
				<EmptyDescription>
					{t("emptyMember.description")}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
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
			</EmptyContent>
		</Empty>
	);
}
