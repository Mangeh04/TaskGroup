import { Save } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Project } from "@repo/types";

export type GeneralSettingsProps = { project: Project | null };

export function GeneralSettings({ project }: GeneralSettingsProps) {
	const [name, setName] = useState(project?.name);
	const [desc, setDesc] = useState(project?.description || "");

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardHeader>
				<CardTitle className="text-base">General</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Label htmlFor="name">Project name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Project X"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="desc">Description</Label>
					<Input
						id="desc"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
						placeholder="¿De qué va el proyecto?"
					/>
				</div>

				<div className="flex justify-end">
					<Button className="gap-2">
						<Save className="size-4" /> Save
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
