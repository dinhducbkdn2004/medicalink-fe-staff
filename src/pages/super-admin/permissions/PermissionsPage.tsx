import { Shield, AlertCircle, Wrench } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

/**
 * PermissionsPage - REQUIRES REFACTORING
 *
 * This page previously used the deprecated Role-based permission system.
 * The backend API has been updated to use Permission Groups instead.
 *
 * TODO: Refactor this page to use the new Permission Groups API:
 * - Use usePermissions() hook instead of useRolePermissionsMatrix()
 * - Implement permission group management UI
 * - Update to use new endpoints: getPermissionGroups, assignGroupPermission, etc.
 *
 * API Documentation: docs/API_DOCUMENTATION.md
 * Related hooks needed: Create hooks in hooks/api/usePermissions.ts
 */

export function PermissionsPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Notice Card */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Wrench className="h-5 w-5" />
						<CardTitle>Page Under Refactoring</CardTitle>
					</div>
					<CardDescription>
						This page is being refactored to use the new Permission Groups API
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
						<div className="flex items-start gap-3">
							<AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
							<div className="space-y-2">
								<p className="text-sm font-medium text-amber-900 dark:text-amber-100">
									Migration in Progress
								</p>
								<p className="text-sm text-amber-800 dark:text-amber-200">
									The backend has been updated to use a more flexible Permission
									Groups system. This page needs to be refactored to use the new
									API endpoints.
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<h3 className="flex items-center gap-2 text-sm font-semibold">
							<Shield className="h-4 w-4" />
							New Features Coming
						</h3>
						<ul className="text-muted-foreground ml-6 list-inside list-disc space-y-1 text-sm">
							<li>Permission Groups management</li>
							<li>Assign permissions to groups</li>
							<li>Manage user group memberships</li>
							<li>Fine-grained permission controls</li>
							<li>Permission caching and optimization</li>
						</ul>
					</div>

					<div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
						<p className="text-sm text-blue-900 dark:text-blue-100">
							<strong>For Developers:</strong> See{" "}
							<code className="rounded bg-blue-100 px-1 py-0.5 dark:bg-blue-900">
								docs/API_DOCUMENTATION.md
							</code>{" "}
							for the new Permission Groups API documentation.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
