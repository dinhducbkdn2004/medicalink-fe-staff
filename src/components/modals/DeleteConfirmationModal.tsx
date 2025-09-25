import { AlertTriangle } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	title: string;
	description: string;
	itemName: string;
	isLoading?: boolean;
}

export function DeleteConfirmationModal({
	open,
	onOpenChange,
	onConfirm,
	title,
	description,
	itemName,
	isLoading = false,
}: Readonly<DeleteConfirmationModalProps>) {
	const handleConfirm = () => {
		onConfirm();
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-red-500" />
						{title}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{description}
						<br />
						<span className="font-semibold text-red-600">{itemName}</span>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirm}
						disabled={isLoading}
						className="bg-red-600 hover:bg-red-700"
					>
						{isLoading ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
