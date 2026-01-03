"use client";

import { type FormEvent, type HTMLAttributes, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
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
import { useTranslations } from "next-intl";
import { useFetcherToast } from "@/hooks/useFetcherToast";

export function LoginForm({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const t = useTranslations("auth.login");

	const fetcherToast = useFetcherToast();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (loading) return;

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

		const { data, error } = await fetcherToast<
			{ message?: string },
			typeof parsed.data
		>("/auth/sign-in", {
			method: "POST",
			body: parsed.data,
			needsAuth: true,
		});

		if (error) {
			setLoading(false);
			return;
		}

		toast.success(data?.message ?? t("successToast"));
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
								<p className="text-balance text-muted-foreground">
									{t("subtitle")}
								</p>
							</div>

							<Field>
								<FieldLabel htmlFor="email">
									{t("emailLabel")}
								</FieldLabel>
								<Input
									name="email"
									id="email"
									type="email"
									placeholder={t("emailPlaceholder")}
									autoComplete="email"
									required
								/>
							</Field>

							<Field>
								<div className="flex items-center justify-between">
									<FieldLabel htmlFor="password">
										{t("passwordLabel")}
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
									{loading
										? t("buttonLoading")
										: t("buttonIdle")}
								</Button>
							</Field>

							<FieldDescription className="text-center">
								{t("signupPrompt")}{" "}
								<Link
									href="/register"
									className="font-medium underline underline-offset-4"
								>
									{t("signupLink")}
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
				{t("tosText")}{" "}
				<Link href="#" className="underline underline-offset-4">
					{t("tosTerms")}
				</Link>{" "}
				{t("and")}{" "}
				<Link href="#" className="underline underline-offset-4">
					{t("tosPrivacy")}
				</Link>
				.
			</FieldDescription>
		</div>
	);
}
