"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

export type CustomDialogProps = {
	buttonString?: string;
	title: string;
	subtitle?: string;
	children: ReactNode;
	confirmIcon?: ReactNode;
	isIcon?: boolean;
	onSubmit?: () => void | Promise<void>;
};

export function CustomDialog({
	buttonString,
	title,
	subtitle,
	children,
	confirmIcon,
	isIcon,
	onSubmit,
}: CustomDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (onSubmit) {
			await onSubmit();
		}

		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{isIcon ? (
					<Button size="icon" variant="outline">
						{confirmIcon}
					</Button>
				) : (
					<Button>
						{confirmIcon} {buttonString}
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						{subtitle && (
							<DialogDescription>{subtitle}</DialogDescription>
						)}
					</DialogHeader>

					<div className="grid gap-4 mt-4 pb-4">{children}</div>

					<DialogFooter>
						<Button type="submit">{confirmIcon || "Save"}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
