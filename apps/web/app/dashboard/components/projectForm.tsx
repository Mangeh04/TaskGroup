"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type ProjectFormProps = {
	values: { name: string; description: string };
	onChange: (field: string, value: string) => void;
	loading?: boolean;
};

export function ProjectForm({
	values,
	onChange,
	loading = false,
}: ProjectFormProps) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="project-name">Project Name</Label>
				<Input
					id="project-name"
					name="name"
					placeholder="Incredible Project"
					value={values.name}
					onChange={(e) => onChange("name", e.target.value)}
					disabled={loading}
					required
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="project-description">Description</Label>
				<Input
					id="project-description"
					name="description"
					placeholder="Description of the project"
					value={values.description}
					onChange={(e) => onChange("description", e.target.value)}
					disabled={loading}
					required
				/>
			</div>
		</div>
	);
}
