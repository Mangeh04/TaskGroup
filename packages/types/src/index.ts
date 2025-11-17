import {
	User as DatabaseUser,
	Status as DatabaseStatus,
	Task as DatabaseTask,
	Project as DataBaseProject,
} from "@repo/database";

export type User = Omit<
	DatabaseUser,
	"password" | "aliasIv" | "emailIv" | "emailBi"
>;

export type Status = DatabaseStatus;
export { DatabaseStatus as StatusEnum };

export type Task = Omit<DatabaseTask, "descriptionIv" | "titleIv">;
export type Project = Omit<DataBaseProject, "descriptionIv" | "nameIv">;

export type ProjectMember = Pick<User, "id" | "alias">;

export type TaskWithAssignments = Task & {
	assignments: {
		user: ProjectMember;
	}[];
};
