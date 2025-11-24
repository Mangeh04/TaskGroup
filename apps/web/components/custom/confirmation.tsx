import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export type ConfirmationDialog = {
	dialogAction: string;
	text?: string;
	objective: string;
	onConfirm?: () => void | Promise<void>;
};

export function ConfirmationDialog({
	dialogAction,
	text,
	objective,
	onConfirm,
}: ConfirmationDialog) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size="icon" variant="outline" className="h-8 w-8">
					<Trash2 color="red" className="size-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to {dialogAction} this {objective}
						?
					</AlertDialogTitle>
					<AlertDialogDescription>{text}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="capitalize"
						onClick={onConfirm}
					>
						{dialogAction}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
