"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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

import placeholder from "@/public/images/sneaky.jpg";

import { UserRegisterSchema } from "@/lib/schemas";
import { handleFormValidation } from "@/lib/formHandler";
import { fetcher } from "@/lib/api";

export function SignupForm({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const t = useTranslations("auth.register");
	const tErrors = useTranslations("errors");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (loading) return;

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

		const { error } = await fetcher<
			{ message?: string },
			typeof parsed.data
		>("/auth/sign-up", {
			method: "POST",
			body: parsed.data,
			needsAuth: true,
		});

		if (error) {
			toast.error(tErrors(error.raw as string));

			setLoading(false);
			return;
		}

		toast.success(t("successToast"));
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
									{t("title")}
								</h1>
								<p className="text-sm text-balance text-muted-foreground">
									{t("subtitle")}
								</p>
							</div>

							<Field>
								<FieldLabel htmlFor="alias">
									{t("aliasLabel")}
								</FieldLabel>
								<Input
									id="alias"
									type="text"
									name="alias"
									placeholder={t("aliasPlaceholder")}
									required
								/>
							</Field>

							<Field>
								<FieldLabel htmlFor="email">
									{t("emailLabel")}
								</FieldLabel>
								<Input
									id="email"
									type="email"
									name="email"
									placeholder={t("emailPlaceholder")}
									autoComplete="email"
									required
								/>
								<FieldDescription>
									{t("emailDescription")}
								</FieldDescription>
							</Field>

							<Field>
								<Field className="grid grid-cols-2 gap-4">
									<Field>
										<FieldLabel htmlFor="password">
											{t("passwordLabel")}
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
											{t("confirmPasswordLabel")}
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
									{t("passwordDescription")}
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
										? t("buttonLoading")
										: t("buttonIdle")}
								</Button>
							</Field>

							<FieldDescription className="text-center">
								{t("loginPrompt")}{" "}
								<Link
									href="/login"
									className="font-medium underline underline-offset-4"
								>
									{t("loginLink")}
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
				{t("tosText")}{" "}
				<Link href="#" className="underline underline-offset-4">
					{t("tosTerms")}
				</Link>{" "}
				and{" "}
				<Link href="#" className="underline underline-offset-4">
					{t("tosPrivacy")}
				</Link>
				.
			</FieldDescription>
		</div>
	);
}
