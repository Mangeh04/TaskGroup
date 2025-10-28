import { z } from "zod";

export const UserRegisterSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const UserLoginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(6, "Invalid password"),
});

export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
