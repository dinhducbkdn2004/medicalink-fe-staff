import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Key, Eye, EyeOff, User } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useChangeStaffPassword } from "@/hooks/api/useStaffs";
import { useChangeDoctorPassword } from "@/hooks/api/useDoctors";

const changePasswordSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type ChangeUserPasswordFormValues = z.infer<typeof changePasswordSchema>;

interface AdminChangePasswordModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user?: {
		id: string;
		fullName: string;
		email: string;
	} | null;
	userType: "admin" | "doctor";
}

export function AdminChangePasswordModal({
	open,
	onOpenChange,
	user,
	userType,
}: AdminChangePasswordModalProps) {
	const changeStaffPasswordMutation = useChangeStaffPassword();
	const changeDoctorPasswordMutation = useChangeDoctorPassword();
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm<ChangeUserPasswordFormValues>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: ChangeUserPasswordFormValues) => {
		if (!user) return;

		try {
			const mutation =
				userType === "admin"
					? changeStaffPasswordMutation
					: changeDoctorPasswordMutation;

			await mutation.mutateAsync({
				userId: user.id,
				newPassword: values.newPassword,
			});

			toast.success("Password changed successfully", {
				description: `Password for ${user.fullName} has been updated.`,
			});

			form.reset();
			onOpenChange(false);
		} catch (error: unknown) {
			console.error("Error changing user password:", error);
			toast.error("Failed to change password", {
				description: "Please try again.",
			});
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		form.handleSubmit(onSubmit)(e);
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	const isLoading =
		changeStaffPasswordMutation.isPending ||
		changeDoctorPasswordMutation.isPending;

	if (!user) return null;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Key className="h-5 w-5" />
						Change Password
					</DialogTitle>
					<DialogDescription>
						Change password for{" "}
						<span className="text-foreground font-medium">{user.fullName}</span>{" "}
						({user.email})
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="bg-muted flex items-center gap-2 rounded-md p-3">
							<User className="text-muted-foreground h-4 w-4" />
							<div className="flex-1">
								<p className="text-sm font-medium">{user.fullName}</p>
								<p className="text-muted-foreground text-xs">{user.email}</p>
							</div>
							<span className="bg-primary/10 text-primary rounded px-2 py-1 text-xs capitalize">
								{userType}
							</span>
						</div>

						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showNewPassword ? "text" : "password"}
												placeholder="Enter new password"
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() => setShowNewPassword(!showNewPassword)}
											>
												{showNewPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Confirm new password"
												{...field}
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
											>
												{showConfirmPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={handleClose}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Changing..." : "Change Password"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
