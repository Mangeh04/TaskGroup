"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

import { fetcher } from "@/lib/api";
import { ThemeEnum } from "@repo/types";

export function AppearanceSection() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const current = theme ?? resolvedTheme ?? "system";
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	async function updateThemePreference(theme: string) {
		await fetcher("/user/preference", {
			method: "PATCH",
			needsAuth: true,
			body: {
				theme,
			},
		});
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Appearance</h1>
				<p className="text-muted-foreground mt-1">
					Choose how the app looks. The “System” mode follows your
					device’s preference.
				</p>
			</div>

			<Card>
				<CardContent className="space-y-6 p-6">
					<div className="space-y-4">
						<h3 className="font-medium">Theme</h3>
						<RadioGroup
							value={current}
							onValueChange={async (v) => {
								setTheme(v);
								await updateThemePreference(v);
							}}
							className="grid gap-3 sm:grid-cols-3"
						>
							<ThemeOption
								id={ThemeEnum.SYSTEM}
								label="System"
								icon={<Monitor className="h-4 w-4" />}
							/>
							<ThemeOption
								id={ThemeEnum.LIGHT}
								label="Light"
								icon={<Sun className="h-4 w-4" />}
							/>
							<ThemeOption
								id={ThemeEnum.DARK}
								label="Dark"
								icon={<Moon className="h-4 w-4" />}
							/>
						</RadioGroup>
					</div>

					<div className="space-y-3">
						<Label className="text-sm">Preview</Label>
						<div className="rounded-lg border p-4 space-y-3">
							<div className="flex gap-2">
								<Swatch className="bg-primary" />
								<Swatch className="bg-secondary" />
								<Swatch className="bg-muted" />
							</div>
							<div className="flex gap-2">
								<Button size="sm">Primary</Button>
								<Button size="sm" variant="secondary">
									Secondary
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function ThemeOption({
	id,
	label,
	icon,
}: {
	id: string;
	label: string;
	icon: React.ReactNode;
}) {
	return (
		<label
			htmlFor={id}
			className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-secondary/50 transition-colors"
		>
			<RadioGroupItem id={id} value={id} />
			<div className="flex items-center gap-2">
				{icon}
				<div className="font-medium">{label}</div>
			</div>
		</label>
	);
}

function Swatch({ className }: { className: string }) {
	return <div className={`h-8 w-8 rounded-md border ${className}`} />;
}
