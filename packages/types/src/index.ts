import {
	User as DatabaseUser,
	Status as DatabaseStatus,
	Task as DatabaseTask,
	Project as DataBaseProject,
	Role,
	Theme,
	ProfileConfiguration as DataBaseProfileConfiguration,
	TaskAssignedNotification,
	ProjectInviteNotification,
} from "@repo/database";

export type User = Omit<
	DatabaseUser,
	"password" | "aliasIv" | "emailIv" | "emailBi"
>;

export type Status = DatabaseStatus;
export { DatabaseStatus as StatusEnum };

export type Task = Omit<DatabaseTask, "descriptionIv" | "titleIv">;
export type Project = Omit<
	DataBaseProject,
	"descriptionIv" | "nameIv" | "updatedAt"
>;

export type ProjectMember = {
	role: Role;
	userId: string;
	user: Omit<
		User,
		"password" | "emailBi" | "createdAt" | "updatedAt" | "id"
	> & {
		config: {
			status: Status;
		};
	};
};

export type TaskEndpoint = Task & {
	assignedUser: Omit<User, "createdAt" | "updatedAt" | "id">;
};

export { Role as RoleEnum };
export { Theme as ThemeEnum };
export type ProfileConfiguration = Omit<
	DataBaseProfileConfiguration,
	"createdAt" | "updatedAt" | "userId"
>;

export type ProfileEndpoint = User & ProfileConfiguration;

export type ProjectInviteDTO = ProjectInviteNotification & {
	holder: Pick<User, "alias">;
	inviter: Pick<User, "alias">;
	project: Pick<Project, "name">;
};

export type TaskAssignedDTO = TaskAssignedNotification & {
	holder: Pick<User, "alias">;
	inviter: Pick<User, "alias">;
	project: Pick<Project, "name">;
	task: Pick<Task, "title">;
};

export type NotificationsEndpoint = readonly [
	ProjectInviteDTO[],
	TaskAssignedDTO[],
];

export type Notification = TaskAssignedNotification | ProjectInviteNotification;

export type NotificationPayload =
	| InviteNotificationPayload
	| AssignNotificationPayload;

export interface InviteNotificationPayload {
	invitedUserId: string;
	projectName: string;
	projectId: string;
	inviterAlias: string;
}

export interface AssignNotificationPayload {
	assignedUserId: string;
	assignerName: string;
	taskName: string;
	projectId: string;
}

export enum EVENTS {
	TASK_ASSIGNED = "task.assigned",
	PROJECT_INVITED = "project.invited",
	AUTH_ERROR = "auth_error",
}
