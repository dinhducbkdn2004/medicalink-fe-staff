import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { getDashboardPath } from "@/hooks/useAuthRedirect";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function IndexPage() {
	const { user, isAuthenticated, isLoading } = useAuthStatus();
	const navigate = useNavigate();
	const [hasRedirected, setHasRedirected] = useState(false);

	useEffect(() => {
		if (hasRedirected) return;

		if (!isLoading) {
			if (isAuthenticated && user) {
				const dashboardPath = getDashboardPath(user.role);
				setHasRedirected(true);
				navigate({ to: dashboardPath, replace: true });
			} else {
				setHasRedirected(true);
				navigate({ to: "/login", replace: true });
			}
		}
	}, [isLoading, isAuthenticated, user, navigate, hasRedirected]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
				<p className="text-muted-foreground text-sm">
					{isLoading ? <Spinner /> : "Redirecting..."}
				</p>
			</div>
		</div>
	);
}
