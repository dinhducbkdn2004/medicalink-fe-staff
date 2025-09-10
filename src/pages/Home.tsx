import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts";
import type { FunctionComponent } from "../common/types";
import { Button } from "@/components/ui/button";

export const Home = (): FunctionComponent => {
	const { user, isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && isAuthenticated && user) {
			// Redirect based on user role
			switch (user.role) {
				case "DOCTOR":
					void navigate({ to: "/doctor/dashboard" });
					break;
				case "ADMIN":
					void navigate({ to: "/admin/dashboard" });
					break;
				case "SUPER_ADMIN":
					void navigate({ to: "/super-admin/dashboard" });
					break;
				default:
					// Fallback to login if role is not recognized
					void navigate({ to: "/login" });
			}
		} else if (!isLoading && !isAuthenticated) {
			// Redirect to login if not authenticated
			void navigate({ to: "/login" });
		}
	}, [isAuthenticated, isLoading, user, navigate]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex flex-col justify-center items-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
				<p className="mt-4 text-muted-foreground">Loading...</p>
			</div>
		);
	}

	// Show welcome screen only if not authenticated and not loading
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-background flex flex-col justify-center items-center gap-8">
				<div className="text-center">
					<h1 className="text-foreground text-6xl font-bold mb-4">
						Medical Link
					</h1>
					<h2 className="text-2xl text-muted-foreground mb-8">Staff Portal</h2>
					<p className="text-lg text-muted-foreground max-w-md">
						Dashboard dành cho Bác sĩ, Quản trị viên và Super Admin
					</p>
				</div>
				<div className="flex gap-4">
					<Button
						size="lg"
						variant="default"
						onClick={() => void navigate({ to: "/login" })}
					>
						Đăng nhập
					</Button>
				</div>
			</div>
		);
	}

	// This should not be reached due to useEffect redirect, but just in case
	return null;
};
