"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import placeholder from "@/public/images/placeholder.svg";

import { UserRegisterSchema } from "@/lib/schemas";
import { handleFormValidation } from "@/lib/formHandler";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";

export function SignupForm({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (loading) return; // evita doble submit

		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const parsed = handleFormValidation(formData, UserRegisterSchema);

		if (!parsed.success) {
			parsed.errors.forEach((issue) => {
				toast.error(issue.message);
			});
			setLoading(false);
			return;
		}

		// El backend setea la cookie httpOnly con el JWT
		const { data, error } = await fetcher<
			{ message?: string },
			typeof parsed.data
		>("/auth/sign-up", {
			method: "POST",
			body: parsed.data,
			// no hace falta needsAuth aquí, la cookie se setea en la respuesta
		});

		if (error) {
			toast.error(error);
			setLoading(false);
			return;
		}

		// Ya no guardamos token en localStorage
		toast.success(data?.message ?? "Account created successfully!");
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
									Create your account
								</h1>
								<p className="text-sm text-balance text-muted-foreground">
									Enter your details below to create your
									account
								</p>
							</div>

							<Field>
								<FieldLabel htmlFor="alias">Alias</FieldLabel>
								<Input
									id="alias"
									type="text"
									name="alias"
									placeholder="Miguel"
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									name="email"
									placeholder="m@example.com"
									autoComplete="email"
									required
								/>
								<FieldDescription>
									We&apos;ll use this to contact you. We will
									not share your email with anyone else.
								</FieldDescription>
							</Field>

							<Field>
								<Field className="grid grid-cols-2 gap-4">
									<Field>
										<FieldLabel htmlFor="password">
											Password
										</FieldLabel>
										<Input
											id="password"
											type="password"
											name="password"
											autoComplete="new-password"
											required
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="confirm_password">
											Confirm Password
										</FieldLabel>
										<Input
											id="confirm_password"
											name="confirm_password"
											type="password"
											autoComplete="new-password"
											required
										/>
									</Field>
								</Field>
								<FieldDescription>
									Must be at least 8 characters long.
								</FieldDescription>
							</Field>

							<Field>
								<Button
									type="submit"
									disabled={loading}
									aria-busy={loading}
									className="w-full"
								>
									{loading
										? "Creating account..."
										: "Create Account"}
								</Button>
							</Field>

							<FieldDescription className="text-center">
								Already have an account?{" "}
								<Link
									href="/login"
									className="font-medium underline underline-offset-4"
								>
									Sign in
								</Link>
							</FieldDescription>
						</FieldGroup>
					</form>

					<div className="relative hidden bg-muted md:block">
						<Image
							src={placeholder}
							alt="Signup illustration"
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
