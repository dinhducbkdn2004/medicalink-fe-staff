import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock } from "lucide-react";

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

const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
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

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ChangePasswordModal({
	open,
	onOpenChange,
}: ChangePasswordModalProps) {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ChangePasswordFormValues>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: ChangePasswordFormValues) => {
		setIsLoading(true);
		try {
			// TODO: Implement change password API call
			console.warn("Change password values:", values);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			toast.success("Password changed successfully", {
				description: "Your password has been updated.",
			});

			form.reset();
			onOpenChange(false);
		} catch (error: unknown) {
			console.error("Error changing password:", error);
			toast.error("Failed to change password", {
				description: "Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		void form.handleSubmit(onSubmit)(e);
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Lock className="h-5 w-5" />
						Change Password
					</DialogTitle>
					<DialogDescription>
						Enter your current password and choose a new one. Your new password
						must be at least 8 characters long and contain uppercase, lowercase,
						and numeric characters.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Current Password */}
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												{...field}
												type={showCurrentPassword ? "text" : "password"}
												placeholder="Enter your current password"
												className="pr-10"
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={() =>
													setShowCurrentPassword(!showCurrentPassword)
												}
											>
												{showCurrentPassword ? (
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

						{/* New Password */}
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												{...field}
												type={showNewPassword ? "text" : "password"}
												placeholder="Enter your new password"
												className="pr-10"
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

						{/* Confirm Password */}
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm New Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												{...field}
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Confirm your new password"
												className="pr-10"
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

						{/* Actions */}
						<div className="flex justify-end space-x-2 pt-4">
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
