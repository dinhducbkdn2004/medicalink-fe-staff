import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteStaff } from "@/hooks/api/useStaffs";
import { toast } from "sonner";
import type { StaffAccount } from "@/types";

interface DeleteUserDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: StaffAccount | null;
}

const getRoleBadgeColor = (role: string) => {
	switch (role) {
		case "SUPER_ADMIN":
			return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200";
		case "ADMIN":
			return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200";
		case "DOCTOR":
			return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200";
	}
};

export const DeleteUserDialog = ({
	open,
	onOpenChange,
	user,
}: DeleteUserDialogProps) => {
	const deleteStaffMutation = useDeleteStaff();

	const handleDelete = async () => {
		if (!user) return;

		try {
			await deleteStaffMutation.mutateAsync(user.id);
			toast.success("User deleted successfully");
			onOpenChange(false);
		} catch (error) {
			toast.error("Failed to delete user");
			console.error("Delete user error:", error);
		}
	};

	const handleCancel = () => {
		onOpenChange(false);
	};

	if (!user) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[450px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-red-600" />
						Delete User
					</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete the user
						account and remove all associated data.
					</DialogDescription>
				</DialogHeader>

				{/* User Preview */}
				<div className="bg-muted/50 my-4 rounded-lg border p-4">
					<div className="flex items-center space-x-3">
						<Avatar className="h-10 w-10">
							<AvatarFallback>
								{user.fullName
									.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<p className="font-medium">{user.fullName}</p>
								<Badge
									variant="outline"
									className={getRoleBadgeColor(user.role)}
								>
									{user.role.replace("_", " ")}
								</Badge>
							</div>
							<p className="text-muted-foreground text-sm">{user.email}</p>
						</div>
					</div>
				</div>

				{/* Warning */}
				<div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
					<div className="flex">
						<AlertTriangle className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-red-600" />
						<div className="text-sm text-red-700 dark:text-red-200">
							<p className="font-medium">Warning:</p>
							<ul className="mt-1 list-inside list-disc space-y-1">
								<li>This will permanently delete the user account</li>
								<li>All user data and history will be lost</li>
								<li>Any ongoing activities will be terminated</li>
							</ul>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={handleCancel}
						disabled={deleteStaffMutation.isPending}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={() => {
							void handleDelete();
						}}
						disabled={deleteStaffMutation.isPending}
					>
						{deleteStaffMutation.isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Delete User
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
