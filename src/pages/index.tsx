import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { getDashboardPath } from "@/hooks/useAuthRedirect";

/**
 * Index/Landing page component
 * Xử lý redirect dựa trên authentication status
 */
export default function IndexPage() {
	const { user, isAuthenticated, isLoading } = useAuthStatus();
	const navigate = useNavigate();
	const [hasRedirected, setHasRedirected] = useState(false);

	useEffect(() => {
		// Tránh redirect multiple lần
		if (hasRedirected) return;

		if (!isLoading) {
			if (isAuthenticated && user) {
				// Redirect đến dashboard phù hợp với role
				const dashboardPath = getDashboardPath(user.role);
				setHasRedirected(true);
				navigate({ to: dashboardPath, replace: true });
			} else {
				// Redirect đến login nếu chưa authenticated
				setHasRedirected(true);
				navigate({ to: "/login", replace: true });
			}
		}
	}, [isLoading, isAuthenticated, user, navigate, hasRedirected]);

	// Show loading trong khi đang xác thực
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
				<p className="text-muted-foreground text-sm">
					{isLoading ? "Đang xác thực..." : "Đang chuyển hướng..."}
				</p>
			</div>
		</div>
	);
}
