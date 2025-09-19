import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStatus } from "./useAuthStatus";
import type { StaffRole } from "@/types";


export const useAuthRedirect = () => {
	const { user, isAuthenticated, isLoading } = useAuthStatus();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && isAuthenticated && user) {
			const currentPath = window.location.pathname;

			// Nếu đang ở login page và đã authenticated, redirect tới dashboard phù hợp
			if (currentPath === "/login") {
				const dashboardPath = getDashboardPath(user.role);
				navigate({ to: dashboardPath, replace: true });
			}
		}
	}, [isLoading, isAuthenticated, user, navigate]);
};


export const getDashboardPath = (role: StaffRole): string => {
	switch (role) {
		case "SUPER_ADMIN":
			return "/super-admin/dashboard";
		case "ADMIN":
			return "/admin/dashboard";
		case "DOCTOR":
			return "/doctor/dashboard";
		default:
			return "/";
	}
};

export const hasPermission = (
	userRole: StaffRole,
	allowedRoles: StaffRole[]
): boolean => {
	return allowedRoles.includes(userRole);
};
