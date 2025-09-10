/* eslint-disable unicorn/prevent-abbreviations, @typescript-eslint/explicit-function-return-type, react/jsx-sort-props */
import { useState } from "react";
import type * as React from "react";
import { useAuth } from "@/contexts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { AxiosError } from "axios";

interface FormData {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

interface FormErrors {
	oldPassword?: string;
	newPassword?: string;
	confirmPassword?: string;
	submit?: string;
}

export function ChangePasswordForm(): React.JSX.Element {
	const { changePassword } = useAuth();
	const [formData, setFormData] = useState<FormData>({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.oldPassword.trim()) {
			newErrors.oldPassword = "Current password is required";
		}

		if (!formData.newPassword.trim()) {
			newErrors.newPassword = "New password is required";
		} else if (formData.newPassword.length < 8) {
			newErrors.newPassword = "Password must be at least 8 characters";
		}

		if (!formData.confirmPassword.trim()) {
			newErrors.confirmPassword = "Please confirm your new password";
		} else if (formData.newPassword !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		if (formData.oldPassword === formData.newPassword) {
			newErrors.newPassword =
				"New password must be different from current password";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange =
		(field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));

			// Clear error when user starts typing
			if (errors[field]) {
				setErrors((prev) => ({
					...prev,
					[field]: undefined,
				}));
			}
		};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		setErrors({});
		setSuccess(false);

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			await changePassword(formData);
			setSuccess(true);
			setFormData({
				oldPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error) {
			const axiosError = error as AxiosError<{ message: string }>;
			setErrors({
				submit:
					axiosError.response?.data?.message ||
					"Failed to change password. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>Change Password</CardTitle>
				<CardDescription>
					Update your password to keep your account secure
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{success && (
						<div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
							Password changed successfully!
						</div>
					)}

					{errors.submit && (
						<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
							{errors.submit}
						</div>
					)}

					<div className="space-y-2">
						<Label htmlFor="oldPassword">Current Password</Label>
						<Input
							id="oldPassword"
							type="password"
							value={formData.oldPassword}
							placeholder="Enter your current password"
							onChange={handleInputChange("oldPassword")}
							className={errors.oldPassword ? "border-red-500" : ""}
						/>
						{errors.oldPassword && (
							<p className="text-sm text-red-600">{errors.oldPassword}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="newPassword">New Password</Label>
						<Input
							id="newPassword"
							type="password"
							value={formData.newPassword}
							placeholder="Enter your new password"
							onChange={handleInputChange("newPassword")}
							className={errors.newPassword ? "border-red-500" : ""}
						/>
						{errors.newPassword && (
							<p className="text-sm text-red-600">{errors.newPassword}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm New Password</Label>
						<Input
							id="confirmPassword"
							type="password"
							value={formData.confirmPassword}
							placeholder="Confirm your new password"
							onChange={handleInputChange("confirmPassword")}
							className={errors.confirmPassword ? "border-red-500" : ""}
						/>
						{errors.confirmPassword && (
							<p className="text-sm text-red-600">{errors.confirmPassword}</p>
						)}
					</div>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Changing Password..." : "Change Password"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
