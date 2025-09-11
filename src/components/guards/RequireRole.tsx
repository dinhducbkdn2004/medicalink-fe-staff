import type * as React from "react";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts";
import type { StaffRole } from "@/common/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface RequireRoleProps {
	roles: Array<StaffRole>;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export const RequireRole = ({
	roles,
	children,
	fallback,
}: RequireRoleProps): React.JSX.Element => {
	const { user, isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated || !user) {
				// Redirect to login if not authenticated
				void navigate({ to: "/login" });
				return;
			}

			if (!roles.includes(user.role)) {
				// Redirect to appropriate dashboard if user doesn't have required role
				switch (user.role) {
					case "SUPER_ADMIN":
						void navigate({ to: "/super-admin/dashboard", replace: true });
						break;
					case "ADMIN":
						void navigate({ to: "/admin/dashboard", replace: true });
						break;
					case "DOCTOR":
						void navigate({ to: "/doctor/dashboard", replace: true });
						break;
					default:
						void navigate({ to: "/", replace: true });
				}
				return;
			}
		}
	}, [isLoading, isAuthenticated, user, roles, navigate]);

	if (isLoading) {
		return <Spinner size={48} className="text-primary" />;
	}

	if (!isAuthenticated || !user || !roles.includes(user.role)) {
		return fallback ? (
			<>{fallback}</>
		) : (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size={48} className="text-primary" />
			</div>
		);
	}

	return <>{children}</>;
};

interface RequireAuthProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export const RequireAuth = ({
	children,
	fallback,
}: RequireAuthProps): React.JSX.Element => {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			void navigate({ to: "/login" });
		}
	}, [isLoading, isAuthenticated, navigate]);

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size={48} className="text-primary" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return fallback ? (
			<>{fallback}</>
		) : (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size={48} className="text-primary" />
			</div>
		);
	}

	return <>{children}</>;
};
