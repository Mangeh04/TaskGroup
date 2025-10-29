import { IconFolderCode } from "@tabler/icons-react";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

import Image, { StaticImageData } from "next/image";

export type EmptyPageProps = {
	title: string;
	buttonString: string;
	imageSrc: StaticImageData;
	imageAlt: string;
};

export function EmptyPage({
	title,
	buttonString,
	imageSrc,
	imageAlt,
}: EmptyPageProps) {
	return (
		<Empty className="flex flex-col items-center justify-center text-center gap-6">
			<EmptyHeader className="flex flex-col items-center gap-4">
				<Image
					src={imageSrc}
					alt={imageAlt}
					height={120}
					width={120}
					className="opacity-80"
				/>
				<EmptyTitle className="text-2xl font-semibold text-gray-800">
					{title}
				</EmptyTitle>
			</EmptyHeader>

			<EmptyContent className="flex justify-center">
				<Button className="px-6 py-2">{buttonString}</Button>
			</EmptyContent>
		</Empty>
	);
}

// import { PlusIcon } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export function EmptyAvatarGroup() {
// 	return (
// 		<Empty>
// 			<EmptyHeader>
// 				<EmptyMedia>
// 					<div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
// 						<Avatar>
// 							<AvatarImage
// 								src="https://github.com/shadcn.png"
// 								alt="@shadcn"
// 							/>
// 							<AvatarFallback>CN</AvatarFallback>
// 						</Avatar>
// 						<Avatar>
// 							<AvatarImage
// 								src="https://github.com/maxleiter.png"
// 								alt="@maxleiter"
// 							/>
// 							<AvatarFallback>LR</AvatarFallback>
// 						</Avatar>
// 						<Avatar>
// 							<AvatarImage
// 								src="https://github.com/evilrabbit.png"
// 								alt="@evilrabbit"
// 							/>
// 							<AvatarFallback>ER</AvatarFallback>
// 						</Avatar>
// 					</div>
// 				</EmptyMedia>
// 				<EmptyTitle>No Team Members</EmptyTitle>
// 				<EmptyDescription>
// 					Invite your team to collaborate on this project.
// 				</EmptyDescription>
// 			</EmptyHeader>
// 			<EmptyContent>
// 				<Button size="sm">
// 					<PlusIcon />
// 					Invite Members
// 				</Button>
// 			</EmptyContent>
// 		</Empty>
// 	);
// }
