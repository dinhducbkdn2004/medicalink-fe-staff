import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { Spinner } from "@/components/ui/spinner";
import { LoginForm } from "@/components/forms/login-form";
import logoImage from "@/assets/images/rect-logo-xl.png";

export const LoginPage = () => {
	const { isAuthenticated } = useAuthStatus();

	useAuthRedirect();

	if (isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size={48} className="text-light" />
			</div>
		);
	}
	return (
		<div className="relative min-h-svh w-full">
			<div
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					backgroundImage: `
      linear-gradient(to right, rgba(229,231,235,0.35) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(229,231,235,0.35) 1px, transparent 1px),
      radial-gradient(125% 125% at 50% 10%, #fff 40%, #93c5fd 100%)
    `,
					backgroundSize: `
      64px 64px,
      64px 64px,
      100% 100%
    `,
				}}
			/>
			<div className="relative z-10 flex min-h-svh">
				<img
					src={logoImage}
					alt="Logo"
					className="absolute top-6 left-6 h-12 w-auto md:top-8 md:left-11"
				/>
				<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
					<div className="w-full max-w-sm">
						<LoginForm />
					</div>
				</div>
			</div>
		</div>
	);
};
