import { z } from "zod";

export const UserRegisterSchema = z.object({
	name: z.string().min(1, "Name is required"),
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

export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
