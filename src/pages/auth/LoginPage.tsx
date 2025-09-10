/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect } from "react";
import type * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts";
import { LoginForm } from "@/components/forms/LoginForm";

export const LoginPage = (): React.JSX.Element => {
	const { isAuthenticated, user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated && user) {
			// Redirect based on user role
			switch (user.role) {
				case "SUPER_ADMIN":
					navigate({ to: "/super-admin/dashboard" });
					break;
				case "ADMIN":
					navigate({ to: "/admin/dashboard" });
					break;
				case "DOCTOR":
					navigate({ to: "/doctor/dashboard" });
					break;
				default:
					navigate({ to: "/" });
			}
		}
	}, [isAuthenticated, user, navigate]);

	// Don't render login form if already authenticated
	if (isAuthenticated) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	return <LoginForm />;
};
