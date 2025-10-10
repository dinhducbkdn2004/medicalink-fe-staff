/**
 * Account Management Component
 * Password change, account settings, security options
 */

import { useState } from "react";
import { Shield, Key, Settings, Save } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Alert components removed as not found in project
import { Separator } from "@/components/ui/separator";

interface AccountManagementProps {
	isEditMode: boolean;
}

export function AccountManagement({ isEditMode }: AccountManagementProps) {
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [passwordError, setPasswordError] = useState("");

	const handlePasswordChange = (field: string, value: string) => {
		setPasswordForm((prev) => ({ ...prev, [field]: value }));
		setPasswordError("");
	};

	const handleSavePassword = () => {
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setPasswordError("New passwords do not match");
			return;
		}

		if (passwordForm.newPassword.length < 6) {
			setPasswordError("Password must be at least 6 characters long");
			return;
		}

		// TODO: Implement password change API call
		console.log("Changing password...");
		setIsChangingPassword(false);
		setPasswordForm({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
	};

	const handleCancelPasswordChange = () => {
		setIsChangingPassword(false);
		setPasswordForm({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
		setPasswordError("");
	};

	// Only show this component in edit mode
	if (!isEditMode) {
		return null;
	}

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<Shield className="h-4 w-4" />
					Account Security
				</CardTitle>
				<CardDescription className="text-sm">
					Manage your account security and authentication settings
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Password Management */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Label className="font-medium">Password</Label>
						{!isChangingPassword && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsChangingPassword(true)}
								className="gap-2"
							>
								<Key className="h-4 w-4" />
								Change Password
							</Button>
						)}
					</div>

					{isChangingPassword ? (
						<div className="bg-muted/50 space-y-4 rounded-lg border p-4">
							{passwordError && (
								<div className="border-destructive/20 bg-destructive/10 rounded-lg border p-3">
									<p className="text-destructive text-sm">{passwordError}</p>
								</div>
							)}

							<div className="space-y-2">
								<Label
									htmlFor="currentPassword"
									className="text-muted-foreground text-xs"
								>
									Current Password
								</Label>
								<Input
									id="currentPassword"
									type="password"
									value={passwordForm.currentPassword}
									onChange={(e) =>
										handlePasswordChange("currentPassword", e.target.value)
									}
									placeholder="Enter current password"
									className="h-9"
								/>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="newPassword"
									className="text-muted-foreground text-xs"
								>
									New Password
								</Label>
								<Input
									id="newPassword"
									type="password"
									value={passwordForm.newPassword}
									onChange={(e) =>
										handlePasswordChange("newPassword", e.target.value)
									}
									placeholder="Enter new password"
									className="h-9"
								/>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="confirmPassword"
									className="text-muted-foreground text-xs"
								>
									Confirm New Password
								</Label>
								<Input
									id="confirmPassword"
									type="password"
									value={passwordForm.confirmPassword}
									onChange={(e) =>
										handlePasswordChange("confirmPassword", e.target.value)
									}
									placeholder="Confirm new password"
									className="h-9"
								/>
							</div>

							<div className="flex gap-2 pt-2">
								<Button
									onClick={handleSavePassword}
									size="sm"
									className="gap-2"
								>
									<Save className="h-4 w-4" />
									Save Password
								</Button>
								<Button
									variant="outline"
									onClick={handleCancelPasswordChange}
									size="sm"
								>
									Cancel
								</Button>
							</div>
						</div>
					) : (
						<div className="bg-muted/50 rounded-lg border p-4">
							<p className="text-sm">
								Password was last updated on{" "}
								<span className="font-medium">March 15, 2024</span>
							</p>
						</div>
					)}
				</div>

				<Separator />

				{/* Account Settings */}
				<div className="space-y-4">
					<Label className="flex items-center gap-2 font-medium">
						<Settings className="h-4 w-4" />
						Account Settings
					</Label>

					<div className="space-y-3">
						<div className="bg-muted/50 rounded-lg border p-3">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">
										Two-Factor Authentication
									</p>
									<p className="text-muted-foreground text-xs">
										Extra security for your account
									</p>
								</div>
								<Button variant="outline" size="sm">
									Enable
								</Button>
							</div>
						</div>

						<div className="bg-muted/50 rounded-lg border p-3">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Login Notifications</p>
									<p className="text-muted-foreground text-xs">
										Get notified of new logins
									</p>
								</div>
								<Button variant="outline" size="sm">
									Configure
								</Button>
							</div>
						</div>
					</div>
				</div>

				<Separator />

				{/* Account Status */}
				<div className="space-y-3">
					<Label className="font-medium">Account Status</Label>
					<div className="bg-muted/50 rounded-lg border p-4">
						<div className="flex items-center gap-3">
							<div className="bg-primary/20 rounded-full p-2">
								<Shield className="text-primary h-4 w-4" />
							</div>
							<div>
								<p className="text-sm font-medium">Account Active</p>
								<p className="text-muted-foreground text-xs">
									Your account is in good standing
								</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
