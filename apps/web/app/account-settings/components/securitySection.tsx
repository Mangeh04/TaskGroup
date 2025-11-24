import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { fetcher } from "@/lib/api";
import { toast } from "sonner";
import { useCallback } from "react";

export function SecuritySection({ email }: { email: string }) {
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
			toast.error("Failed to change password.");
			console.error(error);
		} else {
			toast.success("Password changed successfully.");
		}
	}, [email]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-balance">
					Password
				</h1>
				<p className="text-muted-foreground mt-1">
					Remember, your password is your digital key to your account.
					Keep it safe, keep it secure!
				</p>
			</div>

			<Card>
				<CardContent className="space-y-4 p-6">
					<form onSubmit={onPasswordSubmit}>
						<div className="space-y-2">
							<Label htmlFor="currentPassword">
								Current password
							</Label>
							<Input id="currentPassword" type="password" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="newPassword">New password</Label>
							<Input id="newPassword" type="password" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">
								Confirm new password
							</Label>
							<Input id="confirmPassword" type="password" />
						</div>

						<div className="flex justify-end">
							<Button type="submit" onSubmit={onPasswordSubmit}>
								Update
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
