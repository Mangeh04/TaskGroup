"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type ProjectFormValues = {
	name: string;
	description: string;
};

type ProjectFormProps = {
	values: ProjectFormValues;
	onChange: (values: ProjectFormValues) => void;
	isSubmitting: boolean;
};

export function ProjectForm({
	values,
	onChange,
	isSubmitting,
}: ProjectFormProps) {
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;

		onChange({
			...values,
			[name]: value,
		});
	}

	return (
		<div className="flex flex-col gap-3">
			<Label htmlFor="name">Project Name</Label>
			<Input
				id="name"
				name="name"
				placeholder="Incredible Project"
				required
				value={values.name}
				onChange={handleChange}
				disabled={isSubmitting}
			/>

			<Label htmlFor="description">Description</Label>
			<Input
				id="description"
				name="description"
				placeholder="Description of the project"
				required
				value={values.description}
				onChange={handleChange}
				disabled={isSubmitting}
			/>
		</div>
	);
}
