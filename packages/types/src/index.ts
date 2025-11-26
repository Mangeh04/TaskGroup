import {
	User as DatabaseUser,
	Status as DatabaseStatus,
	Task as DatabaseTask,
	Project as DataBaseProject,
	Role,
	Theme,
	ProfileConfiguration as DataBaseProfileConfiguration,
} from "@repo/database";

export type User = Omit<
	DatabaseUser,
	"password" | "aliasIv" | "emailIv" | "emailBi"
>;

export type Status = DatabaseStatus;
export { DatabaseStatus as StatusEnum };

export type Task = Omit<DatabaseTask, "descriptionIv" | "titleIv">;
export type Project = Omit<DataBaseProject, "descriptionIv" | "nameIv">;

export type ProjectMember = {
	role: Role;
	userId: string;
} & Omit<User, "password" | "emailBi" | "createdAt" | "updatedAt" | "id">;

export type TaskWithAssignments = Task & {
	assignments: {
		user: ProjectMember;
	}[];
};

export { Role as RoleEnum };
export { Theme as ThemeEnum };
export type ProfileConfiguration = Omit<
	DataBaseProfileConfiguration,
	"createdAt" | "updatedAt" | "userId"
>;

export type ProfileEndpoint = User & ProfileConfiguration;
