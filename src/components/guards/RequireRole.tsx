import type * as React from "react";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import type { StaffRole } from "@/types";
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
	const { user, isLoading, isAuthenticated } = useAuthStatus();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated || !user) {
				console.log("Redirecting to login: not authenticated or no user");
				navigate({ to: "/login", replace: true });
				return;
			}

			if (!roles.includes(user.role)) {
				switch (user.role) {
					case "SUPER_ADMIN":
						navigate({ to: "/super-admin/dashboard", replace: true });
						break;
					case "ADMIN":
						navigate({ to: "/admin/dashboard", replace: true });
						break;
					case "DOCTOR":
						navigate({ to: "/doctor/dashboard", replace: true });
						break;
					default:
						navigate({ to: "/", replace: true });
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
	const { isLoading, isAuthenticated } = useAuthStatus();
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
