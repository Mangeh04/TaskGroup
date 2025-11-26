import {
	User as DatabaseUser,
	Status as DatabaseStatus,
	Task as DatabaseTask,
	Project as DataBaseProject,
	Role,
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
