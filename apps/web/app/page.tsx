"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { UserLoginSchema } from "@repo/schemas";
import { z } from "zod";

export default function HomePage() {
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);

		let parsed;
		try {
			console.log(Object.fromEntries(formData.entries()));
			parsed = UserLoginSchema.parse(
				Object.fromEntries(formData.entries())
			);
		} catch (err: z.ZodError | any) {
			if (err instanceof z.ZodError) {
				err.issues.forEach((issue) => {
					toast.error(issue.message);
				});
			}

			return setLoading(false);
		}

		try {
			const res = await fetch("BACKEND", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(parsed),
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				throw new Error(errorData.message || "Login failed");
			}

			const responseData = await res.json();
			toast.success(`Welcome ${responseData.user?.name || "back"}!`);
			// Redirect here if needed
		} catch (err: any) {
			toast.error(err.message || "An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-muted/20">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md rounded-xl border bg-background shadow-sm p-6 md:p-8 space-y-6"
			>
				<FieldGroup>
					<FieldSet>
						<FieldLegend className="text-lg font-semibold">
							Log-In
						</FieldLegend>
						<FieldDescription className="text-muted-foreground">
							Introduce your information.
						</FieldDescription>

						<div className="mt-6 space-y-6">
							<Field>
								<FieldLabel htmlFor="user_email_label">
									Email
								</FieldLabel>
								<Input
									id="user_email_input"
									name="email"
									placeholder="Introduce your email"
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="user_password_label">
									Password
								</FieldLabel>
								<Input
									id="user_password_input"
									name="password"
									type="password"
									placeholder="Introduce your password"
									required
								/>
							</Field>
						</div>
					</FieldSet>

					<FieldSeparator className="my-6" />

					<Field
						orientation="horizontal"
						className="justify-between gap-2 mt-2"
					>
						<Link href="/register">
							<Button type="button" variant="outline">
								Create Account
							</Button>
						</Link>
						<Button type="submit" disabled={loading}>
							{loading ? "Logging in..." : "Log In"}
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}
