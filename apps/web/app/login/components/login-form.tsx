"use client";

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
import { handleFormValidation } from "@/lib/formHandler";
import { UserLoginSchema } from "@/lib/schemas";

import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

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

		const { data, error } = await fetcher<
			{ access_token: string },
			typeof parsed.data
		>("/auth/login", {
			method: "POST",
			body: parsed.data,
		});

		if (error) {
			toast.error(error);
			return setLoading(false);
		}

		localStorage.setItem("jwt-token", data!.access_token);
		toast.success("Account created successfully!");
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
								<p className="text-muted-foreground text-balance">
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
									required
								/>
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">
										Password
									</FieldLabel>
								</div>
								<Input
									id="password"
									type="password"
									name="password"
									required
								/>
							</Field>
							<Field>
								<Button type="submit">Login</Button>
							</Field>
							<FieldDescription className="text-center">
								Don&apos;t have an account?{" "}
								<Link href="register">Sign up</Link>
							</FieldDescription>
						</FieldGroup>
					</form>
					<div className="bg-muted relative hidden md:block">
						<Image
							src={placeholder}
							alt="Image"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
							width={100}
							height={100}
						/>
					</div>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our{" "}
				<Link href="#">Terms of Service</Link> and{" "}
				<Link href="#">Privacy Policy</Link>.
			</FieldDescription>
		</div>
	);
}
