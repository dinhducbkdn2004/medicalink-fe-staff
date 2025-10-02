import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { LoginForm } from "@/components/forms/login-form";

export const LoginPage = () => {
	const { isAuthenticated } = useAuthStatus();

	useAuthRedirect();

	if (isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size={48} className="text-primary" />
			</div>
		);
	}
	return (
		<div className="relative min-h-svh w-full">
			<div
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					backgroundImage: `
       radial-gradient(circle at center, #93c5fd, transparent)
     `,
				}}
			/>
			<div className="relative z-10 flex min-h-svh">
				<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
					<div className="w-full max-w-sm">
						<LoginForm />
					</div>
				</div>
			</div>
		</div>
	);
};
