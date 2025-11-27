import { type Status, StatusEnum } from "@repo/types";

export const statusStyles: Record<Status, { color: string; key: string }> = {
	[StatusEnum.ONLINE]: { color: "bg-green-500", key: "online" },
	[StatusEnum.OFFLINE]: { color: "bg-destructive", key: "offline" },
	[StatusEnum.AWAY]: { color: "bg-yellow-500", key: "away" },
	[StatusEnum.DO_NOT_DISTURB]: {
		color: "bg-gray-500",
		key: "dnd",
	},
};
