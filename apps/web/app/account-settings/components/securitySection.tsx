"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { fetcher } from "@/lib/api";
import { toast } from "sonner";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

export function SecuritySection({ email }: { email: string }) {
	const t = useTranslations("settings.security");

	const onPasswordSubmit = useCallback(async () => {
		const { error } = await fetcher<boolean>("/auth/changePassword", {
			method: "POST",
			body: {
				email: email,
				password: (
					document.getElementById(
						"currentPassword"
					) as HTMLInputElement
				).value,
				new_password1: (
					document.getElementById("newPassword") as HTMLInputElement
				).value,
				new_password2: (
					document.getElementById(
						"confirmPassword"
					) as HTMLInputElement
				).value,
			},
			needsAuth: true,
		});

		if (error) {
			toast.error(t("toastError"));
			console.error(error);
		} else {
			toast.success(t("toastSuccess"));
		}
	}, [email, t]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-balance">
					{t("title")}
				</h1>
				<p className="text-muted-foreground mt-1">{t("description")}</p>
			</div>
			<Card>
				<CardContent className="space-y-8 p-6">
					<form onSubmit={onPasswordSubmit}>
						<div className="space-y-6">
							<div>
								<Label htmlFor="currentPassword">
									{t("currentPassword")}
								</Label>
								<Input
									id="currentPassword"
									type="password"
									className="mt-2"
								/>
							</div>
							<div>
								<Label htmlFor="newPassword">
									{t("newPassword")}
								</Label>
								<Input
									id="newPassword"
									type="password"
									className="mt-2"
								/>
							</div>
							<div>
								<Label htmlFor="confirmPassword">
									{t("confirmPassword")}
								</Label>
								<Input
									id="confirmPassword"
									type="password"
									className="mt-2"
								/>
							</div>
						</div>
						<div className="flex justify-end mt-8">
							<Button type="submit">{t("updateButton")}</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
