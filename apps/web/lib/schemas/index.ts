import { z } from "zod";

export const UserRegisterSchema = z.object({
	alias: z.string().min(1, "Name is required"),
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
	confirm_password: z
		.string()
		.min(8, "Confirm Password must be at least 8 characters long"),
});

export const UserLoginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Invalid password"),
});

export const TaskFormSchema = z.object({
	title: z.string().min(1, "Title is required").max(60),
	description: z.string().optional(),
	userId: z.string().min(1, "You must assign the task to a user"),
	isCompleted: z.boolean().default(false),
});

export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type TaskFormValues = z.infer<typeof TaskFormSchema>;
