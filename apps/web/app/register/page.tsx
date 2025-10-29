"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserLoginSchema } from "@repo/schemas";

import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { handleFormValidation } from "../_utils/formHandler";

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);

		const parsed = handleFormValidation(formData, UserLoginSchema);

		if (!parsed.success) {
			parsed.errors.forEach((issue) => {
				toast.error(issue.message);
			});
			return setLoading(false);
		}

		setLoading(false);
	}
	return (
		<div className="flex items-center justify-center min-h-screen bg-muted/20">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md rounded-xl p-6 md:p-8 space-y-6"
			>
				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle>Register</CardTitle>
						<CardDescription>
							Enter your email below to register your account
						</CardDescription>
						<CardAction>
							<Link href="/">
								<Button variant="link">Log In</Button>
							</Link>
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="user_username_label">
									Username
								</Label>
								<Input
									id="user_username_input"
									name="username"
									type="text"
									placeholder="Mangeh04"
									required
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="user_email_label">Email</Label>
								<Input
									id="user_email_input"
									name="email"
									type="email"
									placeholder="m@example.com"
									required
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="password">Password</Label>
								</div>
								<Input
									id="user_password_input"
									name="password"
									type="password"
									required
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex-col gap-2">
						<Button
							type="submit"
							disabled={loading}
							className="w-full"
						>
							{loading ? "Registering..." : "Register"}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</div>
	);
}
