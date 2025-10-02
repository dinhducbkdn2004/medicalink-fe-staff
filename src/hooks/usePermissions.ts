import { useMemo } from "react";
import type * as React from "react";
import { useAuthStatus } from "./useAuthStatus";
import {
	hasPermission,
	hasAnyPermission,
	hasAllPermissions,
	Permission,
} from "@/lib/permissions";

export const usePermissions = () => {
	const { user } = useAuthStatus();

	return useMemo(() => {
		if (!user) {
			return {
				hasPermission: () => false,
				hasAnyPermission: () => false,
				hasAllPermissions: () => false,
				userRole: null,
			};
		}

		return {
			hasPermission: (permission: Permission) =>
				hasPermission(user.role, permission),
			hasAnyPermission: (permissions: Permission[]) =>
				hasAnyPermission(user.role, permissions),
			hasAllPermissions: (permissions: Permission[]) =>
				hasAllPermissions(user.role, permissions),
			userRole: user.role,
		};
	}, [user]);
};

interface WithPermissionProps {
	permission?: Permission;
	permissions?: Permission[];
	requireAll?: boolean;
	fallback?: React.ReactNode;
	children: React.ReactNode;
}

export const WithPermission: React.FC<WithPermissionProps> = ({
	permission,
	permissions,
	requireAll = false,
	fallback = null,
	children,
}) => {
	const { hasPermission, hasAnyPermission, hasAllPermissions } =
		usePermissions();

	if (permission && !hasPermission(permission)) {
		return fallback as React.ReactElement;
	}

	if (permissions) {
		const hasRequired = requireAll
			? hasAllPermissions(permissions)
			: hasAnyPermission(permissions);

		if (!hasRequired) {
			return fallback as React.ReactElement;
		}
	}

	return children as React.ReactElement;
};
