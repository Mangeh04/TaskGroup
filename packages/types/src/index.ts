import {
	User as DatabaseUser,
	Status as DatabaseStatus,
	State as DatabaseState,
	Priority as DatabasePriority,
	Task as DatabaseTask,
	Project as DataBaseProject,
	Role,
	Theme,
	ProfileConfiguration as DataBaseProfileConfiguration,
	TaskAssignedNotification,
	ProjectInviteNotification,
	ProjectCategory,
} from "@repo/database";

export type User = Omit<
	DatabaseUser,
	"password" | "aliasIv" | "emailIv" | "emailBi"
>;

export type Status = DatabaseStatus;
export { DatabaseStatus as StatusEnum };

export type State = DatabaseState;
export { DatabaseState as StateEnum };

export type Priority = DatabasePriority;
export { DatabasePriority as PriorityEnum };

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
	task: Pick<Task, "title"> & {
		project: Pick<Project, "name">;
	};
};

export type NotificationsEndpoint = readonly [
	ProjectInviteDTO[],
	TaskAssignedDTO[],
];

export type Notification = TaskAssignedNotification | ProjectInviteNotification;

export type NotificationPayload =
	| InviteNotificationPayload
	| AssignNotificationPayload;

export type InviteNotificationPayload = {
	invitedUserId: string;
	projectName: string;
	projectId: string;
	inviterId: string;
	inviterAlias: string;
};

export type AssignNotificationPayload = {
	assignedUserId: string;
	assignerUserId: string;
	assignerName: string;
	taskId: string;
	taskName: string;
	projectId: string;
};

export enum EVENTS {
	TASK_ASSIGNED = "task.assigned",
	PROJECT_INVITED = "project.invited",
	AUTH_ERROR = "auth_error",
}

export { ProjectCategory as ProjectCategoryEnum };
