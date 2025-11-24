"use client";

import { type FormEvent, type HTMLAttributes, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/api";
import { handleFormValidation } from "@/lib/formHandler";
import { UserLoginSchema } from "@/lib/schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import placeholder from "@/public/images/binchillin.jpeg";
import { toast } from "sonner";

export function LoginForm({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (loading) return; // avoids 2x submit.

		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const parsed = handleFormValidation(formData, UserLoginSchema);

		if (!parsed.success) {
			parsed.errors.forEach((issue) => {
				toast.error(issue.message);
			});
			setLoading(false);
			return;
		}

		const { data, error } = await fetcher<
			{ message?: string },
			typeof parsed.data
		>("/auth/sign-in", {
			method: "POST",
			body: parsed.data,
			needsAuth: true,
		});

		if (error) {
			toast.error(error);
			setLoading(false);
			return;
		}

		toast.success(data?.message ?? "Logged in successfully!");
		setLoading(false);

		router.push("/dashboard");
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<form className="p-6 md:p-8" onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">
									Welcome back
								</h1>
								<p className="text-balance text-muted-foreground">
									Login to your Task Group account
								</p>
							</div>

							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									name="email"
									id="email"
									type="email"
									placeholder="m@example.com"
									autoComplete="email"
									required
								/>
							</Field>

							<Field>
								<div className="flex items-center justify-between">
									<FieldLabel htmlFor="password">
										Password
									</FieldLabel>
								</div>
								<Input
									id="password"
									type="password"
									name="password"
									autoComplete="current-password"
									required
								/>
							</Field>

							<Field>
								<Button
									type="submit"
									disabled={loading}
									aria-busy={loading}
									className="w-full"
								>
									{loading ? "Logging in..." : "Login"}
								</Button>
							</Field>

							<FieldDescription className="text-center">
								Don&apos;t have an account?{" "}
								<Link
									href="/register"
									className="font-medium underline underline-offset-4"
								>
									Sign up
								</Link>
							</FieldDescription>
						</FieldGroup>
					</form>

					<div className="relative hidden bg-muted md:block">
						<Image
							src={placeholder}
							alt="Login illustration"
							fill
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
							priority
						/>
					</div>
				</CardContent>
			</Card>

			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our{" "}
				<Link href="#" className="underline underline-offset-4">
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link href="#" className="underline underline-offset-4">
					Privacy Policy
				</Link>
				.
			</FieldDescription>
		</div>
	);
}
