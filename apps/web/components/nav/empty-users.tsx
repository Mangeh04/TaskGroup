"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

import { InviteMember } from "../custom/inviteMember";

import { useTranslations } from "next-intl";

export function EmptyUser() {
	const t = useTranslations("sidebar");

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
				<InviteMember />
			</EmptyContent>
		</Empty>
	);
}
