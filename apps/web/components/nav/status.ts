import { type Status, StatusEnum } from "@repo/types";

export const statusStyles: Record<Status, { color: string; text: string }> = {
	[StatusEnum.ONLINE]: { color: "bg-green-500", text: "Online" },
	[StatusEnum.OFFLINE]: { color: "bg-destructive", text: "Offline" },
	[StatusEnum.AWAY]: { color: "bg-yellow-500", text: "Away" },
	[StatusEnum.DO_NOT_DISTURB]: {
		color: "bg-gray-500",
		text: "Do not disturb",
	},
};
