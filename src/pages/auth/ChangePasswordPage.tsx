import type * as React from "react";
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";

export function ChangePasswordPage(): React.JSX.Element {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
						Change Password
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
						Keep your account secure with a strong password
					</p>
				</div>
				<ChangePasswordForm />
			</div>
		</div>
	);
}
