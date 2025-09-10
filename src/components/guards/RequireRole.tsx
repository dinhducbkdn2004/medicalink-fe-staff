import type * as React from "react";
import { useAuth, type StaffRole } from "@/contexts";

interface RequireRoleProps {
	roles: Array<StaffRole>;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export const RequireRole = ({
	roles,
	children,
	fallback = <div>Access Denied</div>,
}: RequireRoleProps): React.JSX.Element => {
	const { user, isAuthenticated, isLoading } = useAuth();

	// Show loading while checking authentication
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	// Show fallback if not authenticated
	if (!isAuthenticated || !user) {
		return <>{fallback}</>;
	}

	// Check if user has required role
	if (!roles.includes(user.role)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

interface RequireAuthProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export const RequireAuth = ({
	children,
	fallback = <div>Please login to continue</div>,
}: RequireAuthProps): React.JSX.Element => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
};
